'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { AnimatedSection } from './animated-section'
import { useState, useEffect } from 'react'

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    alt: 'Modern luxury interior with premium tiles'
  },
  {
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
    alt: 'Elegant marble flooring'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    alt: 'Contemporary bathroom design'
  },
  {
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop',
    alt: 'Premium kitchen tiles'
  },
  {
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2074&auto=format&fit=crop',
    alt: 'Luxurious living space'
  },
]

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
        setIsTransitioning(false)
      }, 500)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-background overflow-hidden">
      {/* Hero Image with Overlaid Text */}
      <div className="relative h-[60vh] min-h-[400px] sm:h-[85vh] sm:min-h-[600px] overflow-hidden">
        {/* Background Images with Crossfade */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={image.url}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${index === currentImageIndex && !isTransitioning ? 'scale-105' : 'scale-100'
                  }`}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-background/30" />
        </div>

        {/* Image Indicators - Mobile optimized */}
        <div className="absolute bottom-12 sm:bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentImageIndex(index)
                  setIsTransitioning(false)
                }, 300)
              }}
              className={`h-0.5 sm:h-1 rounded-full transition-all duration-500 ${index === currentImageIndex ? 'w-6 sm:w-8 bg-foreground' : 'w-1.5 sm:w-2 bg-foreground/40 hover:bg-foreground/60'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Top Labels - Hidden on mobile */}
        <div className="absolute top-4 sm:top-8 left-0 right-0 px-4 sm:px-12 hidden sm:block">
          <div className="max-w-7xl mx-auto flex justify-between items-start">
            <div>
              <p className="text-xs text-foreground/70 uppercase tracking-wider">Dream big.</p>
              <p className="text-xs text-foreground/70 uppercase tracking-wider">Live simple.</p>
            </div>
            <div className="text-center hidden sm:block">
              <p className="text-xs text-foreground/70 uppercase tracking-wider">Masterpiece</p>
              <p className="text-xs text-foreground/70 uppercase tracking-wider">of Craftsmanship</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-foreground/70 uppercase tracking-wider">Space to Recharge</p>
              <p className="text-xs text-foreground/70 uppercase tracking-wider">life's batteries.</p>
            </div>
          </div>
        </div>

        {/* Giant Typography - Mobile optimized */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="font-serif text-[12vw] sm:text-[16vw] lg:text-[14vw] font-bold text-foreground leading-none tracking-tighter px-4 text-center">
            Omkar
          </h1>
        </div>

        {/* Bottom Info - Mobile compact */}
        <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 px-4 sm:px-12 w-full">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-background/80 backdrop-blur-sm text-[10px] sm:text-xs font-medium rounded-full border border-border whitespace-nowrap">Ceramic</span>
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-background/80 backdrop-blur-sm text-[10px] sm:text-xs font-medium rounded-full border border-border whitespace-nowrap">Marble</span>
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-foreground text-background text-[10px] sm:text-xs font-medium rounded-full whitespace-nowrap">Premium</span>
            </div>
            <p className="text-[10px] sm:text-xs text-foreground/70 hidden sm:block whitespace-nowrap">Pardi, Gujarat</p>
          </div>
        </div>
      </div>

      {/* About Section - Mobile optimized */}
      <div className="py-12 sm:py-24 lg:py-32 px-4 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-start">
            {/* Left - Large Typography */}
            <AnimatedSection animation="fade-up" duration={800}>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-5xl lg:text-6xl text-foreground leading-tight text-balance">
                Stunning <span className="italic">surfaces</span> for spaces where people{' '}
                <span className="italic">live,</span> <span className="italic">work,</span> and <span className="italic">dream.</span>
              </h2>
            </AnimatedSection>

            {/* Right - About Label */}
            <AnimatedSection animation="fade-in" delay={200}>
              <div className="lg:text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">About Us</p>
              </div>
            </AnimatedSection>
          </div>

          {/* Image + Description - Stack on mobile */}
          <div className="mt-8 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-end">
            {/* Left - Description */}
            <AnimatedSection animation="slide-right" delay={100} className="order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-foreground rounded-full"></div>
                <p className="text-xs text-foreground uppercase tracking-wider font-medium">Premium Tiles</p>
              </div>              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-md">
                Our signature collection has the basics covered. Compact yet generous, efficient yet flexible,
                it maximizes its space for your comfort. Each piece is crafted for lasting beauty.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border border-foreground text-foreground text-xs sm:text-sm font-medium rounded-full hover:bg-foreground hover:text-background transition-colors"
              >
                Shop collection
              </Link>
            </AnimatedSection>

            {/* Right - Image */}
            <AnimatedSection animation="slide-left" delay={200} className="order-1 lg:order-2">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop"
                  alt="Premium ceramic tiles showroom"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Stats Section - Mobile grid */}
      <div className="py-10 sm:py-16 px-4 sm:px-12 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <AnimatedSection animation="fade-up" delay={0}>
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-5xl lg:text-6xl lg:text-7xl font-semibold text-foreground tracking-tight">500+</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground mt-1 sm:mt-2">Premium products</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={150}>
              <div className="text-center">
                <p className="text-3xl sm:text-5xl lg:text-6xl lg:text-7xl font-semibold text-foreground tracking-tight">15+</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground mt-1 sm:mt-2">Years experience</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="text-center">
                <p className="text-3xl sm:text-5xl lg:text-6xl lg:text-7xl font-semibold text-foreground tracking-tight">10K+</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground mt-1 sm:mt-2">Happy customers</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner - Mobile optimized */}
      <div className="py-12 sm:py-20 px-4 sm:px-12 bg-muted/30">
        <AnimatedSection animation="fade-up">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl lg:text-6xl text-foreground">
              Quality <span className="italic">x</span> Design
            </h3>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 text-foreground group"
            >
              <ArrowUpRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span className="text-base sm:text-lg font-medium">Visit shop</span>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
