'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const features = [
  {
    title: 'Marble Collection',
    location: 'Italian Carrara',
    description: 'Premium white marble with elegant veining',
    number: '01',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&h=1000&fit=crop',
    productId: '7' // Marble Elegance 60x60
  },
  {
    title: 'Porcelain Series',
    location: 'Modern Minimalist',
    description: 'High-gloss large format tiles 60x60cm',
    number: '02',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=1000&fit=crop',
    productId: '1' // Ceramic White Pearl 60x60
  },
  {
    title: 'Travertine Stone',
    location: 'Natural Texture',
    description: 'Tumbled finish for rustic elegance',
    number: '03',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=1000&fit=crop',
    productId: '8' // Cream Travertine 80x80
  },
  {
    title: 'Mosaic Patterns',
    location: 'Artisan Crafted',
    description: 'Hand-placed geometric designs',
    number: '04',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=1000&fit=crop',
    productId: '6' // Hexagon Mosaic White
  },
  {
    title: 'Wood-Look Tiles',
    location: 'Ceramic Planks',
    description: 'Authentic wood texture, zero maintenance',
    number: '05',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=1000&fit=crop',
    productId: '5' // Terracotta Rustic 30x30
  },
  {
    title: 'Slate & Stone',
    location: 'Natural Finish',
    description: 'Non-slip surface for outdoor spaces',
    number: '06',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=1000&fit=crop',
    productId: '3' // Slate Blue Gray 60x60
  },
  {
    title: 'Terrazzo Revival',
    location: 'Contemporary Classic',
    description: 'Bold colors with polished chips',
    number: '07',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=1000&fit=crop',
    productId: '4' // Cement Pattern Tile
  },
  {
    title: 'Luxury Onyx',
    location: 'Backlit Beauty',
    description: 'Translucent stone for feature walls',
    number: '08',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=1000&fit=crop',
    productId: '12' // Calacatta Gold Slab
  },
]

const showcaseImages = [
  {
    url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&h=600&fit=crop',
    title: 'Marble Bathroom',
    description: 'Carrara white elegance'
  },
  {
    url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
    title: 'Modern Kitchen Floor',
    description: 'Large format porcelain'
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    title: 'Travertine Foyer',
    description: 'Natural stone entrance'
  },
  {
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    title: 'Mosaic Feature Wall',
    description: 'Geometric accent tiles'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    title: 'Wood-Look Living Room',
    description: 'Ceramic plank flooring'
  },
]

// Supahfunk-style constants
const speedWheel = 0.08
const speedDrag = -0.3

export function WhyChooseUs() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const carouselRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const progressBarRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  // Mutable state in refs — no re-renders, CSS transitions handle smoothness
  const progressRef = useRef(0)
  const activeRef = useRef(0)
  const isDownRef = useRef(false)
  const startXRef = useRef(0)

  // Supahfunk z-index calculation
  const getZindex = (index: number, active: number) =>
    index === active ? features.length : features.length - Math.abs(index - active)

  // Apply CSS custom properties — the CSS transition does all the smoothing
  const animate = useCallback(() => {
    const progress = Math.max(0, Math.min(progressRef.current, 100))
    const active = Math.floor((progress / 100) * (features.length - 1))
    activeRef.current = active

    for (let i = 0; i < features.length; i++) {
      const card = cardRefs.current[i]
      if (!card) continue

      const zIndex = getZindex(i, active)
      // Set CSS custom properties — transition handles the animation
      card.style.setProperty('--zIndex', String(zIndex))
      card.style.setProperty('--active', String((i - active) / features.length))
    }

    // Update progress bar
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`
    }

    // Update counter
    if (counterRef.current) {
      counterRef.current.textContent = `${String(active + 1).padStart(2, '0')} / ${String(features.length).padStart(2, '0')}`
    }
  }, [])

  // Initialize on mount
  useEffect(() => {
    animate()
  }, [animate])

  // Wheel handler
  useEffect(() => {
    const el = carouselRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      const p = progressRef.current
      if ((e.deltaY > 0 && p < 100) || (e.deltaY < 0 && p > 0)) {
        e.preventDefault()
        e.stopPropagation()
      }
      progressRef.current = Math.max(0, Math.min(p + e.deltaY * speedWheel, 100))
      animate()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [animate])

  // Pointer handlers — exactly like supahfunk
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDownRef.current = true
    startXRef.current = e.clientX
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDownRef.current) return
    const x = e.clientX
    const mouseProgress = (x - startXRef.current) * speedDrag
    progressRef.current = Math.max(0, Math.min(progressRef.current + mouseProgress, 100))
    startXRef.current = x
    animate()
  }, [animate])

  const onPointerUp = useCallback(() => {
    isDownRef.current = false
  }, [])

  // Intersection Observer for Featured Project cards (grayscale to color on scroll)
  useEffect(() => {
    const cards = document.querySelectorAll('.featured-project-card')
    if (cards.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            entry.target.classList.add('in-view')
          } else {
            entry.target.classList.remove('in-view')
          }
        })
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: '0px'
      }
    )

    cards.forEach((card) => observer.observe(card))
    
    return () => {
      // Properly cleanup: unobserve all cards and disconnect observer
      cards.forEach((card) => observer.unobserve(card))
      observer.disconnect()
    }
  }, [])  // Empty dependency array - only run once on mount

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 lg:py-36 bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        {/* Header Section */}
        <div className="mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl"
          >
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-[0.3em] mb-6">
              Excellence in Every Detail
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-foreground mb-6 leading-[1.15] tracking-tight">
              High-end, full-service{' '}
              <span className="italic bg-gradient-to-r from-[#d4af37] via-[#bfa14a] to-[#8b7635] bg-clip-text text-transparent">
                visual content
              </span>{' '}
              creation for lifestyle branding.
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Premium Carousel — sits outside the max-w container, uses full width, NO overflow-hidden */}
      <div
        ref={carouselRef}
        className="relative h-[400px] sm:h-[480px] lg:h-[560px] mb-32 sm:mb-40 lg:mb-48 cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
          {features.map((feature, index) => (
            <Link
              key={index}
              href={`/products/${feature.productId}`}
              className="carousel-card absolute top-1/2 left-1/2 rounded-xl overflow-hidden cursor-pointer select-none bg-black block"
              ref={el => { cardRefs.current[index] = el }}
              onClick={(e) => {
                // Prevent navigation if user was dragging (scrolling the carousel)
                const dragDistance = Math.abs((e.clientX || 0) - startXRef.current)
                if (dragDistance > 5) {
                  e.preventDefault()
                }
              }}
              style={
                {
                  '--items': features.length,
                  '--active': (index - Math.floor((0 / 100) * (features.length - 1))) / features.length,
                  '--zIndex': index === Math.floor((0 / 100) * (features.length - 1))
                    ? features.length
                    : features.length - Math.abs(Math.floor((0 / 100) * (features.length - 1)) - index),
                } as React.CSSProperties
              }
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-black">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover pointer-events-none"
                  priority={index < 3}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
              </div>

              {/* Content */}
              <div
                className="carousel-box absolute inset-0 p-4 sm:p-6 flex flex-col justify-between"
              >
                {/* Number Badge */}
                <div className="flex justify-between items-start">
                  <div className="text-white/90 text-[clamp(20px,10vw,80px)] font-light leading-none">
                    {feature.number}
                  </div>
                </div>

                {/* Bottom Content */}
                <div>
                  <h3
                    className="text-white font-serif text-[clamp(18px,3vw,28px)] mb-1 leading-tight drop-shadow-lg"
                  >
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm mb-0.5 drop-shadow-md">
                    {feature.location}
                  </p>
                  <p className="text-white/60 text-[10px] sm:text-xs drop-shadow-md">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        {/* Scroll Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative -mt-24 sm:-mt-32 lg:-mt-36 mb-16 flex items-center justify-center gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">
              Scroll to explore
            </span>
            <div className="w-32 h-px bg-border/50 relative overflow-hidden">
              <div
                ref={progressBarRef}
                className="absolute inset-0 h-full bg-gradient-to-r from-[#bfa14a] to-[#d4af37]"
                style={{ width: '0%', willChange: 'width' }}
              />
            </div>
            <span
              ref={counterRef}
              className="text-xs text-muted-foreground/60"
            >
              01 / {String(features.length).padStart(2, '0')}
            </span>
          </div>
        </motion.div>

        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 sm:mt-0"
        >
          {/* Section Label */}
          <div className="flex items-center gap-8 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border"></div>
            <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-[0.2em]">
              Featured Projects
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border"></div>
          </div>

          {/* Desktop Gallery */}
          <div className="hidden lg:grid grid-cols-5 gap-4">
            {showcaseImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer"
              >
                <Image
                  src={image.url}
                  alt={image.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-white/60 text-xs mb-2 uppercase tracking-wider">{image.description}</p>
                    <h4 className="text-white font-serif text-lg">{image.title}</h4>
                  </motion.div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>

          {/* Mobile/Tablet Gallery */}
          <div className="lg:hidden">
            <div className="relative -mx-6 sm:-mx-8">
              <div className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory px-6 sm:px-8 pb-6 scrollbar-hide">
                {showcaseImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="flex-shrink-0 w-[55vw] sm:w-[40vw] snap-center"
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden group featured-project-card">
                      <Image
                        src={image.url}
                        alt={image.title}
                        fill
                        className="object-cover transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <p className="text-white/60 text-[10px] sm:text-xs mb-1 sm:mb-2 uppercase tracking-wider">{image.description}</p>
                        <h4 className="text-white font-serif text-base sm:text-lg">{image.title}</h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Scroll indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {showcaseImages.map((_, index) => (
                  <div key={index} className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Carousel + scrollbar styles */}
      <style jsx global>{`
        .carousel-card {
          --width: clamp(200px, 35vw, 300px);
          --height: clamp(280px, 45vw, 400px);
          --x: calc(var(--active) * 800%);
          --y: calc(var(--active) * 200%);
          --rot: calc(var(--active) * 120deg);
          --opacity: calc(var(--zIndex) / var(--items) * 3 - 2);
          width: var(--width);
          height: var(--height);
          margin: calc(var(--height) * -0.5) 0 0 calc(var(--width) * -0.5);
          transform-origin: 0% 100%;
          transform: translate(var(--x), var(--y)) rotate(var(--rot));
          transition: transform 0.4s cubic-bezier(0, 0.02, 0, 1);
          box-shadow: 0 10px 50px 10px rgba(0, 0, 0, 0.5);
          z-index: var(--zIndex);
          pointer-events: all;
        }
        
        /* Mobile only - optimized card size */
        @media (max-width: 640px) {
          .carousel-card {
            --width: clamp(200px, 65vw, 280px);
            --height: clamp(280px, 80vw, 400px);
            --x: calc(var(--active) * 600%);
            --y: calc(var(--active) * 150%);
            --rot: calc(var(--active) * 100deg);
            box-shadow: 0 20px 60px 15px rgba(0, 0, 0, 0.6);
          }
        }
        
        .carousel-card .carousel-box {
          opacity: var(--opacity);
          transition: opacity 0.4s cubic-bezier(0, 0.02, 0, 1);
        }
        .carousel-card .carousel-box::before {
          content: '';
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3),
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, 0) 50%,
            rgba(0, 0, 0, 0.5)
          );
          pointer-events: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Featured Projects - Grayscale to Color Effect */
        .featured-project-card img {
          filter: grayscale(100%);
          transition: filter 0.6s ease-out;
        }
        
        /* When card is in view (centered in scroll area) */
        .featured-project-card.in-view img {
          filter: grayscale(0%);
        }
        
        /* Mobile - cards start grayscale and become color when tapped or scrolled into focus */
        @media (max-width: 1024px) {
          .featured-project-card:active img,
          .featured-project-card:focus-within img {
            filter: grayscale(0%);
          }
        }
      `}</style>
    </section>
  )
}
