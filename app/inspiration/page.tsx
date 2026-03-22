'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toast } from '@/components/toast'
import {
  Search,
  X,
  ChevronDown,
  Check,
  SlidersHorizontal,
  Eye,
  Heart,
  Loader2,
} from 'lucide-react'
import { useDreams } from '@/contexts/dreams-context'
import { useAdmin } from '@/contexts/admin-context'

// ─── Types ────────────────────────────────────────────────────────────────────

interface GalleryItem {
  id: string
  title: string
  category: string
  description: string
  image: string
  featured?: boolean
  viewCount?: number
  trendingScore?: number
  createdAt?: string
  style?: string
  colorPalette?: string[]
  tags?: string[]
  height?: 'short' | 'medium' | 'tall'
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12

const CATEGORIES = [
  'All',
  'Ceramic Tiles',
  'Marble',
  'Bathroom & Sanitary Ware',
  'Accessories',
]

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'trending', label: 'Trending' },
  { value: 'az', label: 'A–Z' },
]

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeInOut' } },
}

const heroTextVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const overlayVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3 } },
}

const actionsVariants = {
  rest: { opacity: 0, y: 16 },
  hover: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard({ height }: { height: string }) {
  return (
    <div
      className="rounded-[0.75rem] overflow-hidden bg-stone-100 dark:bg-stone-800 animate-pulse"
      style={{ height }}
    />
  )
}

// ─── Gallery Card ─────────────────────────────────────────────────────────────

function GalleryCard({ item, index, onSaveDream }: { item: GalleryItem; index: number; onSaveDream: (id: string, e: React.MouseEvent) => void }) {
  const heightMap = { short: '260px', medium: '340px', tall: '420px' }
  const cardHeight = heightMap[item.height ?? 'medium']

  return (
    <motion.div
      variants={itemVariants}
      className="group relative rounded-[0.75rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
      style={{ height: cardHeight }}
    >
      <Link href={`/inspiration/${item.id}`} className="block w-full h-full">
        {/* Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Featured Badge */}
        {item.featured && (
          <div className="absolute top-3 left-3 z-10 bg-[#d4af37] text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
            Featured
          </div>
        )}

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          variants={overlayVariants}
          initial="rest"
          whileHover="hover"
        >
          {/* Action Buttons */}
          <motion.div
            className="absolute bottom-4 left-4 right-4 flex items-end justify-between"
            variants={actionsVariants}
          >
            <div>
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full mb-2">
                {item.category}
              </span>
              <h3 className="text-white font-serif text-lg leading-tight line-clamp-2">
                {item.title}
              </h3>
            </div>
            <div className="flex flex-col gap-2 ml-3 shrink-0">
              <button
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#d4af37] transition-colors"
                onClick={(e) => onSaveDream(item.id, e)}
                aria-label="Save"
              >
                <Heart size={15} />
              </button>
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <Eye size={12} />
                <span>{item.viewCount?.toLocaleString() ?? '—'}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

// ─── Category Dropdown ────────────────────────────────────────────────────────

function CategoryDropdown({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700/60 text-sm font-medium text-stone-700 dark:text-stone-300 hover:border-[#d4af37]/60 transition-colors backdrop-blur-sm whitespace-nowrap"
      >
        <SlidersHorizontal size={14} className="text-[#d4af37]" />
        {value === 'All' ? 'Category' : value}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 left-0 z-50 min-w-[200px] rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-2xl overflow-hidden"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onChange(cat)
                  setOpen(false)
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${value === cat ? 'border-[#d4af37] bg-[#d4af37]' : 'border-stone-300'}`}>
                  {value === cat && <Check size={10} className="text-white" />}
                </span>
                {cat}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Sort Dropdown ────────────────────────────────────────────────────────────

function SortDropdown({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = SORT_OPTIONS.find((o) => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700/60 text-sm font-medium text-stone-700 dark:text-stone-300 hover:border-[#d4af37]/60 transition-colors backdrop-blur-sm whitespace-nowrap"
      >
        {current?.label ?? 'Sort'}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 right-0 z-50 min-w-[160px] rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-2xl overflow-hidden"
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${value === opt.value ? 'bg-[#d4af37]/10 text-[#bfa14a] font-medium' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InspirationPage() {
  const { isDreamSaved, addDream, removeDream } = useDreams()
  const { gallery } = useAdmin()

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSortBy, setActiveSortBy] = useState('latest')
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'info'>('success')
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Convert gallery data to GalleryItem format
  const galleryData: GalleryItem[] = useMemo(() => {
    return gallery.map((item, index) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      description: item.description,
      image: item.image,
      featured: item.featured || false,
      viewCount: Math.floor(Math.random() * 5000),
      trendingScore: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      style: 'Premium Design',
      colorPalette: [item.category],
      tags: [item.category],
      height: (['short', 'medium', 'tall'][index % 3]) as 'short' | 'medium' | 'tall',
    }))
  }, [gallery])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  // Simulate initial loading
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  // Filter + sort
  const filteredGallery = useMemo(() => {
    let result = [...galleryData]

    if (activeCategory !== 'All') {
      result = result.filter((item) => item.category === activeCategory)
    }

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }

    switch (activeSortBy) {
      case 'latest':
        result.sort((a, b) =>
          (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
        )
        break
      case 'popular':
        result.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
        break
      case 'trending':
        result.sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0))
        break
      case 'az':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [galleryData, activeCategory, debouncedSearch, activeSortBy])

  const visibleItems = filteredGallery.slice(0, displayedItems)
  const hasMore = displayedItems < filteredGallery.length
  const hasActiveFilters = activeCategory !== 'All' || debouncedSearch.trim() !== ''

  const handleClearFilters = () => {
    setSearchQuery('')
    setActiveCategory('All')
    setDisplayedItems(ITEMS_PER_PAGE)
  }

  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setDisplayedItems((prev) => prev + ITEMS_PER_PAGE)
      setIsLoadingMore(false)
    }, 600)
  }, [])

  const handleSaveDream = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault()
    const item = galleryData.find((g) => g.id === itemId)
    if (!item) return

    if (isDreamSaved(itemId)) {
      removeDream(itemId)
      setToastMessage('💔 Removed from your dreams')
    } else {
      addDream({
        id: item.id,
        title: item.title,
        category: item.category,
        description: item.description,
        image: item.image,
        style: item.style || 'Gallery Inspiration',
        colorPalette: item.colorPalette?.join(', ') || 'As shown',
        tileSize: 'As shown',
      })
      setToastMessage('✨ Added to your dreams!')
    }
    setToastType('success')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.002_60)] dark:bg-[oklch(0.13_0.005_60)] text-stone-800 dark:text-stone-200">
      <Header />

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[400px] sm:h-[480px] lg:h-[560px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-50 dark:from-stone-900 dark:via-stone-800 dark:to-stone-700" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 sm:px-12 pb-14">
          <motion.span
            custom={0}
            variants={heroTextVariants}
            initial="hidden"
            animate="show"
            className="inline-block text-[#d4af37] text-xs font-semibold uppercase tracking-[0.25em] mb-3"
          >
            Curated Collection
          </motion.span>
          <motion.h1
            custom={1}
            variants={heroTextVariants}
            initial="hidden"
            animate="show"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight max-w-2xl"
          >
            Design Inspiration Gallery
          </motion.h1>
          <motion.p
            custom={2}
            variants={heroTextVariants}
            initial="hidden"
            animate="show"
            className="mt-3 text-white/75 text-sm sm:text-base max-w-xl leading-relaxed"
          >
            Explore thousands of curated spaces crafted with our premium ceramics,
            marble, and accessories. Find your perfect aesthetic.
          </motion.p>
        </div>
      </section>

      {/* ── Sticky Toolbar ── */}
      <div className="sticky top-0 z-40 bg-[oklch(0.99_0.002_60)]/80 dark:bg-[oklch(0.13_0.005_60)]/80 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search inspirations…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700/60 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#d4af37]/60 focus:ring-2 focus:ring-[#d4af37]/20 transition backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category */}
            <CategoryDropdown value={activeCategory} onChange={setActiveCategory} />

            {/* Sort */}
            <SortDropdown value={activeSortBy} onChange={setActiveSortBy} />

            {/* Clear */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <X size={13} />
                  Clear
                </motion.button>
              )}
            </AnimatePresence>

            {/* Counter */}
            <span className="ml-auto text-xs text-stone-400 dark:text-stone-500 whitespace-nowrap hidden sm:block">
              Showing {Math.min(displayedItems, filteredGallery.length)} of{' '}
              {filteredGallery.length}
            </span>
          </div>
        </div>
      </div>

      {/* ── Gallery Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          /* Skeleton Loading */
          <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-5 space-y-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-5">
                <SkeletonCard
                  height={['260px', '340px', '420px', '300px'][i % 4]}
                />
              </div>
            ))}
          </div>
        ) : filteredGallery.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-stone-400" />
            </div>
            <h3 className="font-serif text-xl text-stone-600 dark:text-stone-400 mb-2">
              No results found
            </h3>
            <p className="text-sm text-stone-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2 rounded-xl bg-[#d4af37] text-white text-sm font-medium hover:bg-[#bfa14a] transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          /* Masonry Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-5"
          >
            {visibleItems.map((item, index) => (
              <div key={item.id} className="break-inside-avoid mb-5">
                <GalleryCard item={item} index={index} onSaveDream={handleSaveDream} />
              </div>
            ))}
          </motion.div>
        )}

        {/* Load More */}
        {!isLoading && hasMore && (
          <div ref={loadMoreRef} className="flex flex-col items-center mt-12 gap-3">
            <p className="text-xs text-stone-400">
              Showing {Math.min(displayedItems, filteredGallery.length)} of{' '}
              {filteredGallery.length} inspirations
            </p>
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-2 px-8 py-3 rounded-xl border border-[#d4af37] text-[#bfa14a] font-medium text-sm hover:bg-[#d4af37] hover:text-white transition-all duration-300 disabled:opacity-60"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Loading…
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
