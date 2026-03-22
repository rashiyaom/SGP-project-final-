'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Award, Globe, Users, Sparkles } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const stats = [
  { value: '15+', label: 'Years Excellence', icon: Award },
  { value: '10K+', label: 'Happy Clients', icon: Users },
  { value: '500+', label: 'Premium Products', icon: Sparkles },
  { value: '50+', label: 'Countries', icon: Globe },
]

const values = [
  {
    title: 'Exceptional Quality',
    description: 'Every tile is meticulously selected from world-renowned suppliers, ensuring unparalleled durability and timeless beauty.',
  },
  {
    title: 'Design Excellence',
    description: 'Our curated collections blend contemporary aesthetics with classic elegance, offering sophisticated solutions for discerning spaces.',
  },
  {
    title: 'Sustainable Luxury',
    description: 'We partner exclusively with manufacturers committed to ethical practices and environmental responsibility.',
  },
]

const gallery = [
  { image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop', title: 'Italian Marble' },
  { image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=1200&auto=format&fit=crop', title: 'Premium Ceramic' },
  { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop', title: 'Designer Tiles' },
  { image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop', title: 'Luxury Finishes' },
  { image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1200&auto=format&fit=crop', title: 'Modern Spaces' },
]

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])

  const isInView = useInView(heroRef, { once: true, margin: '-100px' })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % gallery.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % gallery.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + gallery.length) % gallery.length)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Parallax */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative py-24 sm:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xs sm:text-sm text-muted-foreground uppercase tracking-[0.3em] mb-6"
            >
              About Us
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-serif text-4xl sm:text-6xl lg:text-7xl mb-6 leading-tight relative"
            >
              <motion.span
                initial={{ backgroundPosition: '0% 50%' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="inline-block bg-gradient-to-r from-foreground via-[#bfa14a] to-foreground bg-[length:200%_100%] bg-clip-text text-transparent"
              >
                Crafting Timeless
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="italic inline-block bg-gradient-to-r from-[#d4af37] via-[#bfa14a] to-[#8b7635] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
              >
                Elegance
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-foreground"
              >
                {' '}Since 2008
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              A curated collection of premium tiles and surfaces, sourced from the world&apos;s most distinguished manufacturers.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Animated Stats */}
      <section className="py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-muted-foreground/40 group-hover:text-foreground transition-colors duration-500" />
                <motion.p
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-2"
                >
                  {stat.value}
                </motion.p>
                <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-[0.3em] mb-4">
              Our Collections
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-foreground">
              Curated <span className="italic">Excellence</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
              {gallery.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: currentSlide === index ? 1 : 0,
                    scale: currentSlide === index ? 1 : 1.1,
                  }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={currentSlide === index ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="absolute bottom-8 left-8 right-8"
                  >
                    <h3 className="font-serif text-2xl sm:text-4xl text-white">
                      {item.title}
                    </h3>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {gallery.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'w-8 bg-foreground' : 'w-1.5 bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 sm:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-[0.3em] mb-4">
              Our Philosophy
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-foreground">
              What Defines <span className="italic">Us</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="border-t border-border pt-6">
                  <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl sm:text-5xl text-foreground mb-6">
              Begin Your Journey
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed">
              Explore our collections or schedule a consultation with our design specialists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="bg-foreground hover:bg-foreground/90 text-background px-8 py-6 text-base">
                  Explore Collections
                </Button>
              </Link>
              <Link href="/booking">
                <Button
                  variant="outline"
                  className="border border-border text-foreground hover:bg-muted px-8 py-6 text-base bg-transparent"
                >
                  Book Consultation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
