'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from './animated-section'

const inspirations = [
  { 
    id: '1', 
    title: 'Modern Bathroom', 
    category: 'Bathroom',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: '2', 
    title: 'Kitchen Elegance', 
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: '3', 
    title: 'Living Room', 
    category: 'Living',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: '4', 
    title: 'Outdoor Space', 
    category: 'Outdoor',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: '5', 
    title: 'Minimalist Entry', 
    category: 'Entryway',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop'
  },
]

export function InspirationsGallery() {
  return (
    <section className="py-12 sm:py-24 lg:py-32 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <AnimatedSection animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">Ideas</p>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-foreground">
                Get <span className="italic">Inspired</span>
              </h2>
            </div>
            <Link 
              href="/inspiration" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-foreground hover:text-foreground/70 transition-colors group whitespace-nowrap"
            >
              View gallery
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </AnimatedSection>

        {/* Bento Grid Layout - Mobile optimized */}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-auto gap-2 sm:gap-4 h-auto md:h-[600px]">
          {/* Large Left Item - Full height on mobile */}
          <AnimatedSection animation="scale-up" delay={0} className="col-span-2 row-span-2 md:row-span-2 min-h-[200px] md:min-h-auto">
            <Link href={`/inspiration/${inspirations[0].id}`} className="group block h-full">
              <div className="relative h-full rounded-lg sm:rounded-xl overflow-hidden">
                <img 
                  src={inspirations[0].image || "/placeholder.svg"} 
                  alt={inspirations[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6">
                  <p className="text-[10px] sm:text-xs text-background/70 uppercase tracking-wider mb-1 sm:mb-2">{inspirations[0].category}</p>
                  <h3 className="text-sm sm:text-xl font-medium text-background line-clamp-2">{inspirations[0].title}</h3>
                </div>
              </div>
            </Link>
          </AnimatedSection>

          {/* Top Right Item - Stacked on mobile */}
          <AnimatedSection animation="scale-up" delay={100} className="col-span-2 md:col-span-2 row-span-1 min-h-[120px] md:min-h-auto">
            <Link href={`/inspiration/${inspirations[1].id}`} className="group block h-full">
              <div className="relative h-full rounded-lg sm:rounded-xl overflow-hidden">
                <img 
                  src={inspirations[1].image || "/placeholder.svg"} 
                  alt={inspirations[1].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                  <p className="text-[9px] sm:text-xs text-background/70 uppercase tracking-wider mb-0.5 sm:mb-1">{inspirations[1].category}</p>
                  <h3 className="text-[11px] sm:text-sm font-medium text-background line-clamp-1">{inspirations[1].title}</h3>
                </div>
              </div>
            </Link>
          </AnimatedSection>

          {/* Bottom Right - 3 Small Items Stacked on mobile */}
          <AnimatedSection animation="scale-up" delay={200} className="col-span-1 row-span-1 min-h-[100px] md:min-h-auto">
            <Link href={`/inspiration/${inspirations[2].id}`} className="group block h-full">
              <div className="relative h-full rounded-lg sm:rounded-xl overflow-hidden">
                <img 
                  src={inspirations[2].image || "/placeholder.svg"} 
                  alt={inspirations[2].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-1.5 sm:bottom-3 left-1.5 sm:left-3">
                  <p className="text-[8px] sm:text-[10px] text-background/70 uppercase tracking-wider mb-0 sm:mb-0.5 hidden sm:block">{inspirations[2].category}</p>
                  <h3 className="text-[10px] sm:text-xs font-medium text-background line-clamp-1">{inspirations[2].title}</h3>
                </div>
              </div>
            </Link>
          </AnimatedSection>

          <AnimatedSection animation="scale-up" delay={300} className="col-span-1 row-span-1 min-h-[100px] md:min-h-auto">
            <Link href={`/inspiration/${inspirations[3].id}`} className="group block h-full">
              <div className="relative h-full rounded-lg sm:rounded-xl overflow-hidden">
                <img 
                  src={inspirations[3].image || "/placeholder.svg"} 
                  alt={inspirations[3].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-1.5 sm:bottom-3 left-1.5 sm:left-3">
                  <p className="text-[8px] sm:text-[10px] text-background/70 uppercase tracking-wider mb-0 sm:mb-0.5 hidden sm:block">{inspirations[3].category}</p>
                  <h3 className="text-[10px] sm:text-xs font-medium text-background line-clamp-1">{inspirations[3].title}</h3>
                </div>
              </div>
            </Link>
          </AnimatedSection>

          {/* Fifth item - hidden on mobile, visible on larger */}
          <AnimatedSection animation="scale-up" delay={400} className="col-span-2 md:col-span-1 row-span-1 min-h-[100px] md:min-h-auto">
            <Link href={`/inspiration/${inspirations[4].id}`} className="group block h-full">
              <div className="relative h-full rounded-lg sm:rounded-xl overflow-hidden">
                <img 
                  src={inspirations[4].image || "/placeholder.svg"} 
                  alt={inspirations[4].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                  <p className="text-[8px] sm:text-[10px] text-background/70 uppercase tracking-wider mb-0 sm:mb-0.5">{inspirations[4].category}</p>
                  <h3 className="text-[10px] sm:text-xs font-medium text-background line-clamp-1">{inspirations[4].title}</h3>
                </div>
              </div>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
