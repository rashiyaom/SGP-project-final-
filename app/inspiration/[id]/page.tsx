'use client'

import { useState, useRef, useCallback, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useDreams } from '@/contexts/dreams-context'
import { useAdmin } from '@/contexts/admin-context'
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowLeft,
  ArrowRight,
  Eye,
  Box,
  Headphones,
  ShoppingBag,
  Check,
  ExternalLink,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface GalleryItem {
  id: string
  title: string
  category: string
  description: string
  image: string
  featured?: boolean
  viewCount?: number
  style?: string
  colorPalette?: string[]
  tileSize?: string
  tags?: string[]
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  inStock: boolean
  image: string
  sku?: string
}

interface DreamItem {
  id: string
  title: string
  category: string
  description: string
  image: string
  style: string
  colorPalette: string
  tileSize: string
  savedAt?: string
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const heartVariants = {
  idle: { scale: 1, rotate: 0 },
  pop: {
    scale: [1, 1.4, 0.9, 1.15, 1],
    rotate: [0, -15, 10, -5, 0],
    transition: { duration: 0.5, ease: 'easeInOut' as const },
  },
}

const toastVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.2 } },
}

const fabVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1 + 0.3, duration: 0.35, ease: 'backOut' as const },
  }),
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={
            i < Math.round(rating)
              ? 'fill-[#d4af37] text-[#d4af37]'
              : 'fill-stone-200 text-stone-200'
          }
        />
      ))}
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="w-[280px] rounded-2xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 hover:shadow-lg transition-shadow duration-300 shrink-0">
        <div className="relative h-[200px] overflow-hidden bg-stone-100 dark:bg-stone-800">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xs font-semibold uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
          {product.originalPrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              SALE
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-stone-800 dark:text-stone-200 text-sm leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-stone-800 dark:text-stone-100">
                  ₹{(product.price || 0).toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{(product.originalPrice || 0).toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <StarRating rating={product.rating} />
                <span className="text-[10px] text-stone-400">{product.rating.toFixed(1)}</span>
              </div>
            </div>
            <button
              className="w-9 h-9 rounded-full bg-[#d4af37] flex items-center justify-center hover:bg-[#bfa14a] transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingBag size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Similar Inspiration Item ─────────────────────────────────────────────────

function SimilarItem({ item }: { item: GalleryItem }) {
  return (
    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/inspiration/${item.id}`}
        className="group flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-all duration-200 border border-transparent hover:border-stone-100 dark:hover:border-stone-700/50"
      >
        {/* Image Thumbnail */}
        <div className="relative w-[80px] h-[60px] rounded-lg overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800 ring-1 ring-stone-200 dark:ring-stone-700/50">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Category Badge */}
          <div className="absolute top-1 left-1 bg-[#d4af37] text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
            {item.category}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-stone-800 dark:text-stone-200 line-clamp-1 group-hover:text-[#bfa14a] transition-colors">
            {item.title}
          </h4>
          <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">{item.description}</p>
          {/* Featured indicator */}
          {item.featured && (
            <div className="text-[10px] text-[#d4af37] font-semibold mt-1 flex items-center gap-1">
              <span>★</span> Featured
            </div>
          )}
        </div>

        {/* Arrow */}
        <ChevronRight size={16} className="text-stone-300 group-hover:text-[#d4af37] transition-all duration-200 shrink-0 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InspirationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { addDream, removeDream, isDreamSaved } = useDreams()
  const { gallery } = useAdmin()
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [heartAnimating, setHeartAnimating] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timer on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  // ── Load gallery item from admin data ──
  const item = gallery.find((g) => g.id === id) || null
  const products: Product[] = [] // featured products for this inspiration
  const allItems: GalleryItem[] = gallery || [] // full list for prev/next navigation
  const currentIndex = Math.max(0, allItems.findIndex((i) => i.id === id))
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null

  // ── Advanced Similar Inspirations Algorithm ──
  const similar = item
    ? (() => {
        // Scoring system for recommendations
        type ScoredItem = GalleryItem & { score: number }
        const scored: ScoredItem[] = gallery
          .filter((g) => g.id !== item.id)
          .map((g) => {
            let score = 0

            // 1. Category Match (40 points) - HIGHEST PRIORITY
            if (g.category === item.category) {
              score += 40
            }

            // 2. Featured Items Boost (15 points)
            if (g.featured === item.featured) {
              score += 15
            }

            // 3. Title Similarity (10 points) - keyword overlap
            const itemTitleWords = item.title.toLowerCase().split(' ')
            const gTitleWords = g.title.toLowerCase().split(' ')
            const commonWords = itemTitleWords.filter((w) => gTitleWords.includes(w)).length
            score += Math.min(commonWords * 5, 10)

            // 4. Diversity Bonus (15 points) - add variety to recommendations
            // Prefer items that are NOT the most recently added
            const recentIndex = gallery.findIndex((x) => x.id === g.id)
            const currentItemIndex = gallery.findIndex((x) => x.id === item.id)
            if (Math.abs(recentIndex - currentItemIndex) > gallery.length / 3) {
              score += 15
            }

            // 5. "Related" Items from similar categories (5 points)
            // E.g., Bathroom → Living Room (same style family)
            const relatedCategories: Record<string, string[]> = {
              'Bathroom': ['Living Room', 'Bedroom', 'Entryway'],
              'Kitchen': ['Living Room', 'Dining', 'Entryway'],
              'Living Room': ['Bedroom', 'Kitchen', 'Entryway'],
              'Bedroom': ['Living Room', 'Entryway', 'Bathroom'],
              'Entryway': ['Living Room', 'Kitchen', 'Bathroom'],
              'Outdoor': ['Entryway', 'Living Room', 'Kitchen'],
              'Commercial': ['Entryway', 'Kitchen', 'Bathroom'],
              'Accent': ['Living Room', 'Bedroom', 'Kitchen'],
            }
            if (relatedCategories[item.category]?.includes(g.category)) {
              score += 5
            }

            return { ...g, score }
          })

        // Sort by score (descending), then by position for consistency
        const recommended = scored
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score
            // Tiebreaker: maintain gallery order
            return gallery.findIndex((x) => x.id === a.id) - gallery.findIndex((x) => x.id === b.id)
          })
          .slice(0, 8) // Show up to 8 recommendations
          .map(({ score, ...item }) => item)

        return recommended
      })()
    : []

  const isSaved = item ? isDreamSaved(item.id) : false

  const triggerToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMessage(msg)
    setShowToast(true)
    toastTimer.current = setTimeout(() => setShowToast(false), 3000)
  }, [])

  const handleSaveDream = useCallback(async () => {
    if (!item) return
    setIsSaving(true)
    setHeartAnimating(true)
    setTimeout(() => setHeartAnimating(false), 600)

    if (isSaved) {
      removeDream(item.id)
      triggerToast('Removed from your Dream Board')
    } else {
      const dreamItem: Omit<DreamItem, 'savedAt'> = {
        id: item.id,
        title: item.title,
        category: item.category,
        description: item.description,
        image: item.image,
        style: 'Modern',
        colorPalette: '',
        tileSize: 'Medium',
      }
      addDream(dreamItem)
      triggerToast('Saved to your Dream Board ✨')
    }
    setIsSaving(false)
  }, [item, isSaved, addDream, removeDream, triggerToast])

  const handleShare = useCallback(async () => {
    if (!item) return
    const shareData = {
      title: item.title,
      text: `Check out this inspiration: ${item.title}`,
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        triggerToast('Link copied to clipboard!')
      }
    } catch {
      triggerToast('Link copied to clipboard!')
    }
  }, [item, triggerToast])

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({
      left: dir === 'left' ? -300 : 300,
      behavior: 'smooth',
    })
  }

  const handleNavigateGallery = (direction: 'prev' | 'next') => {
    const target = direction === 'prev' ? prevItem : nextItem
    if (target) router.push(`/inspiration/${target.id}`)
  }

  // Loading / not found state
  if (!item) {
    return (
      <div className="min-h-screen bg-[oklch(0.99_0.002_60)] dark:bg-[oklch(0.13_0.005_60)]">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 animate-pulse" />
          <div className="h-4 w-48 bg-stone-100 dark:bg-stone-800 rounded animate-pulse" />
          <div className="h-3 w-32 bg-stone-100 dark:bg-stone-800 rounded animate-pulse" />
          <Link
            href="/inspiration"
            className="mt-4 px-5 py-2 rounded-xl bg-[#d4af37] text-white text-sm font-medium hover:bg-[#bfa14a] transition-colors"
          >
            Back to Gallery
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const specCards = [
    { label: 'Category', value: item.category },
    { label: 'Featured', value: item.featured ? 'Yes' : 'No' },
  ]

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.002_60)] dark:bg-[oklch(0.13_0.005_60)] text-stone-800 dark:text-stone-200">
      <Header />

      {/* ── Toast ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            variants={toastVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-sm font-medium px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2"
          >
            <Check size={14} className="text-[#d4af37]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Section ── */}
      <section className="relative">
        {/* Breadcrumb */}
        <div className="absolute top-4 left-4 sm:left-6 z-20 flex items-center gap-1.5 text-white/80 text-xs">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/inspiration" className="hover:text-white transition-colors">Inspiration</Link>
          <ChevronRight size={12} />
          <span className="text-white/60 line-clamp-1 max-w-[120px]">{item.title}</span>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[4/3] sm:aspect-square md:aspect-[16/9] lg:aspect-[4/3] max-h-[640px] overflow-hidden bg-stone-200 dark:bg-stone-800">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {[
              {
                icon: (
                  <motion.div
                    variants={heartVariants}
                    animate={heartAnimating ? 'pop' : 'idle'}
                  >
                    <Heart
                      size={16}
                      className={isSaved ? 'fill-[#d4af37] text-[#d4af37]' : ''}
                    />
                  </motion.div>
                ),
                label: isSaved ? 'Unsave' : 'Save',
                onClick: handleSaveDream,
                active: isSaved,
                i: 0,
              },
              {
                icon: <Share2 size={16} />,
                label: 'Share',
                onClick: handleShare,
                active: false,
                i: 1,
              },
              {
                icon: <Box size={16} />,
                label: 'AR Preview',
                onClick: () => triggerToast('AR Preview coming soon!'),
                active: false,
                i: 2,
                comingSoon: true,
              },
              {
                icon: <Headphones size={16} />,
                label: 'VR Tour',
                onClick: () => triggerToast('VR Tour coming soon!'),
                active: false,
                i: 3,
                comingSoon: true,
              },
            ].map((fab) => (
              <motion.button
                key={fab.label}
                custom={fab.i}
                variants={fabVariants}
                initial="hidden"
                animate="show"
                onClick={fab.onClick}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-colors group ${
                  fab.active
                    ? 'bg-[#d4af37] text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                aria-label={fab.label}
              >
                {fab.icon}
                {(fab as any).comingSoon && (
                  <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Coming Soon
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Category badge on image */}
          <div className="absolute bottom-6 left-6">
            <span className="bg-[#d4af37] text-white text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
              {item.category}
            </span>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:py-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">

          {/* ── Left / Main ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title & Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start gap-4 mb-3">
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight flex-1">
                  {item.title}
                </h1>
              </div>
              <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-base">
                {item.description}
              </p>
            </motion.div>

            {/* Spec Cards */}
            <div>
              <h2 className="font-serif text-xl mb-5">Specifications</h2>
              <div className="grid grid-cols-2 gap-3">
                {specCards.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 px-4 py-4"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5">
                      {spec.label}
                    </p>
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Products Carousel */}
            {products.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl">Featured Products</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => scrollCarousel('left')}
                      className="w-9 h-9 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => scrollCarousel('right')}
                      className="w-9 h-9 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div
                  ref={carouselRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {products.map((product) => (
                    <div key={product.id} className="snap-start shrink-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Sidebar (sticky on desktop) ── */}
          <div className="mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* Save + Share CTA */}
              <div className="rounded-2xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm">
                <h3 className="font-serif text-lg mb-1">Love this space?</h3>
                <p className="text-xs text-stone-400 mb-4">
                  Save it to your Dream Board or share it with a friend.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveDream}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isSaved
                        ? 'bg-[#d4af37] text-white hover:bg-[#bfa14a]'
                        : 'border border-[#d4af37] text-[#bfa14a] hover:bg-[#d4af37] hover:text-white'
                    }`}
                  >
                    <Heart size={15} className={isSaved ? 'fill-white' : ''} />
                    {isSaved ? 'Saved!' : 'Save'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400 transition-colors"
                  >
                    <Share2 size={15} />
                    Share
                  </button>
                </div>
              </div>

              {/* Similar Inspirations */}
              {similar.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-serif text-lg">More Like This</h3>
                    <span className="text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full">
                      {similar.length} suggestions
                    </span>
                  </div>

                  {/* Grid Layout for Better Presentation */}
                  <div className="space-y-2">
                    {/* Top Row - Featured Items (up to 3) */}
                    <div className="grid grid-cols-1 gap-2">
                      {similar.slice(0, 3).map((s, idx) => (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          viewport={{ once: true }}
                        >
                          <SimilarItem item={s} />
                        </motion.div>
                      ))}
                    </div>

                    {/* Show "View More" if additional items exist */}
                    {similar.length > 3 && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                        viewport={{ once: true }}
                        onClick={() => {
                          // Expand to show all suggestions
                          const moreItems = document.getElementById('more-suggestions')
                          if (moreItems) {
                            moreItems.style.display = moreItems.style.display === 'none' ? 'block' : 'none'
                          }
                        }}
                        className="w-full py-2.5 px-3 text-sm font-medium text-[#bfa14a] hover:text-[#d4af37] hover:bg-stone-50 dark:hover:bg-stone-800/30 rounded-lg transition-colors mt-2"
                      >
                        View {similar.length - 3} more suggestions ↓
                      </motion.button>
                    )}

                    {/* Hidden Additional Suggestions */}
                    {similar.length > 3 && (
                      <div id="more-suggestions" className="hidden space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800/50">
                        {similar.slice(3).map((s, idx) => (
                          <motion.div
                            key={s.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                          >
                            <SimilarItem item={s} />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href="/inspiration"
                    className="mt-4 flex items-center gap-2 text-sm text-[#bfa14a] hover:text-[#d4af37] transition-colors font-medium group"
                  >
                    Browse all inspirations
                    <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Prev / Next Navigation ── */}
      {(prevItem || nextItem) && (
        <>
          {/* Mobile: sticky bottom */}
          <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-4 py-3 flex items-center justify-between gap-3">
            <button
              onClick={() => handleNavigateGallery('prev')}
              disabled={!prevItem}
              className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-400 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft size={15} />
              <span className="line-clamp-1 max-w-[100px]">{prevItem?.title ?? 'Previous'}</span>
            </button>

            {allItems.length > 0 && (
              <span className="text-xs text-stone-400 shrink-0">
                {currentIndex + 1} / {allItems.length}
              </span>
            )}

            <button
              onClick={() => handleNavigateGallery('next')}
              disabled={!nextItem}
              className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-400 disabled:opacity-30 disabled:pointer-events-none"
            >
              <span className="line-clamp-1 max-w-[100px]">{nextItem?.title ?? 'Next'}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Tablet+: inline section */}
          <div className="hidden sm:block border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
            <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
              {/* Prev */}
              <button
                onClick={() => handleNavigateGallery('prev')}
                disabled={!prevItem}
                className="group flex items-center gap-4 disabled:opacity-30 disabled:pointer-events-none"
              >
                <div className="w-10 h-10 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center group-hover:border-[#d4af37] group-hover:text-[#d4af37] transition-colors">
                  <ArrowLeft size={16} />
                </div>
                {prevItem && (
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-0.5">Previous</p>
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-300 line-clamp-1 max-w-[180px] group-hover:text-[#bfa14a] transition-colors">
                      {prevItem.title}
                    </p>
                  </div>
                )}
              </button>

              {/* Progress */}
              {allItems.length > 0 && (
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center mb-1">
                    {allItems.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, i) => {
                      const absIndex = Math.max(0, currentIndex - 2) + i
                      return (
                        <div
                          key={absIndex}
                          className={`rounded-full transition-all ${
                            absIndex === currentIndex
                              ? 'w-5 h-1.5 bg-[#d4af37]'
                              : 'w-1.5 h-1.5 bg-stone-300 dark:bg-stone-700'
                          }`}
                        />
                      )
                    })}
                  </div>
                  <p className="text-xs text-stone-400">
                    {currentIndex + 1} of {allItems.length}
                  </p>
                </div>
              )}

              {/* Next */}
              <button
                onClick={() => handleNavigateGallery('next')}
                disabled={!nextItem}
                className="group flex items-center gap-4 disabled:opacity-30 disabled:pointer-events-none"
              >
                {nextItem && (
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-0.5">Next</p>
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-300 line-clamp-1 max-w-[180px] group-hover:text-[#bfa14a] transition-colors">
                      {nextItem.title}
                    </p>
                  </div>
                )}
                <div className="w-10 h-10 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center group-hover:border-[#d4af37] group-hover:text-[#d4af37] transition-colors">
                  <ArrowRight size={16} />
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Bottom padding on mobile for sticky nav */}
      <div className="h-20 sm:hidden" />

      <Footer />
    </div>
  )
}
