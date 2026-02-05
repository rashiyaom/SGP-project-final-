# 🚀 Complete Cloudinary + Supabase Implementation Guide

**Luxe Tiles E-Commerce Platform**  
Complete step-by-step guide for setting up image storage and database integration

---

## 📋 Table of Contents

1. [Quick Start (10 min)](#quick-start-10-min)
2. [Cloudinary Setup (Detailed)](#cloudinary-setup-detailed)
3. [Supabase Setup (Detailed)](#supabase-setup-detailed)
4. [Environment Configuration](#environment-configuration)
5. [Code Implementation](#code-implementation)
6. [API Integration Patterns](#api-integration-patterns)
7. [Database Queries](#database-queries)
8. [Testing & Validation](#testing--validation)
9. [Troubleshooting](#troubleshooting)
10. [Performance Optimization](#performance-optimization)
11. [Security Hardening](#security-hardening)
12. [Deployment Checklist](#deployment-checklist)

---

## ⚡ Quick Start (10 min)

If you're in a hurry, follow this quick path:

### 1. Cloudinary Account (2 min)
```bash
# Visit https://cloudinary.com/users/register/free
# Sign up → Copy credentials from Dashboard
# Settings → Upload → Add unsigned preset "luxe_tiles_unsigned"
```

### 2. Supabase Project (3 min)
```bash
# Visit https://supabase.com
# Create new project → Copy credentials
# Run SQL migrations in SQL editor
```

### 3. Environment Variables (2 min)
```bash
# Create .env.local in project root
# Add all credentials (see section below)
# npm install @supabase/supabase-js
```

### 4. Test Connection (3 min)
```bash
# Create lib/supabase.ts
# Create lib/cloudinary.ts
# Run npm run dev and check console
```

**Estimated Total Time**: 10 minutes

---

## 🖼️ Cloudinary Setup (Detailed)

### Step 1: Create Free Account

1. Go to **[cloudinary.com](https://cloudinary.com)**
2. Click **"Sign Up for Free"** (top right)
3. Fill in details:
   - Email: your-email@example.com
   - Password: Strong password
   - First/Last Name: Your name
4. Verify email (check inbox)
5. Complete account setup form

**Free Plan Includes:**
- 25 GB storage
- 25 GB bandwidth/month
- Unlimited uploads
- API access
- 1 project

### Step 2: Get Cloud Credentials

1. After login, go to **Dashboard**
2. Copy these values to a safe location:
   ```
   Cloud Name: ________________
   API Key: ________________
   API Secret: ________________
   ```
3. **Never share these values** - treat as passwords

### Step 3: Configure Upload Settings

1. Go to **Settings** (gear icon) → **Upload**
2. Scroll to "Upload presets" section
3. Click **"Add upload preset"**
4. Fill in:
   - **Preset Name**: `luxe_tiles_unsigned`
   - **Signing Mode**: `Unsigned` (important!)
   - **Save**: Click "Save"

5. In the same Settings page, find "Save to folder":
   - Set to `/luxe-tiles/products`

### Step 4: Verify Setup

Test upload via Cloudinary Dashboard:
1. Go to **Media Library**
2. Click **Upload** button
3. Select an image file
4. Verify it appears in `/luxe-tiles/products` folder

### Step 5: Understand URL Format

Cloudinary uses this URL structure:
```
https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{TRANSFORMATIONS}/{PUBLIC_ID}
```

**Examples:**
```
# Original image
https://res.cloudinary.com/luxe-tiles/image/upload/v1700000000/luxe-tiles/products/ceramic_001.jpg

# 400x400 square, high quality
https://res.cloudinary.com/luxe-tiles/image/upload/w_400,h_400,c_fill,q_90/v1700000000/luxe-tiles/products/ceramic_001.jpg

# Thumbnail (300x300, auto quality)
https://res.cloudinary.com/luxe-tiles/image/upload/w_300,h_300,c_fill,q_auto/v1700000000/luxe-tiles/products/ceramic_001.jpg

# Gallery image (1200 wide, 80% quality)
https://res.cloudinary.com/luxe-tiles/image/upload/w_1200,c_fill,q_80/v1700000000/luxe-tiles/products/ceramic_001.jpg
```

**Common Transformations:**
- `w_400` - Width 400px
- `h_400` - Height 400px
- `c_fill` - Crop to fill dimensions
- `c_scale` - Scale to fit dimensions
- `q_90` - Quality 90%
- `q_auto` - Auto-detect best quality
- `f_auto` - Auto-detect best format (WebP/AVIF)

---

## 🗄️ Supabase Setup (Detailed)

### Step 1: Create Project

1. Go to **[supabase.com](https://supabase.com)**
2. Sign up or login
3. Click **"New Project"**
4. Fill in:
   ```
   Project Name: luxe_tiles
   Database Password: ________________ (generate strong password)
   Region: Select closest to you
   Pricing: Free plan
   ```
5. Click **"Create new project"**
6. **Wait 5-10 minutes** for initialization

### Step 2: Get Connection Credentials

1. Go to **Settings** (gear icon, bottom-left)
2. Click **"Database"**
3. Copy credentials:
   ```
   Host: db.XXXXXX.supabase.co
   Port: 5432
   Database: postgres
   User: postgres
   Password: (the one you created)
   
   Connection String:
   postgresql://postgres:XXXXXX@db.XXXXXX.supabase.co:5432/postgres
   
   Direct URL (Node.js):
   postgresql://postgres:XXXXXX@db.XXXXXX.supabase.co:5432/postgres?schema=public
   ```

4. Also get **API Keys**:
   - Go to **Settings** → **API**
   - Copy:
     ```
     URL: https://XXXXXX.supabase.co
     Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

### Step 3: Install Dependencies

```bash
npm install @supabase/supabase-js
# or
pnpm add @supabase/supabase-js
```

### Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the SQL from **Database Schema** section (below)
4. Click **"Run"**
5. Verify tables appear in **Table Editor**

### Step 5: Enable Row Level Security (RLS)

For each table in **Authentication** → **Policies**:

1. Click on table name
2. Click **"Enable RLS"**
3. Add policies as needed (see Security section)

---

## 🗃️ Database Schema (Complete SQL)

### Run All Tables

Copy this entire SQL block into Supabase SQL Editor and execute:

```sql
-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
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
CREATE INDEX idx_products_in_stock ON products(in_stock);

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  profile_image_url VARCHAR(500),
  cloudinary_public_id VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  cloudinary_public_id VARCHAR(255),
  display_order INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_display_order ON categories(display_order);

-- =====================================================
-- PRODUCT IMAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  cloudinary_public_id VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_is_primary ON product_images(is_primary);

-- =====================================================
-- PRODUCT SPECIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS product_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_key VARCHAR(100) NOT NULL,
  spec_value TEXT NOT NULL
);

CREATE INDEX idx_product_specs_product_id ON product_specifications(product_id);

-- =====================================================
-- CART ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_quantity CHECK (quantity > 0),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- =====================================================
-- DREAMS COLLECTION TABLE (Saved Inspirations/Wishlist)
-- =====================================================
CREATE TABLE IF NOT EXISTS dreams_collection (
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
CREATE INDEX idx_dreams_saved_at ON dreams_collection(saved_at);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_amount DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  billing_address TEXT,
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  CONSTRAINT valid_quantity CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL,
  title VARCHAR(255),
  comment TEXT,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
  UNIQUE(product_id, user_id)
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- =====================================================
-- WISHLIST TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);

-- =====================================================
-- AUDIT LOG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_audit_log_action ON audit_log(action);
```

---

## 🔐 Environment Configuration

### Create `.env.local` File

In your project root directory, create a new file called `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your_project_id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=luxe_tiles_unsigned

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Update `.gitignore`

Make sure these lines are in your `.gitignore`:

```bash
# Environment variables - NEVER commit these
.env
.env.local
.env.*.local
.env.production.local
.env.development.local
.env.test.local
```

### Verify Setup

```bash
# Check that environment variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

---

## 💻 Code Implementation

### 1. Create Supabase Client

**File: `lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-application-name': 'luxe-tiles',
    },
  },
})

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          product_id: number
          name: string
          category: string
          price: number
          original_price: number | null
          description: string | null
          rating: number
          in_stock: boolean
          image_url: string
          cloudinary_public_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Row']>
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          profile_image_url: string | null
          address: string | null
          city: string | null
          country: string | null
          postal_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Row']>
      }
      // Add more table types as needed
    }
  }
}
```

### 2. Create Cloudinary Utilities

**File: `lib/cloudinary.ts`**

```typescript
import { v2 as cloudinary } from 'cloudinary'

// Configuration
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.warn('Missing Cloudinary credentials')
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
})

/**
 * Get optimized Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number
    height?: number
    quality?: number | 'auto'
    format?: 'auto' | 'jpg' | 'png' | 'webp'
    crop?: 'fill' | 'scale' | 'fit'
  }
) {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options || {}

  const transformations = []

  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (crop) transformations.push(`c_${crop}`)
  if (format) transformations.push(`f_${format}`)
  if (quality) transformations.push(`q_${quality}`)

  const transform = transformations.join(',')
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${publicId}`
}

/**
 * Upload file to Cloudinary (unsigned)
 */
export async function uploadToCloudinary(file: File): Promise<{
  url: string
  publicId: string
  width: number
  height: number
}> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET || 'luxe_tiles_unsigned')
  formData.append('folder', 'luxe-tiles/products')
  formData.append('context', `filename=${file.name}`)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Upload failed: ${error.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  }
}

/**
 * Delete file from Cloudinary (requires API key)
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId)
  
  if (result.result !== 'ok') {
    throw new Error(`Failed to delete: ${publicId}`)
  }
}

/**
 * Get thumbnail URL
 */
export function getThumbnailUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, { width: 300, height: 300, quality: 80 })
}

/**
 * Get product image URL
 */
export function getProductImageUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, { width: 600, height: 600, quality: 90 })
}

/**
 * Get gallery image URL
 */
export function getGalleryImageUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, { width: 1200, height: 800, quality: 85 })
}
```

### 3. Create Database Query Helpers

**File: `lib/db/products.ts`**

```typescript
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']

/**
 * Get all products with optional filters
 */
export async function getProducts(filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
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
  if (filters?.inStockOnly) {
    query = query.eq('in_stock', true)
  }

  const { data, error } = await query.order('product_id')

  if (error) {
    console.error('Error fetching products:', error)
    throw error
  }

  return data as Product[]
}

/**
 * Get product by ID
 */
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      images:product_images(id, image_url, cloudinary_public_id, alt_text, is_primary),
      specifications:product_specifications(spec_key, spec_value),
      reviews:reviews(id, rating, title, comment, created_at)
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    throw error
  }

  return data
}

/**
 * Search products
 */
export async function searchProducts(query: string, limit = 20) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(limit)

  if (error) {
    console.error('Error searching products:', error)
    throw error
  }

  return data as Product[]
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('in_stock', true)
    .order('name')

  if (error) {
    console.error('Error fetching category products:', error)
    throw error
  }

  return data as Product[]
}

/**
 * Get product reviews
 */
export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(
      `
      id,
      rating,
      title,
      comment,
      helpful_count,
      created_at,
      users(first_name, last_name)
    `
    )
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }

  return data
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 6) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .gte('rating', 4.5)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured products:', error)
    throw error
  }

  return data as Product[]
}

/**
 * Create product (admin only)
 */
export async function createProduct(product: ProductInsert) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    throw error
  }

  return data
}

/**
 * Update product
 */
export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    throw error
  }

  return data
}
```

---

## 🔌 API Integration Patterns

### Pattern 1: Server Component with Direct Query

**File: `app/products/page.tsx`**

```typescript
import { getProducts } from '@/lib/db/products'
import ProductGrid from '@/components/product-grid'

export default async function ProductsPage() {
  try {
    const products = await getProducts()
    return <ProductGrid products={products} />
  } catch (error) {
    return <div>Failed to load products</div>
  }
}
```

### Pattern 2: API Route Handler

**File: `app/api/products/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getProducts, searchProducts } from '@/lib/db/products'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let data

    if (search) {
      data = await searchProducts(search)
    } else {
      data = await getProducts({
        category: category || undefined,
      })
    }

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}
```

### Pattern 3: Client Component with useEffect

**File: `components/product-list.tsx`**

```typescript
'use client'

import { useEffect, useState } from 'react'

export function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const { data } = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

---

## 📊 Database Queries (Ready to Use)

### Query 1: Get Cart Items with Products

```typescript
export async function getUserCart(userId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(
      `
      id,
      quantity,
      products(
        id,
        name,
        price,
        original_price,
        image_url,
        cloudinary_public_id
      )
    `
    )
    .eq('user_id', userId)

  if (error) throw error
  return data
}
```

### Query 2: Create Order with Items

```typescript
export async function createOrder(
  userId: string,
  orderData: {
    items: Array<{ productId: string; quantity: number; price: number }>
    totalAmount: number
    shippingAddress: string
  }
) {
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      order_number: `ORD-${Date.now()}`,
      total_amount: orderData.totalAmount,
      shipping_address: orderData.shippingAddress,
      status: 'pending',
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Create order items
  const orderItems = orderData.items.map((item) => ({
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

### Query 3: Save Dream/Inspiration

```typescript
export async function saveDream(
  userId: string,
  dream: {
    inspirationId: string
    title: string
    category: string
    description: string
    image: string
    cloudinaryPublicId: string
    style: string
    colorPalette: string
    tileSize: string
  }
) {
  const { data, error } = await supabase
    .from('dreams_collection')
    .insert({
      user_id: userId,
      inspiration_id: dream.inspirationId,
      title: dream.title,
      category: dream.category,
      description: dream.description,
      image_url: dream.image,
      cloudinary_public_id: dream.cloudinaryPublicId,
      style: dream.style,
      color_palette: dream.colorPalette,
      tile_size: dream.tileSize,
    })
    .select()

  if (error) throw error
  return data
}
```

### Query 4: Get User Orders

```typescript
export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      order_number,
      total_amount,
      status,
      created_at,
      order_items(
        id,
        quantity,
        unit_price,
        products(name, image_url)
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

### Query 5: Get Wishlist

```typescript
export async function getUserWishlist(userId: string) {
  const { data, error } = await supabase
    .from('wishlist')
    .select(
      `
      id,
      products(
        id,
        name,
        price,
        image_url,
        rating,
        in_stock
      )
    `
    )
    .eq('user_id', userId)

  if (error) throw error
  return data
}
```

---

## ✅ Testing & Validation

### Test Cloudinary Upload

```typescript
// In browser console or test file
async function testCloudinaryUpload() {
  const file = new File(['test'], 'test.txt', { type: 'text/plain' })
  
  try {
    const result = await uploadToCloudinary(file)
    console.log('✅ Upload successful:', result)
  } catch (error) {
    console.error('❌ Upload failed:', error)
  }
}

testCloudinaryUpload()
```

### Test Supabase Connection

```typescript
// In browser console or test file
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count')
    
    if (error) {
      console.error('❌ Connection failed:', error)
    } else {
      console.log('✅ Connection successful')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testSupabaseConnection()
```

### Validation Checklist

- [ ] Cloudinary credentials are in `.env.local`
- [ ] Upload preset is unsigned
- [ ] Supabase project is created
- [ ] Database tables are created
- [ ] `@supabase/supabase-js` is installed
- [ ] `lib/supabase.ts` exists
- [ ] `lib/cloudinary.ts` exists
- [ ] API routes work
- [ ] No console errors

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:**
1. Check `.env.local` file exists in project root
2. Verify variable names match exactly (including `NEXT_PUBLIC_` prefix)
3. Restart dev server: `npm run dev`
4. Check Supabase Dashboard for correct values

### Issue: "Cloudinary upload 401 Unauthorized"

**Solution:**
1. Verify upload preset is set to "Unsigned"
2. Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct
3. Verify `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is correct
4. Test upload in Cloudinary dashboard directly

### Issue: "Table 'products' does not exist"

**Solution:**
1. Go to Supabase SQL Editor
2. Run the complete SQL schema (copy-paste all at once)
3. Wait for execution to complete
4. Go to Table Editor and refresh

### Issue: "Error: connect ECONNREFUSED 127.0.0.1:5432"

**Solution:**
1. Check internet connection
2. Verify Supabase project is active (not paused)
3. Check connection string is correct
4. Try using connection pooling URL instead

### Issue: CORS errors in browser

**Solution:**
1. Go to Supabase Settings → API
2. In "CORS settings", add your domain
3. For development: `http://localhost:3000`
4. For production: `https://yourdomain.com`

---

## ⚡ Performance Optimization

### 1. Image Optimization

```typescript
// Always use Cloudinary URLs with quality parameter
const optimizedUrl = getCloudinaryUrl(publicId, {
  width: 400,
  height: 400,
  quality: 'auto',  // Auto-detects best quality
  format: 'auto',   // Uses WebP/AVIF if supported
})
```

### 2. Database Query Optimization

```typescript
// Use select() to fetch only needed columns
const { data } = await supabase
  .from('products')
  .select('id, name, price')  // Only these fields
  .limit(10)
```

### 3. Caching with SWR

```typescript
import useSWR from 'swr'

export function useProducts() {
  const { data, error } = useSWR('/api/products', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,  // Cache for 1 minute
  })

  return { data, error, isLoading: !data && !error }
}
```

### 4. Pagination

```typescript
const ITEMS_PER_PAGE = 20

export async function getPaginatedProducts(page: number) {
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const { data, count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .range(from, to)

  return {
    data,
    total: count,
    pages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
  }
}
```

---

## 🔐 Security Hardening

### 1. Enable Row Level Security (RLS)

```sql
-- Go to Supabase → Authentication → Policies
-- For each table, enable RLS and add:

CREATE POLICY "Users can view public products"
  ON products FOR SELECT USING (true);

CREATE POLICY "Users can view their own data"
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can manage their own cart"
  ON cart_items FOR ALL USING (auth.uid() = user_id);
```

### 2. Validate User Input

```typescript
import { z } from 'zod'

const ProductSchema = z.object({
  name: z.string().min(3).max(255),
  price: z.number().positive(),
  category: z.string().min(1),
})

export async function createProduct(data: unknown) {
  const validated = ProductSchema.parse(data)
  return await supabase.from('products').insert([validated])
}
```

### 3. API Route Authentication

```typescript
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const token = cookies().get('auth-token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify token and proceed
}
```

### 4. Environment Variable Protection

```typescript
// Only use NEXT_PUBLIC_ for client-side code
// Server-only secrets should not have NEXT_PUBLIC_ prefix

// ✅ OK - can be exposed to client
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=value

// ❌ NOT OK - API secret should be server-only
CLOUDINARY_API_SECRET=value  // No NEXT_PUBLIC_
```

---

## 📋 Deployment Checklist

Before deploying to production:

### Pre-Deployment (1 hour)

- [ ] **Environment Variables**
  - [ ] All variables in `.env.local`
  - [ ] Create production `.env` for deployment platform
  - [ ] Never commit secrets to git
  - [ ] Use deployment platform's secret manager

- [ ] **Database**
  - [ ] All tables created
  - [ ] RLS policies enabled
  - [ ] Indexes created
  - [ ] Backups configured
  - [ ] Test restore process

- [ ] **Cloudinary**
  - [ ] Upload preset created
  - [ ] CORS configured
  - [ ] Transformation settings optimized
  - [ ] Storage quota checked

- [ ] **Testing**
  - [ ] Upload functionality works
  - [ ] Database queries work
  - [ ] Search functionality works
  - [ ] Orders can be created
  - [ ] Images load correctly

- [ ] **Security**
  - [ ] API keys rotated
  - [ ] RLS policies enabled
  - [ ] Input validation in place
  - [ ] CORS restricted to domain
  - [ ] Rate limiting enabled

- [ ] **Performance**
  - [ ] Images optimized
  - [ ] Queries use indexes
  - [ ] Caching enabled
  - [ ] Pagination working
  - [ ] Load times acceptable

### Deployment Platforms

#### Vercel (Recommended)

```bash
# 1. Connect repository
# 2. Set environment variables in project settings
# 3. Deploy

npm run build
# Vercel automatically deploys
```

#### Railway

```bash
# 1. Connect repository
# 2. Add environment variables
# 3. Deploy

railway up
```

#### Netlify

```bash
# 1. Connect repository
# 2. Set build command: npm run build
# 3. Set environment variables
# 4. Deploy
```

### Post-Deployment (15 min)

- [ ] **Verify Setup**
  - [ ] Visit production URL
  - [ ] Test image upload
  - [ ] Test product search
  - [ ] Check console for errors
  - [ ] Monitor error logs

- [ ] **Monitoring**
  - [ ] Set up error tracking (Sentry)
  - [ ] Set up uptime monitoring
  - [ ] Enable analytics
  - [ ] Monitor database performance

- [ ] **Backups**
  - [ ] Supabase backups enabled
  - [ ] Cloudinary backups configured
  - [ ] Test restore process
  - [ ] Document recovery procedure

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Next.js Docs**: https://nextjs.org/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs/

---

## 🎯 Next Steps

1. **Today (10 min)**: Create Cloudinary & Supabase accounts
2. **Tomorrow (1 hour)**: Set up all credentials and create tables
3. **This Week (5 hours)**: Implement database integration
4. **Next Week (5 hours)**: Add authentication
5. **Production**: Deploy and monitor

---

**Last Updated**: February 5, 2026  
**Version**: 2.0 (Comprehensive)  
**Status**: Ready for Implementation ✅  
**Author**: AI Assistant  
**License**: MIT
