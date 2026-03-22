'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from './animated-section'
import { useAdmin } from '@/contexts/admin-context'

export function FeaturedProducts() {
  const { products } = useAdmin()
  // Show first 4 products as featured (one from each category ideally)
  const categoryOrder = ['Marble', 'Ceramic Tiles', 'Bathroom & Sanitary Ware', 'Accessories']
  const featuredProducts = categoryOrder
    .map(cat => products.find(p => p.category === cat))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4)

  // Fallback: if not enough, just use first 4
  const displayProducts = featuredProducts.length >= 4 ? featuredProducts : products.slice(0, 4)

  return (
    <section className="py-12 sm:py-24 lg:py-32 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <AnimatedSection animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-16 gap-4 sm:gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">Curated Selection</p>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-foreground">
                Featured <span className="italic">Products</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-foreground hover:text-foreground/70 transition-colors group whitespace-nowrap"
            >
              View all
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </AnimatedSection>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {displayProducts.map((product, index) => (
            <AnimatedSection key={product.id} animation="fade-up" delay={index * 100}>
              <Link href={`/products/${product.id}`}>
                <div className="group cursor-pointer">
                  {/* Image */}
                  <div className="aspect-square bg-muted/50 rounded-lg mb-2 sm:mb-4 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">{product.category}</p>
                  <h3 className="text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2 leading-snug line-clamp-2">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-foreground font-medium">₹{product.price.toLocaleString()}</p>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
