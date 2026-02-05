# 🗄️ Luxe Tiles E-Commerce Database Setup Guide

Complete guide for setting up Cloudinary (Image Storage) + Supabase (PostgreSQL Database) integration for the Luxe Tiles platform.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Cloudinary Setup](#cloudinary-setup)
3. [Supabase Setup](#supabase-setup)
4. [Database Schema](#database-schema)
5. [API Integration](#api-integration)
6. [Environment Configuration](#environment-configuration)
7. [Implementation Guide](#implementation-guide)
8. [Query Examples](#query-examples)
9. [Best Practices](#best-practices)

---

## 🏗️ Architecture Overview

### Current State (Client-Side Only)
- Products: Hardcoded in `ProductGrid` component
- Cart: localStorage
- Dreams/Wishlist: localStorage
- Images: External Unsplash URLs

### Target State (Full-Stack)
```
Next.js App (Frontend)
    ↓
Cloudinary API (Image Upload/Storage)
    ↓
Supabase PostgreSQL (Database)
    ↓
Local Storage (Cache)
```

---

## 🖼️ Cloudinary Setup

### Step 1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account (includes 25GB storage)
3. Go to Dashboard → Settings → Account
4. Copy your credentials:
   - **Cloud Name**: `your_cloud_name`
   - **API Key**: `your_api_key`
   - **API Secret**: `your_api_secret`

### Step 2: Configure Upload Settings
1. Go to Settings → Upload
2. Set "Unsigned Requests" → Enable
3. Add Upload Preset:
   - Go to Upload → Add upload preset
   - Name: `luxe_tiles_unsigned`
   - Signing Mode: Unsigned
   - Folder: `/luxe-tiles/products`

### Step 3: Get Environment Variables
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=luxe_tiles_unsigned
```

### Cloudinary URL Structure
```
https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{file_id}

Examples:
- https://res.cloudinary.com/luxe-tiles/image/upload/w_600,h_600,c_fill/products/ceramic_001.jpg
- https://res.cloudinary.com/luxe-tiles/image/upload/w_300,h_300,c_fill,q_80/products/marble_002.jpg
```

---

## 🗄️ Supabase Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project details:
   - **Name**: `luxe_tiles`
   - **Database Password**: Generate strong password
   - **Region**: Choose nearest region
4. Wait for project creation (5-10 minutes)

### Step 2: Get Connection Strings
1. Go to Project Settings → Database
2. Copy:
   - **Connection String**: `postgresql://...`
   - **Direct URL**: For Node.js (no connection pooling)
   - **Pooling URL**: For serverless functions

### Step 3: Install Supabase Client
```bash
npm install @supabase/supabase-js
# or
pnpm add @supabase/supabase-js
```

### Step 4: Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_connection_string
```

---

## 🗃️ Database Schema

### Table 1: `products`
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id SERIAL UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  description TEXT,
  rating DECIMAL(3, 2) DEFAULT 4.5,
  in_stock BOOLEAN DEFAULT true,
  image_url VARCHAR(500) NOT NULL,
  cloudinary_public_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_product_id ON products(product_id);
```

### Table 2: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Table 3: `cart_items`
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_quantity CHECK (quantity > 0),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
```

### Table 4: `dreams_collection` (Wishlist/Saved Inspirations)
```sql
CREATE TABLE dreams_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  inspiration_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  image_url VARCHAR(500),
  cloudinary_public_id VARCHAR(255),
  style VARCHAR(100),
  color_palette VARCHAR(255),
  tile_size VARCHAR(50),
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, inspiration_id)
);

CREATE INDEX idx_dreams_user_id ON dreams_collection(user_id);
```

### Table 5: `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE,
  total_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT,
  billing_address TEXT,
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### Table 6: `order_items`
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  CONSTRAINT valid_quantity CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

### Table 7: `product_specifications`
```sql
CREATE TABLE product_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_key VARCHAR(100) NOT NULL,
  spec_value TEXT NOT NULL
);

CREATE INDEX idx_product_specs_product_id ON product_specifications(product_id);
```

### Table 8: `product_images`
```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  cloudinary_public_id VARCHAR(255),
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
```

### Table 9: `reviews`
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL,
  title VARCHAR(255),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  helpful_count INT DEFAULT 0,
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
  UNIQUE(product_id, user_id)
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
```

### Table 10: `categories`
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  cloudinary_public_id VARCHAR(255),
  display_order INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_name ON categories(name);
```

---

## 🔌 API Integration

### Step 1: Create Supabase Client
File: `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Step 2: Create Cloudinary Utilities
File: `lib/cloudinary.ts`

```typescript
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'luxe-tiles/products')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) throw new Error('Upload failed')
  
  const data = await response.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}

export const getCloudinaryUrl = (
  publicId: string,
  width?: number,
  height?: number
) => {
  const transformations = []
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  transformations.push('c_fill')
  transformations.push('q_auto')

  const transform = transformations.join(',')
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transform}/${publicId}`
}
```

---

## 🔧 Environment Configuration

### Step 1: Create `.env.local`
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=luxe_tiles_unsigned
```

### Step 2: Update `.gitignore`
```bash
# Environment variables
.env.local
.env.*.local
.env
```

---

## 🚀 Implementation Guide

### Phase 1: Products Migration
1. Create migration file: `lib/migrations/001_products.sql`
2. Execute migration in Supabase SQL editor
3. Seed sample data with Cloudinary URLs

### Phase 2: Cart System
1. Replace localStorage with database cart
2. Link cart items to user sessions
3. Sync with Supabase in real-time

### Phase 3: Dreams Collection
1. Replace localStorage dreams with database
2. Enable sharing of dream collections
3. Add collaboration features

### Phase 4: Orders & Checkout
1. Implement order creation
2. Add order tracking
3. Email notifications

---

## 📝 Query Examples

### 1. Get All Products with Filters
```typescript
// lib/queries/products.ts
export async function getProducts(filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
}) {
  let query = supabase.from('products').select('*')

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice)
  }
  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}
```

### 2. Get Product by ID
```typescript
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      specifications:product_specifications(*),
      reviews:reviews(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
```

### 3. Add to Cart
```typescript
export async function addToCart(userId: string, productId: string, quantity: number) {
  const { data, error } = await supabase
    .from('cart_items')
    .upsert({
      user_id: userId,
      product_id: productId,
      quantity,
    })
    .select()

  if (error) throw error
  return data
}
```

### 4. Get User Cart
```typescript
export async function getUserCart(userId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      products(id, name, price, image_url)
    `)
    .eq('user_id', userId)

  if (error) throw error
  return data
}
```

### 5. Save to Dreams Collection
```typescript
export async function saveDream(userId: string, dream: DreamItem) {
  const { data, error } = await supabase
    .from('dreams_collection')
    .insert({
      user_id: userId,
      inspiration_id: dream.id,
      title: dream.title,
      category: dream.category,
      description: dream.description,
      image_url: dream.image,
      cloudinary_public_id: extractPublicId(dream.image),
      style: dream.style,
      color_palette: dream.colorPalette,
      tile_size: dream.tileSize,
    })
    .select()

  if (error) throw error
  return data
}
```

### 6. Create Order
```typescript
export async function createOrder(userId: string, orderData: OrderData) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      order_number: `ORD-${Date.now()}`,
      total_amount: orderData.totalAmount,
      shipping_address: orderData.shippingAddress,
      billing_address: orderData.billingAddress,
      payment_method: orderData.paymentMethod,
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Add order items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError
  return order
}
```

### 7. Search Products
```typescript
export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(20)

  if (error) throw error
  return data
}
```

### 8. Get Product Reviews
```typescript
export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      users(first_name, last_name)
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

---

## 🎯 Best Practices

### 1. Image Optimization
```typescript
// Always use optimized Cloudinary URLs
const getOptimizedImage = (publicId: string, context: 'thumbnail' | 'product' | 'gallery') => {
  const sizes = {
    thumbnail: { w: 300, h: 300, q: 80 },
    product: { w: 600, h: 600, q: 90 },
    gallery: { w: 1200, h: 800, q: 85 },
  }
  
  const { w, h, q } = sizes[context]
  return getCloudinaryUrl(publicId, w, h) + `,q_${q}`
}
```

### 2. Error Handling
```typescript
async function safeQuery(queryFn: () => Promise<any>) {
  try {
    return await queryFn()
  } catch (error) {
    console.error('Database query failed:', error)
    throw new Error('Database operation failed')
  }
}
```

### 3. Caching Strategy
```typescript
// Use Next.js ISR or SWR for client-side
import useSWR from 'swr'

export function useProduct(id: string) {
  const { data, error } = useSWR(
    `/api/products/${id}`,
    fetcher,
    { revalidateOnFocus: false }
  )
  return { data, error, loading: !data && !error }
}
```

### 4. Pagination
```typescript
const PAGE_SIZE = 20

export async function getPaginatedProducts(page: number) {
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .range(from, to)

  return { data, total: count, pages: Math.ceil(count! / PAGE_SIZE) }
}
```

### 5. Real-time Subscriptions
```typescript
export function subscribeToProductUpdates(callback: (payload: any) => void) {
  return supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      callback
    )
    .subscribe()
}
```

---

## 📊 Data Migration Script

### Seed Initial Products
File: `lib/seed.ts`

```typescript
import { supabase } from './supabase'

const products = [
  {
    product_id: 1,
    name: 'Ceramic White Pearl 60x60',
    category: 'Ceramic Tiles',
    price: 1200,
    rating: 4.9,
    in_stock: true,
    image_url: 'https://res.cloudinary.com/luxe-tiles/image/upload/w_600,h_600,c_fill/v1/products/ceramic-white-pearl.jpg',
    cloudinary_public_id: 'v1/products/ceramic-white-pearl',
    description: 'Premium ceramic tiles with glossy finish',
  },
  // ... more products
]

export async function seedDatabase() {
  const { error } = await supabase
    .from('products')
    .insert(products)

  if (error) {
    console.error('Seeding failed:', error)
  } else {
    console.log('Database seeded successfully')
  }
}
```

---

## 🔐 Security Checklist

- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Set up Supabase API key restrictions
- [ ] Enable CORS only for your domain
- [ ] Never commit credentials to git
- [ ] Use environment variables for all secrets
- [ ] Implement rate limiting on API routes
- [ ] Validate all user inputs server-side
- [ ] Use HTTPS for all external API calls
- [ ] Implement proper authentication flow
- [ ] Regular security audits

---

## 📱 Next Steps

1. **Set up Cloudinary account** (20 min)
2. **Create Supabase project** (10 min)
3. **Run database migrations** (5 min)
4. **Seed initial data** (10 min)
5. **Update environment variables** (5 min)
6. **Migrate products from hardcoded → database** (1-2 hours)
7. **Implement cart system** (2-3 hours)
8. **Implement authentication** (3-4 hours)
9. **Test and deploy** (2-3 hours)

---

## 🆘 Troubleshooting

### Cloudinary Upload Issues
- **Check upload preset is unsigned**
- **Verify folder exists in Cloudinary**
- **Test with curl before integrating**

### Supabase Connection Issues
- **Verify environment variables**
- **Check network tab in browser**
- **Enable Supabase debug logging**

### Image Display Issues
- **Verify Cloudinary public ID format**
- **Check CORS settings**
- **Use browser dev tools to inspect URLs**

---

## 📚 Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

---

**Last Updated**: February 5, 2026  
**Version**: 1.0  
**Status**: Production Ready ✅
