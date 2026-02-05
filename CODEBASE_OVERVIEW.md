# SGP Project Codebase Overview

## Project Summary
**Luxe Tiles** is a premium Next.js-based e-commerce platform for selling tiles, marble, bathroom fixtures, and home accessories. The application features a modern, luxury-focused design with advanced UI components and interactive features.

---

## Technology Stack

### Core Framework
- **Next.js 16.1.6** - React-based framework with server-side rendering
- **React 19.2.0** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4.1.9** - Utility-first CSS framework

### UI Components & Libraries
- **Radix UI** - Headless UI component library (extensive usage: accordion, dialog, dropdown, navigation, etc.)
- **Lucide React** - Icon library (for navigation, actions, etc.)
- **Framer Motion** - Animation library
- **Embla Carousel** - Carousel component
- **Recharts** - Chart visualization
- **Sonner** - Toast notifications
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Styling & UI Enhancement
- **next-themes** - Dark mode support
- **class-variance-authority** - Component styling
- **tailwind-merge** - Smart Tailwind class merging
- **tailwindcss-animate** - CSS animations

### Analytics & Performance
- **Vercel Analytics** - Performance tracking

---

## Project Structure

```
app/                          # Next.js app directory
├── layout.tsx                # Root layout with providers
├── page.tsx                  # Home page
├── globals.css               # Global styles with OKLCH color system
├── about/page.tsx            # About page
├── ai-room-match/page.tsx    # AI room matching (coming soon)
├── booking/page.tsx          # Booking page
├── calculator/page.tsx       # Tile calculator (coming soon)
├── cart/page.tsx             # Shopping cart
├── checkout/page.tsx         # Checkout flow
├── collections/page.tsx      # Product collections
├── contact/page.tsx          # Contact form
├── inspiration/page.tsx      # Design inspiration gallery
├── mood-board/page.tsx       # Mood board creator (coming soon)
├── products/
│   ├── page.tsx              # Products listing with filters
│   ├── loading.tsx           # Loading skeleton
│   └── [id]/page.tsx         # Product detail page
├── tools/page.tsx            # Tools dashboard (calculator, comparator)
└── wishlist/page.tsx         # Wishlist management

components/
├── layout/
│   ├── header.tsx            # Navigation header
│   └── footer.tsx            # Footer with links
├── sections/
│   ├── hero-section.tsx      # Hero with image carousel
│   ├── featured-products.tsx # Featured products grid
│   ├── style-collections.tsx # Collections showcase
│   ├── why-choose-us.tsx     # Value propositions
│   ├── calculator-section.tsx # (Empty - placeholder)
│   └── inspirations-gallery.tsx # Inspiration gallery
├── products/
│   ├── product-grid.tsx      # Product display grid with 24 products
│   ├── product-filters.tsx   # Filter sidebar (ceramic, marble, sanitary, accessories)
│   ├── product-360-view.tsx  # 360-degree product viewer
│   └── product-comparison.tsx # Product comparison table
├── common/
│   ├── animated-section.tsx  # Scroll animation wrapper
│   ├── toast.tsx             # Toast notifications
│   └── theme-provider.tsx    # Dark mode provider
└── ui/
    └── button.tsx            # Base button component

contexts/
└── cart-context.tsx          # Shopping cart state management with localStorage

hooks/
└── use-scroll-animation.ts   # Intersection observer for scroll animations

lib/
└── utils.ts                  # Utility functions (cn() for class merging)

public/
├── apple-icon.png
├── icon-*.png
├── icon.svg
└── placeholder.svg
```

---

## Key Pages & Features

### Home Page (`/`)
- Hero section with automatic image carousel (6-second rotation)
- Featured products display
- Style collections showcase
- Why Choose Us section with benefits
- Scroll animations throughout

### Products (`/products`)
- **Collection-based filtering**: Ceramic, Marble, Sanitary Ware, Accessories
- **Sort options**: Default, Price (low/high), Newest, Top Rated
- **Mobile-responsive**: Filter drawer on mobile
- **Product Grid**: 2-4 columns depending on screen size
- Contains 24+ products with pricing and ratings

### Product Detail (`/products/[id]`)
- Multi-image gallery with carousel controls
- 360-degree product viewer component
- Product comparison table
- Quantity selector
- Add to cart functionality
- Related products suggestions
- Product specifications display
- In-stock indicators

### Collections (`/collections`)
- Showcase of 4 main collections
- Image previews with hover effects
- Product count per collection
- Links to filtered product listings

### Inspiration Gallery (`/inspiration`)
- 8+ design inspiration projects
- Categories: Bathroom, Kitchen, Living Room, Bedroom, Entryway, Outdoor, Commercial, Accent
- Featured vs standard projects
- Share functionality

### Cart (`/cart`)
- Item listing with images
- Quantity adjustment controls
- Item removal
- Summary with:
  - Subtotal
  - Tax (10%)
  - Shipping (free over Rs. 100)
  - Total calculation
- Continue shopping button

### Checkout (`/checkout`)
- Multi-step process: Shipping → Payment → Confirmation
- Progress indicator
- Form validation
- Order summary sidebar

### Contact (`/contact`)
- Contact information cards (phone, email, address)
- Contact form with validation
- Location tabs
- Business hours display

### Tools & Utilities (`/tools`)
- Tile Calculator (interactive)
- Product Comparator (up to 4 products)
- Area Estimator
- Color Visualizer

### Wishlist (`/wishlist`)
- Saved items display
- Add to cart from wishlist
- Empty state with navigation

### About (`/about`)
- Company story
- Core values section
- Statistics/achievements
- Team showcase

---

## Color System

### OKLCH Color Variables
**Light Mode (Default)**
- Background: `oklch(0.99 0.002 60)` - Off-white
- Foreground: `oklch(0.25 0.02 0)` - Near-black
- Border: `oklch(0.94 0.01 0)` - Light gray
- Muted: `oklch(0.92 0.01 0)` - Light gray
- Primary: Black/White
- Secondary: Light blue `oklch(0.45 0.03 240)`

**Dark Mode**
- Background: `oklch(0.13 0.005 60)` - Dark gray
- Foreground: `oklch(0.95 0.005 60)` - Off-white
- Card: `oklch(0.17 0.005 60)` - Slightly lighter dark
- Primary: Off-white text on dark

---

## Component Architecture

### Context Management
**CartContext** (`contexts/cart-context.tsx`)
- Manages shopping cart state
- Methods: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- Persists to localStorage
- Calculates totals and item counts

### Animation System
**useScrollAnimation Hook**
- Uses Intersection Observer API
- Triggers animations on scroll
- Supports `triggerOnce` option
- Custom root margin for early triggering

**AnimatedSection Component**
- Wrapper for animated content
- Multiple animation types: fade-up, fade-in, slide-left, slide-right, scale-up, stagger
- Configurable delay and duration
- SSR-safe (prevents hydration mismatch)

### Product Data
**24 Products Across 4 Categories**

1. **Ceramic Tiles** (6 items)
   - Sizes: 30x30, 45x45, 60x60, 75x75, 30x60 cm
   - Price range: Rs. 950-1,400
   - Finishes: Polished, Matte, Glossy, Textured, Rustic

2. **Marble** (6 items)
   - Premium Italian/International
   - Price range: Rs. 2,200-5,500
   - Finishes: Polished, Honed, Brushed, Tumbled, Flamed
   - Premium options with 15-year warranty

3. **Bathroom & Sanitary Ware** (6 items)
   - Wash basins, faucets, bathtubs, shower sets
   - Price range: Rs. 3,200-45,000
   - Premium designer options

4. **Accessories** (6 items)
   - Borders, trims, towel rails, soap dispensers
   - Price range: Rs. 450-2,800
   - Complementary products

---

## State Management

### Cart State
```typescript
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category?: string
}
```

Features:
- Add items (with duplicate handling)
- Remove items
- Update quantity
- Calculate totals
- localStorage persistence

### Theme State
- Light/Dark mode toggle
- Persisted via next-themes
- OKLCH color system for better color harmony

---

## UI/UX Patterns

### Header Navigation
- Responsive design with mobile menu drawer
- Navigation pill UI with active state
- Theme toggle (Sun/Moon icons)
- Cart badge with item count
- Logo with brand name

### Product Grid
- Responsive: 2 cols (mobile) → 3 cols (tablet) → 4 cols (desktop)
- Product cards with:
  - Image with hover zoom effect
  - Category label
  - Product name
  - Price display
  - Wishlist heart icon
  - Stock indicator

### Filters
Multiple filter categories per product type:
- **Ceramic**: Type, Finish, Size, Usage
- **Marble**: Type, Finish, Size, Origin
- **Sanitary**: Type, Material, Brand
- **Accessories**: Type, Material, Brand

### Animations
- Scroll-triggered fade-up animations
- Image carousel auto-rotate
- Hover effects on products
- Smooth transitions throughout

---

## Forms & Validation

### Contact Form
- Name, Email, Phone, Message fields
- Dropdown for inquiry type
- Multi-select for location interest

### Checkout Forms
- Shipping: Name, Email, Phone, Address
- Payment: Card details (placeholder)
- Confirmation step

### Product Filters
- Checkbox-based selections
- Collection selector
- Sort dropdown

---

## Performance Optimizations

1. **Image Optimization**
   - Next.js Image component (where used)
   - External Unsplash images with size parameters
   - Responsive image loading

2. **Code Splitting**
   - Dynamic imports via Next.js
   - Suspense boundaries for loading states

3. **Styling**
   - Tailwind CSS for optimized CSS output
   - Custom CSS variables for theming
   - Dark mode support

4. **Analytics**
   - Vercel Analytics integrated
   - Performance tracking

---

## Notable Features

### Advanced
1. **360-Degree Product Viewer** - Interactive rotation and zoom
2. **Product Comparison** - Side-by-side feature comparison
3. **Dynamic Pricing** - Original vs sale prices with discount calculation
4. **Smart Cart** - Duplicate item merging, quantity management
5. **Responsive Design** - Mobile-first approach with breakpoints

### Coming Soon
1. **AI Room Match** - AI-powered product recommendations
2. **Tile Calculator** - Intelligent area and quantity calculation
3. **Mood Board Creator** - Design collaboration tool
4. **Color Visualizer** - AR-like product previews

---

## Environment & Config

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` → root directory
- ES6 target
- Module resolution: bundler

### Next.js Configuration
- Image optimization disabled for static export
- TypeScript build errors ignored
- Image optimization: unoptimized for SSG

### Package Manager
- Uses pnpm (indicated by pnpm-lock.yaml)

---

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Theme color meta tags for browser UI
- Keyboard navigation support
- Color contrast compliance (light/dark modes)

---

## Key Business Information

**Company**: Omkar Ceramic
**Location**: Killa-pardi, Gujarat 396125, India
**Contact**: +91 9979091885 | omkar_cera@gmail.com
**Categories**: 
- Ceramic Tiles
- Marble
- Bathroom & Sanitary Ware
- Accessories

**Positioning**: Premium luxury tiles with international quality at competitive prices

---

## Development Workflow

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Main Dependencies (by category)

**UI Framework**
- next, react, react-dom

**Styling**
- tailwindcss, postcss, autoprefixer

**Components**
- @radix-ui/* (25+ component packages)

**Forms & Validation**
- react-hook-form, @hookform/resolvers, zod

**Animation**
- framer-motion

**Utilities**
- clsx, tailwind-merge, class-variance-authority

---

## Notes for Developers

1. **Cart Persistence**: Uses localStorage - test in incognito mode
2. **Image Sourcing**: Currently uses Unsplash URLs - consider CDN for production
3. **Product Database**: Hardcoded in component files - migrate to CMS/API
4. **Mobile-First**: Design prioritizes mobile, scales up
5. **Type Safety**: Full TypeScript - maintain strict mode
6. **Dark Mode**: System preference detected by next-themes

---

## Future Enhancements

1. Backend API integration for products
2. User authentication system
3. Payment gateway integration
4. Order tracking
5. Real-time inventory management
6. AR visualization
7. User reviews and ratings
8. Bulk order discounts
9. Design consultation booking
10. Newsletter subscription

---

**Last Updated**: February 5, 2026
**Framework Version**: Next.js 16.1.6
**React Version**: 19.2.0
