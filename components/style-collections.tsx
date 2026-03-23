'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatedSection } from './animated-section'

interface Collection {
  id: string
  name: string
  count: number
  images: string[]
  description: string
}

const collections: Collection[] = [
  { 
    id: 'ceramic', 
    name: 'Ceramic Tiles', 
    count: 128,
    description: 'Premium ceramic tiles for floors, walls, and bathrooms',
    images: [
      'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=400&auto=format&fit=crop',
    ]
  },
  { 
    id: 'marble', 
    name: 'Marble', 
    count: 94,
    description: 'Natural marble with timeless elegance',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=400&auto=format&fit=crop',
    ]
  },
  { 
    id: 'sanitary', 
    name: 'Sanitary Ware', 
    count: 156,
    description: 'Complete bathroom solutions with premium fixtures',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=400&auto=format&fit=crop',
    ]
  },
  { 
    id: 'accessories', 
    name: 'Accessories', 
    count: 87,
    description: 'Premium finishing elements for your space',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
    ]
  },
]

export function StyleCollections() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [scrollActiveIndex, setScrollActiveIndex] = useState<number | null>(null)
  const [scrollProgress, setScrollProgress] = useState<number[]>([0, 0, 0, 0])
  const sectionRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef<number | null>(null)

  // Smooth scroll-based activation with progress tracking
  const handleScroll = useCallback(() => {
    // Cancel previous RAF to prevent accumulation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    rafRef.current = requestAnimationFrame(() => {
      const newProgress = itemRefs.current.map((ref) => {
        if (!ref) return 0
        const rect = ref.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const itemCenter = rect.top + rect.height / 2
        const viewportCenter = viewportHeight / 2
        const distance = Math.abs(itemCenter - viewportCenter)
        const maxDistance = viewportHeight / 2
        return Math.max(0, 1 - distance / maxDistance)
      })

      setScrollProgress(newProgress)

      // Find the most visible item
      const maxProgress = Math.max(...newProgress)
      if (maxProgress > 0.3) {
        const newActiveIndex = newProgress.indexOf(maxProgress)
        setScrollActiveIndex(newActiveIndex)
      } else {
        setScrollActiveIndex(null)
      }
      
      // Clear RAF ref after execution
      rafRef.current = null
    })
  }, [])  // Remove scrollActiveIndex dependency to prevent infinite loops

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [handleScroll])

  const currentActive = activeIndex !== null ? activeIndex : scrollActiveIndex

  return (
    <section ref={sectionRef} className="py-12 sm:py-24 lg:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="mb-8 sm:mb-16">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">Collections</p>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-foreground">
            Shop by <span className="italic">Category</span>
          </h2>
        </AnimatedSection>

        {/* Collections List */}
        <div className="space-y-0">
          {collections.map((collection, index) => {
            const isActive = currentActive === index
            const progress = scrollProgress[index] || 0
            
            return (
              <div
                key={collection.id}
                ref={(el) => { itemRefs.current[index] = el }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className="group will-change-transform"
              >
                <Link href={`/products?collection=${collection.id}`}>
                  <div 
                    className="relative border-t border-border cursor-pointer"
                    style={{
                      padding: `${isActive ? '1.5rem' : '0.75rem'} 0`,
                      backgroundColor: isActive ? 'var(--muted)' : 'transparent',
                      opacity: isActive ? 1 : (0.6 + progress * 0.4),
                      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div className="flex items-center justify-between px-2 sm:px-4 gap-2 sm:gap-4">
                      {/* Left Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
                          <span 
                            className="font-serif text-foreground truncate sm:truncate-none will-change-transform"
                            style={{
                              fontSize: isActive ? 'clamp(1.5rem, 4vw, 3.5rem)' : 'clamp(1.125rem, 2vw, 1.875rem)',
                              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                          >
                            {collection.name}
                          </span>
                          <span 
                            className="text-muted-foreground whitespace-nowrap"
                            style={{
                              fontSize: isActive ? '0.875rem' : '0.75rem',
                              opacity: isActive ? 1 : 0.7,
                              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                          >
                            {collection.count} items
                          </span>
                        </div>
                        
                        {/* Description - appears on active */}
                        <p 
                          className="text-muted-foreground max-w-md text-sm mt-2 will-change-transform"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? 'translateY(0)' : 'translateY(-8px)',
                            height: isActive ? 'auto' : '0',
                            overflow: 'hidden',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                        >
                          {collection.description}
                        </p>
                      </div>

                      {/* Right - Product Images - Hidden on small mobile */}
                      <div 
                        className="hidden sm:flex items-center gap-3 flex-shrink-0 will-change-transform"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'translateX(0)' : 'translateX(2rem)',
                          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        {collection.images.slice(0, 2).map((image, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="overflow-hidden rounded-xl shadow-lg flex-shrink-0 will-change-transform"
                            style={{ 
                              width: isActive ? '5rem' : '0',
                              height: isActive ? '5rem' : '0',
                              transform: isActive ? `rotate(${(imgIndex - 0.5) * 3}deg) scale(1)` : 'rotate(0deg) scale(0.8)',
                              transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${imgIndex * 0.08}s`,
                            }}
                          >
                            <img 
                              src={image || "/placeholder.svg"} 
                              alt={`${collection.name} product ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Arrow */}
                      <ArrowUpRight 
                        className="w-5 h-5 lg:w-6 lg:h-6 text-foreground flex-shrink-0 will-change-transform"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'rotate(0deg) scale(1.1)' : 'rotate(-45deg) scale(0.75)',
                          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </div>

                    {/* Progress bar animation */}
                    <div 
                      className="absolute bottom-0 left-0 h-[2px] bg-foreground will-change-transform"
                      style={{
                        width: isActive ? '100%' : '0%',
                        transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </div>
                </Link>
              </div>
            )
          })}
          {/* Bottom border for last item */}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  )
}
