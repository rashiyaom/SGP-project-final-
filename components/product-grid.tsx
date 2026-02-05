'use client'

import Link from 'next/link'
import { Heart, Star } from 'lucide-react'
import { useState } from 'react'

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

const allProducts: Product[] = [
  // Ceramic Tiles
  { id: '1', name: 'Ceramic White Pearl 60x60', price: 1200, category: 'Ceramic Tiles', rating: 4.9, inStock: true, image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=600&auto=format&fit=crop' },
  { id: '2', name: 'Minimal Design Tile 45x45', price: 1000, category: 'Ceramic Tiles', rating: 4.6, inStock: true, image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=600&auto=format&fit=crop' },
  { id: '3', name: 'Slate Blue Gray 60x60', price: 1800, category: 'Ceramic Tiles', rating: 4.8, inStock: true, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop' },
  { id: '4', name: 'Cement Pattern Tile', price: 1100, category: 'Ceramic Tiles', rating: 4.6, inStock: true, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop' },
  { id: '5', name: 'Terracotta Rustic 30x30', price: 950, originalPrice: 1200, category: 'Ceramic Tiles', rating: 4.5, inStock: true, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop' },
  { id: '6', name: 'Hexagon Mosaic White', price: 1400, category: 'Ceramic Tiles', rating: 4.7, inStock: true, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop' },
  
  // Marble
  { id: '7', name: 'Marble Elegance 60x60', price: 2500, originalPrice: 3000, category: 'Marble', rating: 4.8, inStock: true, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop' },
  { id: '8', name: 'Cream Travertine 80x80', price: 2200, originalPrice: 2600, category: 'Marble', rating: 4.7, inStock: true, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop' },
  { id: '9', name: 'Polished Quartz White', price: 3200, originalPrice: 4000, category: 'Marble', rating: 4.9, inStock: true, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop' },
  { id: '10', name: 'Thassos White Premium', price: 3500, category: 'Marble', rating: 4.8, inStock: true, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop' },
  { id: '11', name: 'Black Marquina Marble', price: 4200, category: 'Marble', rating: 4.9, inStock: true, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop' },
  { id: '12', name: 'Calacatta Gold Slab', price: 5500, originalPrice: 6500, category: 'Marble', rating: 5.0, inStock: false, image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600&auto=format&fit=crop' },
  
  // Bathroom & Sanitary Ware
  { id: '13', name: 'Designer Wash Basin', price: 8500, originalPrice: 10000, category: 'Bathroom & Sanitary Ware', rating: 4.7, inStock: true, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop' },
  { id: '14', name: 'Chrome Designer Faucet', price: 3200, originalPrice: 4200, category: 'Bathroom & Sanitary Ware', rating: 4.7, inStock: true, image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600&auto=format&fit=crop' },
  { id: '15', name: 'Wall Mounted Toilet', price: 12000, category: 'Bathroom & Sanitary Ware', rating: 4.8, inStock: true, image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=600&auto=format&fit=crop' },
  { id: '16', name: 'Rainfall Shower Set', price: 7500, originalPrice: 9000, category: 'Bathroom & Sanitary Ware', rating: 4.6, inStock: true, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop' },
  { id: '17', name: 'Freestanding Bathtub', price: 45000, category: 'Bathroom & Sanitary Ware', rating: 4.9, inStock: false, image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=600&auto=format&fit=crop' },
  { id: '18', name: 'Vanity Mirror Cabinet', price: 6800, category: 'Bathroom & Sanitary Ware', rating: 4.5, inStock: true, image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600&auto=format&fit=crop' },
  
  // Accessories
  { id: '19', name: 'Glass Mosaic Border', price: 2000, category: 'Accessories', rating: 4.9, inStock: true, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop' },
  { id: '20', name: 'Black Matte Trim', price: 2800, category: 'Accessories', rating: 4.8, inStock: true, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop' },
  { id: '21', name: 'Stainless Towel Rail', price: 1500, category: 'Accessories', rating: 4.6, inStock: true, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop' },
  { id: '22', name: 'Brass Soap Dispenser', price: 1200, originalPrice: 1500, category: 'Accessories', rating: 4.7, inStock: true, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop' },
  { id: '23', name: 'Chrome Robe Hook Set', price: 800, category: 'Accessories', rating: 4.5, inStock: true, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop' },
  { id: '24', name: 'Premium Tile Grout', price: 450, category: 'Accessories', rating: 4.4, inStock: true, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop' },
]

export function ProductGrid({
  sortBy,
  collection,
  filters = {},
}: {
  sortBy: string
  collection?: 'ceramic' | 'marble' | 'sanitary' | 'accessories' | null
  filters?: Record<string, string[]>
}) {
  let displayProducts = [...allProducts]

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
  const [isWishlisted, setIsWishlisted] = useState(false)
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

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
              setIsWishlisted(!isWishlisted)
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
