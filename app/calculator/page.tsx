"use client";

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Calculator, Sparkles, Clock, Ruler, Grid3X3, Package, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CalculatorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#bfa14a]/10 border border-[#bfa14a]/20 mb-6">
                <Sparkles className="w-4 h-4 text-[#bfa14a]" />
                <span className="text-sm font-medium text-[#bfa14a]">Tile Calculator</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 dark:text-white mb-4">
                Coming Soon
              </h1>

              <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                We&apos;re crafting an intelligent tile calculator to help you estimate your project with precision
              </p>
            </motion.div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

            {/* Large Feature Card - Calculator Icon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sm:col-span-2 lg:row-span-2 rounded-3xl bg-gradient-to-br from-[#bfa14a] to-[#8b7635] p-8 sm:p-12 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">In Development</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
                  Smart Tile Calculator
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  Calculate tiles, materials, and costs with precision
                </p>

                <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mt-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Calculator className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Image Card 1 - Marble Tiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl overflow-hidden relative group h-64 sm:h-auto"
            >
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=600&fit=crop"
                alt="Luxury marble tiles"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-medium">Premium Marble</p>
                <p className="text-white/70 text-sm">Luxury Collection</p>
              </div>
            </motion.div>

            {/* Feature Card - Measurements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#bfa14a]/10 flex items-center justify-center mb-4">
                <Ruler className="w-6 h-6 text-[#bfa14a]" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                  Precise Measurements
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Calculate exact tile requirements for any room size
                </p>
              </div>
            </motion.div>

            {/* Image Card 2 - Modern Bathroom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl overflow-hidden relative group h-64 sm:h-auto"
            >
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=600&fit=crop"
                alt="Modern tiled bathroom"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-medium">Travertine</p>
                <p className="text-white/70 text-sm">Natural Stone</p>
              </div>
            </motion.div>

            {/* Feature Card - Cost Estimation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#bfa14a]/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-[#bfa14a]" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                  Instant Results
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Get immediate cost estimates and material quantities
                </p>
              </div>
            </motion.div>

            {/* Image Card 3 - Granite Pattern */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="sm:col-span-2 rounded-3xl overflow-hidden relative group h-64 sm:h-80"
            >
              <Image
                src="https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1200&h=800&fit=crop"
                alt="Granite tile pattern"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-2xl font-light mb-2">Emerald Granite</p>
                <p className="text-white/70">Sophisticated patterns for modern spaces</p>
              </div>
            </motion.div>

            {/* Feature Card - Multiple Rooms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="rounded-3xl bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#bfa14a]/10 flex items-center justify-center mb-4">
                <Grid3X3 className="w-6 h-6 text-[#bfa14a]" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                  Multiple Rooms
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Calculate requirements for entire projects at once
                </p>
              </div>
            </motion.div>

            {/* Feature Card - Material Planning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="rounded-3xl bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#bfa14a]/10 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-[#bfa14a]" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                  Material Planning
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Include grout, skirting, and wastage in calculations
                </p>
              </div>
            </motion.div>

          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-12 sm:mt-16"
          >
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">
              Stay tuned for updates
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
              <div className="w-2 h-2 rounded-full bg-[#bfa14a] animate-pulse"></div>
              <span>Coming Soon</span>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
