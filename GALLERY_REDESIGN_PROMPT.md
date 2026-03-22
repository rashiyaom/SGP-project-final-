# Premium & Elegant Gallery Section Redesign Prompt
## Omkar Ceramic - State-of-the-Art Inspiration Gallery

---

## 🎯 EXECUTIVE VISION

Create a **luxury-grade, pixel-perfect, premium inspiration gallery** that elevates the user experience from basic image browsing to an immersive, interactive exploration of premium ceramic tiles and home essentials. The gallery should be a **showcase-quality feature** that demonstrates Omkar Ceramic's commitment to excellence and design innovation.

---

## 📋 DESIGN SYSTEM ALIGNMENT

### Color Palette (OKLCH-based)
- **Background**: `oklch(0.99 0.002 60)` (Light mode) / `oklch(0.13 0.005 60)` (Dark mode)
- **Foreground**: `oklch(0.25 0.02 0)` (Light mode) / `oklch(0.95 0.005 60)` (Dark mode)
- **Accent Gold**: `#d4af37` to `#bfa14a` (Premium luxury gradient)
- **Secondary**: `oklch(0.45 0.03 240)` (Soft blue undertones)
- **Border**: `oklch(0.94 0.01 0)` (Light mode) / `oklch(0.28 0.005 60)` (Dark mode)
- **Card**: `oklch(1 0 0)` (Light mode) / `oklch(0.17 0.005 60)` (Dark mode)

### Typography
- **Serif Font**: `font-serif` for headings (luxury, elegant aesthetic)
- **Sans-serif**: `Geist` font family for body (modern, clean)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing & Radius
- **Border Radius**: `0.75rem` (consistent rounded corners)
- **Container Max-Width**: `7xl` (87.5rem / 1400px)
- **Padding**: `px-6 sm:px-12` (consistent horizontal padding)
- **Gap System**: Use Tailwind spacing scale (gap-4, gap-6, gap-8 for variety)

### Animation & Motion
- **Framework**: Framer Motion (already integrated)
- **Transition Duration**: 300-500ms for smooth motion
- **Easing**: `ease-out` for enter animations, `ease-in-out` for interactions
- **Stagger Effects**: Offset child animations for cascading visual impact

---

## 🏗️ GALLERY ARCHITECTURE

### Two-Layer Gallery System

#### **Layer 1: Gallery Listing Page** (`/app/inspiration/page.tsx`)
A **premium grid showcase** featuring all inspiration items with advanced filtering, sorting, and discovery features.

**Layout Structure:**
```
┌─────────────────────────────────────────────┐
│              HERO BANNER SECTION            │
│  (Heroic title + breadcrumb + description) │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│   SEARCH + FILTER + SORT TOOLBAR (Sticky)   │
│ [Search Input] [Category Filter] [Sort DD]  │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│       GALLERY GRID WITH MASONRY LAYOUT      │
│  Smart responsive columns (1→2→3→4)        │
│  Variable heights based on image aspect     │
│  Smooth hover transitions & overlays        │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│          PAGINATION / INFINITE SCROLL       │
│  Load More button or auto-load on scroll    │
└─────────────────────────────────────────────┘
```

#### **Layer 2: Gallery Detail Page** (`/app/inspiration/[id]/page.tsx`)
An **immersive full-screen experience** showcasing individual inspiration items with rich interactive features and product recommendations.

**Layout Structure:**
```
┌─────────────────────────────────────────────┐
│              HERO IMAGE SECTION             │
│  Full-width/tall image with gradient fade  │
│  Floating action buttons (Save, Share, AR) │
│  Breadcrumb navigation at top               │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│          DETAILS + INTERACTIONS SECTION     │
│  Title, Description, Category, Specs       │
│  Action buttons row (Save, Share, View AR) │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│       FEATURED PRODUCTS (CAROUSEL)          │
│  Related products with smooth scrolling     │
│  Product cards with pricing & ratings      │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│     SIMILAR INSPIRATIONS (HORIZONTAL)       │
│  Category-based recommendations             │
│  Visual thumbnail cards for quick nav       │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│         NAVIGATION SECTION (STICKY)         │
│  Previous/Next gallery item navigation      │
│  Progress indicator (X of Y)                │
└─────────────────────────────────────────────┘
```

---

## 🎨 VISUAL DESIGN SPECIFICATIONS

### Gallery Listing Page (`/app/inspiration/page.tsx`)

#### **1. Hero Banner Section**
```tsx
/* Specifications */
- Full viewport width minus padding
- Tall hero with background gradient or image
- Height: 400px to 600px depending on viewport
- Gradient: from-muted via-transparent to-background
- Contains:
  * Centered title (serif font, 3xl-5xl)
  * Subtitle/tagline (muted text, elegant positioning)
  * Decorative elements (thin border separators, icons)
  * Background blur/overlay effects

/* Animation on Load */
- Title fades in from opacity-0 with staggered letter animation
- Subtitle slides up from bottom
- Duration: 400-600ms with ease-out
```

**Design Notes:**
- Use a hero image that showcases premium ceramic tiles in context
- Overlay a semi-transparent gradient (dark 40% to transparent)
- Add subtle animated particles or geometric shapes in background
- Text should have shadow for readability: `drop-shadow-lg text-shadow-2xl`

#### **2. Sticky Search + Filter Toolbar**
```tsx
/* Layout */
- Fixed/sticky positioning at top of page (below header)
- 60px height with flex layout
- Background: backdrop-blur glass morphism effect
- Border: thin border-bottom with border color
- Padding: px-6 sm:px-12
- Z-index: high enough to sit above content but below header

/* Components */

A) SEARCH INPUT
   - Placeholder: "Search inspirations..."
   - Icon: magnifying glass (lucide-react)
   - Style: bg-card border-border rounded-full h-10
   - Debounced search (300ms delay)
   - Clear button (X icon) when text present
   - Focus state: ring-2 ring-accent border-accent

B) CATEGORY FILTER (Multi-select Dropdown)
   - Label: "Category"
   - Options: All, Ceramic Tiles, Marble, Bathroom & Sanitary Ware, Accessories
   - Style: Ghost/outline button with dropdown menu
   - Selected state: bg-accent text-accent-foreground
   - Icon: ChevronDown from lucide-react
   - Animation: smooth dropdown slide-down

C) SORT DROPDOWN
   - Label: "Sort by"
   - Options:
     * Latest (default)
     * Most Popular
     * Trending
     * A-Z
   - Style: Ghost button with dropdown
   - Selected indicator: checkmark icon
   - Animation: slide-down with fade-in children

D) CLEAR FILTERS BUTTON (Conditional)
   - Only shows when filters active
   - Style: text-sm text-muted-foreground hover:text-foreground
   - Icon: X icon for reset
   - Click: resets all filters to default

/* Animation */
- Toolbar slides down from top on page load
- Filter options fade in when dropdown opens
- Smooth state transitions on filter changes (200ms)
```

**Implementation Notes:**
- Use Radix UI dropdown components for accessibility
- Implement URL query parameters for filter persistence (e.g., `?category=marble&sort=trending`)
- Add visual feedback: skeleton loaders while filtering
- Use debounced search to prevent excessive API calls

#### **3. Masonry Gallery Grid**
```tsx
/* Grid Specifications */
- Responsive columns:
  * Mobile (< 640px): 1 column
  * Tablet (640px - 1024px): 2 columns
  * Desktop (1024px - 1536px): 3 columns
  * Large (≥ 1536px): 4 columns
- Gap between items: gap-6 (24px)
- Padding: px-6 sm:px-12 py-12
- Masonry layout: items have variable heights (not uniform)
- Image aspect ratios preserved (no forced square crops)

/* Individual Card Styling */
- Background: card color
- Border: 1px solid border color
- Border Radius: 0.75rem
- Shadow: subtle shadow on hover
- Overflow: hidden (for rounded corners)
- Position: relative (for overlays)

/* Card Content Structure */
Container:
  ├─ Image Wrapper
  │  ├─ Image (object-cover, full container)
  │  ├─ Gradient Overlay (bottom 0 to 40% opacity black)
  │  └─ Action Buttons (positioned absolute bottom-4)
  │     ├─ Save/Heart Button
  │     └─ Share Button
  ├─ Category Badge
  │  └─ Positioned absolute top-4 left-4
  │     └─ Pill-shaped bg-background/80 backdrop-blur
  ├─ Title (overlaid on image bottom)
  │  └─ Font: serif, 18-20px, bold, text-white
  ├─ Description
  │  └─ Hidden on mobile, visible on hover (tablet+)
  │  └─ Font: sans, 14px, muted-foreground, line-clamped to 2
  └─ Meta Information (Hidden, show on hover)
     ├─ View Count / Featured Badge
     ├─ Rating
     └─ Date Added

/* Hover State (Desktop Only) */
- Card scales up slightly (scale-105)
- Image zooms in (scale-110)
- Overlay becomes darker (opacity-60 → opacity-80)
- Title and description become visible
- Action buttons slide up from bottom with 100ms stagger
- Shadow increases: shadow-lg → shadow-2xl
- Border color brightens: border-border → border-accent/30
- Duration: 300ms ease-out

/* Touch State (Mobile/Tablet) */
- Overlay always visible on tap
- Action buttons always visible
- No scaling (avoids jarring layout shift)
- Tap to open detail view

/* Loading State */
- Skeleton shimmer effect while images load
- Animated gradient placeholder
- Aspect ratio preserved to prevent layout shift
```

**Design Details:**
- Images should have consistent aspect ratios for visual harmony
- Category badge: rounded-full px-3 py-1 text-xs font-semibold
- Action buttons on hover: Heart (outline → filled), Share (icon + label)
- Use image blur-up technique: low-quality placeholder → high-quality load

#### **4. Pagination / Infinite Scroll**
```tsx
/* Two Options (Choose One) */

OPTION A: LOAD MORE BUTTON
- Centered button at bottom
- Style: bg-foreground text-background px-8 py-3 rounded-full
- Text: "Load More Inspirations"
- Loading state: spinner + "Loading..." text
- On click: fetch next 12 items and append to grid
- Smooth scroll to new items after load

OPTION B: INFINITE SCROLL (Recommended)
- Intersection Observer API
- Trigger point: last item becomes 80% visible
- Auto-load next 12 items
- Loading indicator: small spinner at bottom
- Smooth append to grid with fade-in animation
- Optional: "End of gallery" message after all loaded

/* Both Options Include */
- Smooth loading animations
- Error state handling with retry button
- Page count display (e.g., "Showing 24 of 48")
- Scroll-to-top button for returning to toolbar after scrolling far
```

---

### Gallery Detail Page (`/app/inspiration/[id]/page.tsx`)

#### **1. Hero Image Section (Redesigned)**
```tsx
/* Layout */
- Full container width
- Aspect ratio: 4/3 on mobile, square on tablet+
- Position: relative (for overlays)
- Border: 1px solid border-border
- Border Radius: 0.75rem
- Background: gradient-to-br from-muted to-muted/50

/* Image Display */
- object-cover with full dimensions
- Smooth image load with fade-in
- Lazy loading for performance

/* Gradient Overlay */
- Positioned absolute, inset-0
- Gradient: to-t from-black/60 via-transparent to-transparent
- Purpose: ensure text readability on image

/* Floating Action Buttons Row (Bottom Left/Center) */
Buttons (flex row, gap-3):
  ├─ SAVE DREAM BUTTON
  │  ├─ Icon: Heart (lucide-react)
  │  ├─ States:
  │  │  ├─ Unsaved: outline, bg-background/80 backdrop-blur
  │  │  └─ Saved: filled, bg-accent text-foreground
  │  ├─ Height: h-12
  │  ├─ Rounded: rounded-lg
  │  ├─ On Click: 
  │  │   ├─ Toggle save state
  │  │   ├─ Show toast (Success)
  │  │   ├─ Add haptic feedback (mobile)
  │  │   └─ Animate heart (scale pop)
  │  └─ Loading state: spinner inside button
  │
  ├─ SHARE BUTTON
  │  ├─ Icon: Share2 (lucide-react)
  │  ├─ Style: bg-background/80 text-foreground
  │  ├─ On Click:
  │  │   ├─ Use Web Share API (if available)
  │  │   ├─ Fallback: copy link to clipboard
  │  │   └─ Show toast confirming share
  │  ├─ Mobile: Native share sheet
  │  └─ Desktop: Copy link + toast
  │
  ├─ AR PREVIEW BUTTON
  │  ├─ Icon: View (or custom AR icon)
  │  ├─ Label: "AR Preview"
  │  ├─ Coming Soon: disabled state + tooltip
  │  ├─ Future Feature: Opens AR viewer in modal
  │  └─ Style: bg-background/80
  │
  └─ VR TOUR BUTTON
     ├─ Icon: RotateCcw or custom VR icon
     ├─ Label: "VR Tour"
     ├─ Coming Soon: disabled state + tooltip
     ├─ Future Feature: Opens 360° viewer
     └─ Style: bg-background/80

/* Animation Details */
- Buttons fade in from opacity-0 on page load (200ms delay)
- On hover (desktop): slight scale-up (1.05), brightness increase
- Save button: 0-360° rotation animation when transitioning to saved state
- Share button: copy animation (checkmark flash) on successful copy
- Action buttons delay: stagger 50ms between each

/* Responsive Design */
- Mobile: buttons stack vertically, full width
- Tablet+: buttons in horizontal row, flex-auto sizing
- Touch targets: minimum 44x44px for accessibility
```

**Enhancement Notes:**
- Add subtle motion blur when buttons appear
- Heart button should have satisfying micro-interaction (pop scale)
- Share button should show visual feedback of copy (checkmark overlay)
- Use @radix-ui/react-tooltip for AR/VR "Coming Soon" tooltips

#### **2. Breadcrumb Navigation**
```tsx
/* Styling */
- Position: absolute top-4 left-4 (inside hero image)
- Or: top-0 outside hero with sticky positioning
- Background: transparent or bg-background/80 backdrop-blur
- Padding: px-3 py-2
- Border Radius: rounded-full
- Font: text-xs sm:text-sm text-muted-foreground

/* Structure */
Home / Inspiration / [Inspiration Title]

/* Interactive */
- Each segment is a Link
- Hover: text-foreground
- Click: navigate to that section
- Current page: text-foreground (not clickable)
```

#### **3. Details & Metadata Section**
```tsx
/* Layout */
- Positioned right of image (desktop) or below (mobile)
- Column layout: space-y-6
- Sticky on desktop (position: sticky, top: 100px)

/* Content Sections */

A) HEADER INFO
   - Category badge: text-accent font-semibold uppercase text-xs mb-2
   - Title: font-serif text-4xl text-foreground mb-2
   - Description: text-muted-foreground leading-relaxed
   - All text: mb spacing for separation

B) SPEC DETAILS (Cards Grid)
   - 2-column grid on mobile, 2x2 on tablet
   - Each card:
     * bg-card border border-border rounded-lg p-4
     * Icon (24px) + label above
     * Value below
     * Text: text-sm font-semibold
   - Specs to include:
     * Category (Ceramic Tiles, Marble, etc.)
     * Style (Modern, Classic, Contemporary, etc.)
     * Color Palette (As shown, Custom, Neutral, Bold)
     * Tile Size (60x60cm, 30x60cm, custom)
     * Featured/Trending badge if applicable

C) FEATURED PRODUCTS CAROUSEL
   - Title: "Featured Products" with link to /products
   - Horizontal scrolling carousel (using Framer Motion or scroll)
   - Cards showing:
     * Product image (small thumbnail)
     * Product name
     * Price (₹ with thousand separators)
     * Original price (strikethrough if on sale)
     * Rating (★ icon + number)
     * Stock status ("In stock" or "Out of stock")
   - On click: navigate to /products/[id]
   - Max visible: 4 cards per view, scroll for more
   - Smooth scroll with momentum

D) SIMILAR INSPIRATIONS
   - Title: "More from this category"
   - Vertical list (not carousel)
   - Each item:
     * Small thumbnail (40x40px) on left
     * Title (14px, semibold)
     * Description (12px, muted, clamp to 1 line)
     * Arrow icon on right
   - Max items: 5-6 visible
   - On click: navigate to /inspiration/[id]
   - Smooth navigation with page transition

E) ACTION BUTTONS
   - CTA: "Add to Dream Board" (primary button)
   - Secondary: "Share" (outline)
   - Tertiary: "Back to Gallery" (minimal)
   - Stacked vertically on mobile
   - Horizontal on tablet+
```

**Styling Notes:**
- Keep details section clean and spacious
- Use subtle dividers between sections (border-t border-border/50)
- Info cards should have light background color (bg-muted/5)
- Hover states on all interactive elements

#### **4. Related Products Carousel (Enhanced)**
```tsx
/* Layout */
- Horizontal scrolling container
- Snap scrolling for smooth navigation
- Scroll buttons on both sides (prev/next)

/* Product Cards */
- Width: 280px, Height: 180px (consistent sizing)
- Image area: 60% height with object-cover
- Info area: 40% height with overflow-hidden
- Card styling: border, rounded-lg, shadow, hover effects
- Spacing: gap-4 between cards

/* Card Content */
- Title: truncate, font-semibold, text-sm
- Price: text-sm, bold
- Original price: text-xs, line-through, muted
- Rating: flex with star icon, text-xs
- Stock status: badge style, bg-red-500/10 if out of stock
- On click: smooth transition to product detail

/* Navigation Buttons */
- Positioned absolute left/right at center height
- Icon: ChevronLeft / ChevronRight
- Style: bg-background/80 backdrop-blur, hover:bg-background
- Click: smooth scroll 280px + gap in direction
- Disabled state when at start/end of scroll
- Animation: fade-in on hover
```

**Implementation Notes:**
- Use horizontal scroll container with `overflow-x-auto scroll-smooth`
- Add scroll snap: `scroll-snap-type: x mandatory` on container
- Use Framer Motion for animated carousel if smooth UX needed
- Load images with lazy loading for performance

#### **5. Similar Inspirations Section**
```tsx
/* Layout */
- Below featured products
- Vertical list (not carousel)
- Full width container

/* Header */
- Title: "More from this category"
- Optional: view-all link

/* Items List */
- Each item: flex row, gap-3, p-2.5, rounded-lg
- Thumbnail: 40x40px rounded-md, flex-shrink-0
- Content: flex column, min-w-0
  - Title: text-sm font-medium, truncate
  - Description: text-xs muted, truncate
- Arrow: ml-auto, text-primary
- Hover: bg-background/60, border border-border/60
- Click: navigate to /inspiration/[id]

/* Responsive */
- Stack items vertically
- Add left border accent on hover (border-l-2 border-accent)
```

#### **6. Navigation Section (Previous/Next)**
```tsx
/* Position */
- Sticky to bottom of viewport on mobile
- Inline with content on tablet+
- Position: sticky, bottom-0 (mobile)
- z-index: above footer but below header

/* Layout */
- Two equal-width buttons in grid
- Gap: gap-4
- Each button: p-4, border, rounded-lg, h-12

/* Styling */
- Button style: outline variant
- Hover: bg-accent/10 transition
- Active/current: darker background
- Text: flex items-center justify-center gap-2

/* Content */
Left button:
  └─ ← Previous

Right button:
  └─ Next →

/* Progress Indicator (Optional) */
- Center display: "3 of 12"
- Small text, muted-foreground
- Shows current position in gallery

/* Animation */
- Slide up from bottom on page load (300ms)
- Smooth navigation transitions between items
```

---

## 🔧 TECHNICAL SPECIFICATIONS & IMPLEMENTATION DETAILS

### Required Imports & Dependencies

**Already Available (No New Installations Needed):**
```tsx
// UI Framework & Components
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toast } from '@/components/toast'
import { Button } from '@/components/ui/button'

// Navigation & Routing
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

// React Hooks & Context
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDreams } from '@/contexts/dreams-context'
import { useAdmin } from '@/contexts/admin-context'
import { useAuth } from '@/contexts/auth-context'

// Icons (Lucide React)
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Search,
  Filter,
  X,
  Check,
  View,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  Download,
  AlertCircle,
  Zap,
} from 'lucide-react'

// Animation & Motion
import { motion, AnimatePresence } from 'framer-motion'

// Constants (Your New Module)
import { TOAST_DURATION, LIMITS, CATEGORY_NAMES, MESSAGES } from '@/lib/constants'

// Utilities
import { useState, useEffect } from 'react'
```

**Optional: Future Enhancements (Can Add Later)**
```tsx
// For advanced gallery features
import { useInView } from 'react-intersection-observer' // infinite scroll
import { useLocalStorage } from 'usehooks-ts' // persist filter state
import Lightbox from 'yet-another-react-lightbox' // full-screen gallery
```

---

### State Management Architecture

```tsx
/* Gallery Listing Page States */
const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([])
const [activeCategory, setActiveCategory] = useState<string>('all')
const [activeSortBy, setActiveSortBy] = useState<'latest' | 'popular' | 'trending'>('latest')
const [searchQuery, setSearchQuery] = useState<string>('')
const [displayedItems, setDisplayedItems] = useState<number>(12) // pagination
const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
const [hasMore, setHasMore] = useState<boolean>(true)

/* Toast States */
const [showToast, setShowToast] = useState<boolean>(false)
const [toastMessage, setToastMessage] = useState<string>('')
const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success')

/* UI States */
const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false)
const [scrollY, setScrollY] = useState<number>(0)

/* Gallery Detail Page States */
const [inspiration, setInspiration] = useState<GalleryItem | null>(null)
const [isSaved, setIsSaved] = useState<boolean>(false)
const [isSavingDream, setIsSavingDream] = useState<boolean>(false)
const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
const [similarInspirations, setSimilarInspirations] = useState<GalleryItem[]>([])
```

### Data Fetching & Filtering Logic

```tsx
/* Filtered Gallery Computation */
const filteredGallery = useMemo(() => {
  let result = [...gallery]
  
  // Category filter
  if (activeCategory !== 'all') {
    result = result.filter(item => 
      item.category.toLowerCase().includes(activeCategory.toLowerCase())
    )
  }
  
  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    result = result.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }
  
  // Sorting
  result.sort((a, b) => {
    switch (activeSortBy) {
      case 'popular':
        return (b.viewCount || 0) - (a.viewCount || 0)
      case 'trending':
        return (b.trendingScore || 0) - (a.trendingScore || 0)
      case 'latest':
      default:
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    }
  })
  
  return result
}, [gallery, activeCategory, searchQuery, activeSortBy])

/* Related Products Computation */
const relatedProducts = useMemo(() => {
  if (!inspiration) return []
  
  const sameCategory = products.filter(p =>
    p.category.toLowerCase().includes(inspiration.category.toLowerCase()) ||
    inspiration.category.toLowerCase().includes(p.category.toLowerCase())
  ).filter(p => p.inStock)
  
  const pool = sameCategory.length > 0 ? sameCategory : products.filter(p => p.inStock)
  
  return [...pool]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6)
}, [inspiration, products])

/* Similar Inspirations Computation */
const similarInspirations = useMemo(() => {
  if (!inspiration) return []
  
  return gallery
    .filter(g => g.id !== inspiration.id)
    .filter(g => g.category === inspiration.category)
    .slice(0, 3)
}, [gallery, inspiration])
```

### Event Handlers & Interactions

```tsx
/* Search Handler with Debounce */
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
  // Debounce already happens in input onChange
}, [])

const debouncedSearch = useCallback(
  debounce((value: string) => {
    setSearchQuery(value)
  }, 300),
  []
)

/* Filter Handlers */
const handleCategoryChange = (category: string) => {
  setActiveCategory(category)
  setDisplayedItems(12) // reset pagination
}

const handleSortChange = (sort: 'latest' | 'popular' | 'trending') => {
  setActiveSortBy(sort)
}

const handleClearFilters = () => {
  setActiveCategory('all')
  setSearchQuery('')
  setActiveSortBy('latest')
}

/* Save/Remove Dream Handler */
const handleSaveDream = useCallback(async (galleryId: string) => {
  setIsSavingDream(true)
  try {
    if (isDreamSaved(galleryId)) {
      removeDream(galleryId)
      setToastMessage('Removed from your dreams')
    } else {
      const item = gallery.find(g => g.id === galleryId)
      if (item) {
        addDream({
          id: item.id,
          title: item.title,
          category: item.category,
          description: item.description,
          image: item.image,
          style: 'Gallery Inspiration',
          colorPalette: 'As shown',
          tileSize: 'As shown',
        })
        setToastMessage('✨ Added to your dreams!')
      }
    }
    setToastType('success')
    setShowToast(true)
    setTimeout(() => setShowToast(false), TOAST_DURATION.DEFAULT)
  } catch (error) {
    console.error('Error saving dream:', error)
    setToastMessage('Failed to save. Please try again.')
    setToastType('error')
    setShowToast(true)
  } finally {
    setIsSavingDream(false)
  }
}, [isDreamSaved, removeDream, addDream, gallery])

/* Share Handler */
const handleShare = useCallback(async (item: GalleryItem) => {
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/inspiration/${item.id}`
  const shareText = `Check out this ${item.title} inspiration on Omkar Ceramic!`

  if (navigator.share) {
    try {
      await navigator.share({
        title: item.title,
        text: shareText,
        url: shareUrl,
      })
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        copyToClipboard(shareUrl)
      }
    }
  } else {
    copyToClipboard(shareUrl)
  }
}, [])

/* Copy to Clipboard Handler */
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    setToastMessage('📋 Link copied to clipboard!')
    setToastType('info')
    setShowToast(true)
    setTimeout(() => setShowToast(false), TOAST_DURATION.MEDIUM)
  })
}

/* Load More Handler */
const handleLoadMore = useCallback(async () => {
  setIsLoadingMore(true)
  try {
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const nextCount = displayedItems + 12
    if (nextCount >= filteredGallery.length) {
      setHasMore(false)
    }
    setDisplayedItems(nextCount)
  } finally {
    setIsLoadingMore(false)
  }
}, [displayedItems, filteredGallery.length])

/* Navigation Handler */
const handleNavigateGallery = (direction: 'prev' | 'next') => {
  const currentIndex = filteredGallery.findIndex(g => g.id === inspiration?.id)
  const newIndex = direction === 'next'
    ? (currentIndex + 1) % filteredGallery.length
    : (currentIndex - 1 + filteredGallery.length) % filteredGallery.length
  
  router.push(`/inspiration/${filteredGallery[newIndex]?.id}`)
}
```

### Animation Specifications

```tsx
/* Page Entry Animation (Staggered Children) */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

/* Card Hover Animation */
const cardHoverVariants = {
  rest: { scale: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  hover: { scale: 1.05, boxShadow: '0 20px 25px rgba(0,0,0,0.2)' },
}

const imageHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1 },
}

/* Carousel Animation */
const carouselVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
}

/* Toast Animation */
const toastVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

/* Heart Save Animation */
const heartVariants = {
  idle: { scale: 1 },
  click: {
    scale: [1, 1.2, 0.9, 1.05, 1],
    rotate: [0, 10, -10, 5, 0],
    transition: { duration: 0.5 },
  },
}

/* Button Loading Spinner */
const spinVariants = {
  spin: { rotate: 360, transition: { repeat: Infinity, duration: 1 } },
}
```

---

## 📱 RESPONSIVE DESIGN BREAKPOINTS

```tsx
/* Mobile (< 640px) */
- Gallery grid: 1 column
- Hero height: 300px
- Toolbar: vertical layout, stacked inputs
- Detail page: single column layout
- Action buttons: stacked vertically, full width
- Carousel: visible items: 1-1.5

/* Tablet (640px - 1024px) */
- Gallery grid: 2 columns
- Hero height: 400px
- Toolbar: horizontal layout
- Detail page: image left, content right (2/3 - 1/3)
- Action buttons: 2-2 grid
- Carousel: visible items: 2-3

/* Desktop (1024px - 1536px) */
- Gallery grid: 3 columns
- Hero height: 500px
- Detail page: image 2/3, content 1/3 (sticky)
- Action buttons: horizontal row
- Carousel: visible items: 3-4

/* Large (≥ 1536px) */
- Gallery grid: 4 columns
- Hero height: 600px
- All elements at max comfort width
- Carousel: visible items: 4+
```

---

## ✨ PREMIUM VISUAL EFFECTS & MICRO-INTERACTIONS

### Hover Effects
- **Card Elevation**: Scale 1.0 → 1.05, shadow deepens
- **Image Zoom**: Slight 1.1x zoom on card image hover
- **Border Glow**: Border color → accent color with subtle glow
- **Text Appear**: Description and meta fades in
- **Button Pop**: Action buttons slide up from bottom with stagger

### Click/Tap Feedback
- **Heart Button**: Pop animation (scale + rotate), color transition
- **Share Button**: Visual confirmation (checkmark flash, toast)
- **Link Navigation**: Smooth fade transition between pages
- **Scroll Navigation**: Smooth scroll to section with highlight

### Loading States
- **Skeleton Shimmer**: Animated gradient from left to right
- **Spinner**: Rotating icon (Lucide's RotateCcw or custom)
- **Placeholder**: Blurred low-quality image → sharp high-quality load

### Success/Feedback
- **Toast Messages**: Slide in from top, auto-dismiss (2.5s default)
- **Haptic Feedback**: Mobile vibration on save/share (if available)
- **Confirmation Icons**: Check, heart, share icons in toast
- **Progress Indicator**: "Saving..." → "Saved!" transition

---

## 🎯 PERFORMANCE OPTIMIZATIONS

```tsx
/* Image Optimization */
- Next.js Image component with:
  * priority={featured ? true : false}
  * placeholder="blur"
  * blurDataURL={generateBlurImage(imageUrl)}
  * loading="lazy" for non-critical images
  * srcSet for responsive sizes

/* Lazy Loading */
- Intersection Observer for infinite scroll
- Lazy load carousel items (only visible items + 1 on each side)
- Defer off-screen image loading

/* Caching & Memoization */
- useMemo for filtered/sorted gallery
- useCallback for event handlers
- Context memoization to prevent unnecessary re-renders

/* Bundle Size */
- Tree-shake unused icons from lucide-react
- Dynamic imports for modal/heavy components
- Code splitting per page route

/* Rendering */
- Virtual scrolling for large lists (if 100+ items)
- Debounced search (300ms) to avoid filtering on every keystroke
- Batch state updates using useTransition (React 18+)
```

---

## 🔐 ACCESSIBILITY & UX STANDARDS

```tsx
/* Keyboard Navigation */
- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys to navigate carousel
- Escape to close modals

/* Screen Reader Support */
- Proper semantic HTML (button, link, nav, section, article)
- aria-labels for icon-only buttons
- aria-describedby for descriptions
- role attributes where needed
- alt text for all images (meaningful, not generic)

/* Color Contrast */
- All text meets WCAG AA standard (4.5:1 minimum)
- Color not only cue (icons + text)
- Focus indicators visible (ring-2 ring-accent)

/* Touch Targets */
- Minimum 44x44px for all interactive elements
- Adequate spacing between touch targets
- Large enough text (16px minimum on mobile)

/* Focus Management */
- Visible focus indicator on all interactive elements
- Focus trap in modals
- Focus restore when closing modals
```

---

## 📊 DATA STRUCTURE SPECIFICATIONS

```tsx
/* GalleryItem Interface (from AdminContext) */
interface GalleryItem {
  id: string
  title: string
  category: string // "Ceramic Tiles", "Marble", "Bathroom & Sanitary Ware", "Accessories"
  description: string
  image: string // URL
  featured?: boolean
  viewCount?: number
  trendingScore?: number
  createdAt?: string // ISO date
  style?: string // "Modern", "Classic", "Contemporary"
  colorPalette?: string
  tags?: string[]
}

/* DreamItem Interface (from DreamsContext) */
interface DreamItem {
  id: string
  title: string
  category: string
  description: string
  image: string
  style: string
  colorPalette: string
  tileSize: string
  savedAt?: string
}

/* Product Interface (from AdminContext) */
interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  inStock: boolean
  image: string
  sku?: string
}
```

---

## 🎨 DESIGN TOKENS & CONSTANTS (To Be Added to `/lib/constants.ts`)

```tsx
/* Gallery-Specific Constants */
export const GALLERY_CONFIG = {
  ITEMS_PER_PAGE: 12,
  ITEMS_PER_LOAD: 12,
  CAROUSEL_ITEMS_VISIBLE: {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
  SORT_OPTIONS: ['Latest', 'Most Popular', 'Trending', 'A-Z'] as const,
  CATEGORIES: [
    { id: 'all', label: 'All' },
    { id: 'ceramic', label: 'Ceramic Tiles' },
    { id: 'marble', label: 'Marble' },
    { id: 'bathroom', label: 'Bathroom & Sanitary Ware' },
    { id: 'accessories', label: 'Accessories' },
  ] as const,
}

export const GALLERY_ANIMATIONS = {
  HERO_FADE: { duration: 0.6, delay: 0.1 },
  CARD_STAGGER: { delay: 0.05, duration: 0.3 },
  BUTTON_HOVER: { duration: 0.3 },
  MODAL_OPEN: { duration: 0.4 },
} as const

export const GALLERY_MESSAGES = {
  SAVE_SUCCESS: '✨ Added to your dreams!',
  SAVE_REMOVE: '💔 Removed from your dreams',
  SHARE_SUCCESS: '📋 Link copied to clipboard!',
  SHARE_ERROR: 'Failed to share. Please try again.',
  LOAD_ERROR: 'Failed to load gallery. Please refresh.',
  NO_RESULTS: 'No inspirations found matching your search.',
} as const
```

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Gallery Listing Page Redesign (Priority: HIGH)
1. Update hero banner with premium design
2. Implement search + filter + sort toolbar (sticky)
3. Redesign masonry grid with hover effects
4. Add load-more functionality with pagination
5. Implement filtering logic and sorting
6. Test responsive design on all breakpoints
7. Add animations and transitions

### Phase 2: Gallery Detail Page Enhancement (Priority: HIGH)
1. Redesign hero image section with floating action buttons
2. Restructure details sidebar
3. Implement featured products carousel
4. Add similar inspirations section
5. Enhance navigation (prev/next gallery items)
6. Add breadcrumb navigation
7. Implement all interactive handlers

### Phase 3: Polish & Performance (Priority: MEDIUM)
1. Add micro-interactions (heart animation, toast transitions)
2. Optimize images (blur-up, lazy loading)
3. Implement infinite scroll option
4. Add haptic feedback for mobile
5. Test on actual mobile devices
6. Performance audits (Lighthouse)
7. Accessibility testing (WCAG AA compliance)

### Phase 4: Future Enhancements (Priority: LOW)
1. AR Preview modal component
2. VR 360° viewer modal
3. Full-screen lightbox gallery
4. Advanced filters (price range, style, etc.)
5. User ratings & reviews on gallery items
6. Share to social media functionality
7. Download inspiration as PDF

---

## 📝 SUMMARY OF KEY IMPROVEMENTS

✅ **Premium Visual Design**: Luxury-grade styling with gold accents, serif fonts, and elegant spacing
✅ **Advanced Filtering**: Search, category filter, and smart sorting
✅ **Smooth Animations**: Micro-interactions on hover, click, and scroll
✅ **Responsive Layout**: Optimized for all screen sizes with thoughtful breakpoints
✅ **Better UX**: Clear navigation, loading states, error handling, and feedback
✅ **Performance Ready**: Image optimization, lazy loading, and efficient rendering
✅ **Accessibility First**: WCAG AA compliance, keyboard navigation, screen reader support
✅ **Interactive Elements**: Save/share, carousel scrolling, modal navigation
✅ **Consistent Design Language**: Aligned with existing website design system
✅ **Scalable Architecture**: Modular components, reusable utilities, easy to extend

---

## 🎯 SUCCESS METRICS

After implementation, the gallery section should achieve:

- **Visual Appeal**: Wow factor on first viewing, premium aesthetic
- **Performance**: <3s load time for initial gallery, smooth 60fps interactions
- **Engagement**: 40%+ click-through rate to detail pages, 25%+ dream board saves
- **Usability**: Intuitive navigation, clear filtering, easy discovery
- **Accessibility**: 100% WCAG AA compliance, full keyboard navigation
- **Mobile Experience**: Optimized touch targets, fast load, smooth scrolling
- **User Retention**: Multiple paths to explore (filter, sort, search, carousel)

---

This prompt provides everything needed to transform the gallery into a **premium, state-of-the-art feature** that elevates your Omkar Ceramic brand. Follow this systematically for a professional, polished result! 🚀✨
