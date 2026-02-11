'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Collection {
  id: string
  name: string
  description: string
  productCount: number
  image: string
  accent: string
}

const collections: Collection[] = [
  {
    id: 'ceramic',
    name: 'Ceramic Tiles',
    description: 'Premium quality ceramic tiles perfect for any room. Available in various sizes, finishes, and colors.',
    productCount: 128,
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=800&auto=format&fit=crop',
    accent: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    id: 'marble',
    name: 'Marble',
    description: 'Natural marble with timeless elegance. Premium selections perfect for luxury interiors and statement spaces.',
    productCount: 156,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
    accent: 'from-amber-500/20 to-orange-500/20'
  },
  {
    id: 'sanitary',
    name: 'Bathroom & Sanitary Ware',
    description: 'Complete bathroom solutions with premium fixtures and accessories for modern, functional spaces.',
    productCount: 94,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
    accent: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Premium home accessories and finishing elements to complete your design beautifully.',
    productCount: 87,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop',
    accent: 'from-purple-500/20 to-pink-500/20'
  },
]

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1 py-12 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 sm:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-[0.2em]">
                Collections
              </span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
              Shop by{' '}
              <span className="italic bg-gradient-to-r from-[#d4af37] via-[#bfa14a] to-[#8b7635] bg-clip-text text-transparent">
                Category
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover our curated collections of premium tiles and home essentials, 
              each designed to elevate your space with timeless elegance
            </p>
          </motion.div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-20">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/products?collection=${collection.id}`}
                  className="group block"
                >
                  <div className="relative h-full rounded-2xl overflow-hidden bg-muted/30 border border-border hover:border-[#d4af37]/30 transition-all duration-500">
                    {/* Image Section */}
                    <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${collection.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      
                      {/* Product Count Badge */}
                      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                        <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                          <span className="text-white text-xs sm:text-sm font-medium">
                            {collection.productCount} items
                          </span>
                        </div>
                      </div>
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white mb-2 sm:mb-3 transform group-hover:translate-y-[-4px] transition-transform duration-500">
                          {collection.name}
                        </h2>
                        
                        <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 line-clamp-2 transform group-hover:translate-y-[-4px] transition-transform duration-500 delay-75">
                          {collection.description}
                        </p>
                        
                        {/* CTA Button */}
                        <div className="flex items-center gap-2 text-white group-hover:text-[#d4af37] transition-colors duration-300">
                          <span className="text-sm sm:text-base font-medium uppercase tracking-wider">
                            Explore Collection
                          </span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30 border border-border p-8 sm:p-12 lg:p-16"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-4">
                  <Sparkles className="w-6 h-6 text-[#d4af37]" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-3">
                  Curated Collections
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Each collection is carefully selected to ensure quality, style, and durability for your space.
                </p>
              </div>
              
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-4">
                  <Sparkles className="w-6 h-6 text-[#d4af37]" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-3">
                  Quality Assured
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  All our products meet stringent quality standards and come with proper warranties.
                </p>
              </div>
              
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-4">
                  <Sparkles className="w-6 h-6 text-[#d4af37]" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-3">
                  Expert Support
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Our team is ready to help you find the perfect products for your project.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 sm:mt-20 text-center"
          >
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground mb-4 sm:mb-6">
              Need personalized assistance?
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Our design experts are here to help you bring your vision to life
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#d4af37] to-[#bfa14a] hover:from-[#bfa14a] hover:to-[#8b7635] text-white border-0 px-8 py-6 text-base"
                >
                  Contact Our Experts
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-[#d4af37] text-foreground hover:bg-[#d4af37]/5 px-8 py-6 text-base"
                >
                  Browse All Products
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
