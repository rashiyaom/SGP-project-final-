'use client'

import Link from 'next/link'
import { Heart, Star } from 'lucide-react'
import { useAdmin } from '@/contexts/admin-context'
import { useDreams } from '@/contexts/dreams-context'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  rating: number
  inStock: boolean
  image: string
}

export function ProductGrid({
  sortBy,
  collection,
  filters = {},
}: {
  sortBy: string
  collection?: 'ceramic' | 'marble' | 'sanitary' | 'accessories' | null
  filters?: Record<string, string[]>
}) {
  const { products: adminProducts } = useAdmin()
  let displayProducts = [...adminProducts]

  // Filter by collection
  if (collection === 'ceramic') {
    displayProducts = displayProducts.filter(p => p.category === 'Ceramic Tiles')
  } else if (collection === 'marble') {
    displayProducts = displayProducts.filter(p => p.category === 'Marble')
  } else if (collection === 'sanitary') {
    displayProducts = displayProducts.filter(p => p.category === 'Bathroom & Sanitary Ware')
  } else if (collection === 'accessories') {
    displayProducts = displayProducts.filter(p => p.category === 'Accessories')
  }

  // Apply additional filters based on category filter selections (for "all products" view)
  const selectedCategories = filters.allCategories || []
  if (selectedCategories.length > 0 && !collection) {
    const categoryMap: Record<string, string> = {
      'ceramic': 'Ceramic Tiles',
      'marble': 'Marble',
      'sanitary': 'Bathroom & Sanitary Ware',
      'accessories': 'Accessories',
    }
    displayProducts = displayProducts.filter(p => 
      selectedCategories.some(cat => categoryMap[cat] === p.category)
    )
  }

  // Apply filter-group based filters (e.g., ceramicTypes, marbleFinishes, etc.)
  // For each active filter group (excluding allCategories), if the user checked any options,
  // only keep products that have at least one matching option in their stored filters
  const activeFilterGroups = Object.entries(filters).filter(
    ([group, values]) => group !== 'allCategories' && values.length > 0
  )
  if (activeFilterGroups.length > 0) {
    displayProducts = displayProducts.filter(product => {
      return activeFilterGroups.every(([group, selectedValues]) => {
        const productFilterValues = product.filters?.[group] || []
        return selectedValues.some(val => productFilterValues.includes(val))
      })
    })
  }

  // Apply sorting
  if (sortBy === 'price-low') {
    displayProducts.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    displayProducts.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'rating') {
    displayProducts.sort((a, b) => b.rating - a.rating)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addDream, removeDream, isDreamSaved } = useDreams()
  const isWishlisted = isDreamSaved(product.id)
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeDream(product.id)
    } else {
      addDream({
        id: product.id,
        title: product.name,
        category: product.category,
        description: product.name,
        image: product.image || '/placeholder.svg',
        style: '',
        colorPalette: '',
        tileSize: '',
        type: 'product',
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.rating,
        inStock: product.inStock,
      })
    }
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-square bg-muted/40 rounded-lg sm:rounded-lg overflow-hidden mb-2 sm:mb-4">
          {/* Product Image */}
          <img 
            src={product.image || "/placeholder.svg"} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Wishlist Button */}
          <button 
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist()
            }}
            className="absolute top-2 sm:top-3 right-2 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 bg-background rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
          >
            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-foreground text-foreground' : 'text-muted-foreground'}`} />
          </button>

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-emerald-600 text-white px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-xs font-medium">
              {discount}% off
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <span className="text-muted-foreground text-[10px] sm:text-sm font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1 sm:space-y-2 px-0.5">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-1 min-w-0">
            <span className="text-[9px] sm:text-xs text-muted-foreground truncate">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
              <span className="text-[9px] sm:text-xs font-medium text-foreground">{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-foreground text-[11px] sm:text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-1 min-w-0">
            <span className="font-semibold text-foreground text-xs sm:text-sm truncate">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[9px] sm:text-xs text-muted-foreground line-through truncate">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
