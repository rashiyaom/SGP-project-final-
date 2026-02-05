'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Truck, Headphones, Award, Sparkles } from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    title: 'Premium Quality',
    description: 'International standards with certifications',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Fast Delivery',
    description: 'Quick shipping with real-time tracking',
    icon: Truck,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Expert Support',
    description: 'Dedicated design consultants available',
    icon: Headphones,
    color: 'from-orange-500 to-red-500'
  },
  {
    title: '15-Year Warranty',
    description: 'Hassle-free returns guaranteed',
    icon: Award,
    color: 'from-green-500 to-emerald-500'
  },
]

const showcaseImages = [
  {
    url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
    title: 'Modern Living Room',
    description: 'Luxury marble flooring'
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    title: 'Elegant Bathroom',
    description: 'Premium travertine tiles'
  },
  {
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    title: 'Spacious Kitchen',
    description: 'Porcelain white finish'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    title: 'Contemporary Foyer',
    description: 'Grey slate elegance'
  },
  {
    url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
    title: 'Outdoor Patio',
    description: 'Weather-resistant tiles'
  },
]

export function WhyChooseUs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-16 sm:py-20 lg:py-32 bg-gradient-to-b from-background via-neutral-50/50 to-background dark:via-neutral-900/50 border-t border-border overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#bfa14a]/10 border border-[#bfa14a]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[#bfa14a]" />
              <span className="text-sm font-medium text-[#bfa14a]">Why Us</span>
            </div>

            <h2 className="font-light text-3xl sm:text-4xl lg:text-6xl text-foreground mb-6">
              The <span className="italic font-serif bg-gradient-to-r from-[#bfa14a] to-[#8b7635] bg-clip-text text-transparent">difference</span> is in the details.
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Every thriving space is based on the symbiosis of a refined strategy and remarkable
              visual aesthetic. We do both. Every thriving experience is based on the symbiosis
              of quality and design.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative"
              >
                <div className="relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                  {/* Icon */}
                  <div className="relative mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5`}>
                      <div className="w-full h-full rounded-2xl bg-white dark:bg-neutral-900 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-neutral-700 dark:text-neutral-300" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-[#bfa14a] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative corner */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-[#bfa14a] to-[#8b7635] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Horizontal Scroll Gallery - Desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hidden sm:block"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
            <span className="text-sm text-muted-foreground">Our Projects</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {showcaseImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={image.url}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-white font-medium text-sm mb-1">{image.title}</h4>
                  <p className="text-white/70 text-xs">{image.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Horizontal Scroll Gallery - Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="sm:hidden"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
            <span className="text-sm text-muted-foreground">Our Projects</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>

          <div className="relative -mx-4">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 scrollbar-hide">
              {showcaseImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex-shrink-0 w-[280px] snap-center"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                    <Image
                      src={image.url}
                      alt={image.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white font-medium text-sm mb-1">{image.title}</h4>
                      <p className="text-white/70 text-xs">{image.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scroll indicator */}
            <div className="flex justify-center gap-1.5 mt-4">
              {showcaseImages.map((_, index) => (
                <div key={index} className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom scrollbar hide */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
