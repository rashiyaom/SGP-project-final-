'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductGrid } from '@/components/product-grid'
import { ProductFilters } from '@/components/product-filters'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { X, SlidersHorizontal, Search, Sparkles, ArrowRight, Layers, Gem, Bath, Wrench } from 'lucide-react'

type CollectionType = 'ceramic' | 'marble' | 'sanitary' | 'accessories' | null

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}> 
      <ProductsPageInner />
    </Suspense>
  )
}

function ProductsSkeleton() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <section className="flex-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 py-8">
          <div className="h-6 w-40 bg-muted/50 rounded mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            <div className="hidden lg:block">
              <div className="h-5 w-32 bg-muted/50 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-10 bg-muted/40 rounded" />
                <div className="h-10 bg-muted/40 rounded" />
                <div className="h-10 bg-muted/40 rounded" />
              </div>
            </div>
            <div>
              <div className="h-10 bg-muted/40 rounded mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border border-border rounded-xl overflow-hidden">
                    <div className="aspect-square bg-muted/40" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-muted/40 rounded" />
                      <div className="h-4 w-2/3 bg-muted/40 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

function ProductsPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const collectionParam = searchParams.get('collection') as CollectionType
  const qParam = searchParams.get('q') ?? ''

  const [sortBy, setSortBy] = useState('default')
  const [selectedCollection, setSelectedCollection] = useState<CollectionType>(collectionParam || null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState(qParam)

  useEffect(() => {
    setSelectedCollection(collectionParam || null)
  }, [collectionParam])

  useEffect(() => {
    setSearchQuery(qParam)
  }, [qParam])

  // Reset filters when switching category to avoid cross-category redundancy
  useEffect(() => {
    setSelectedFilters({})
    setActiveFilters([])
  }, [selectedCollection])

  const setUrlParams = useCallback((next: { collection?: CollectionType; q?: string }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (typeof next.collection !== 'undefined') {
      if (next.collection) params.set('collection', next.collection)
      else params.delete('collection')
    }

    if (typeof next.q !== 'undefined') {
      const v = next.q.trim()
      if (v) params.set('q', v)
      else params.delete('q')
    }

    const qs = params.toString()
    router.push(qs ? `/products?${qs}` : '/products')
  }, [router, searchParams])

  const getCollectionName = (id: CollectionType) => {
    const names: Record<string, string> = {
      ceramic: 'Ceramic Tiles',
      marble: 'Marble',
      sanitary: 'Bathroom & Sanitary Ware',
      accessories: 'Accessories',
    }
    return id ? names[id] : 'All Products'
  }

  const handleCollectionChange = (collection: CollectionType) => {
    setSelectedCollection(collection)
    setUrlParams({ collection, q: '' })
  }

  const handleFiltersChange = useCallback((filters: Record<string, string[]>) => {
    setSelectedFilters(filters)

    const activeFilterTags: string[] = []
    Object.values(filters).forEach(values => {
      values.forEach(value => {
        activeFilterTags.push(value.charAt(0).toUpperCase() + value.slice(1))
      })
    })
    setActiveFilters(activeFilterTags)
  }, [])

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
  }

  const CategoryGate = () => {
    const cats: Array<{
      id: Exclude<CollectionType, null>
      title: string
      subtitle: string
      hint: string
      icon: React.ElementType
      gradient: string
      image: string
      pills: string[]
    }> = [
      {
        id: 'ceramic',
        title: 'Ceramics',
        subtitle: 'Everyday luxury for floors & walls',
        hint: 'Best for: kitchens, living, outdoor',
        icon: Layers,
        gradient: 'from-amber-500/30 via-orange-500/10 to-transparent',
        image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=1600&auto=format&fit=crop',
        pills: ['Matte', 'Glossy', 'Anti-Slip'],
      },
      {
        id: 'marble',
        title: 'Marble',
        subtitle: 'Premium finishes & statement patterns',
        hint: 'Best for: foyers, feature walls',
        icon: Gem,
        gradient: 'from-violet-500/25 via-fuchsia-500/10 to-transparent',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
        pills: ['Polished', 'Italian look', 'High shine'],
      },
      {
        id: 'sanitary',
        title: 'Bath Ware',
        subtitle: 'Basins, faucets & fittings that elevate',
        hint: 'Best for: modern bathrooms',
        icon: Bath,
        gradient: 'from-cyan-500/25 via-blue-500/10 to-transparent',
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1600&auto=format&fit=crop',
        pills: ['Basins', 'Faucets', 'Showers'],
      },
      {
        id: 'accessories',
        title: 'Accessories',
        subtitle: 'Trims, borders & finishing details',
        hint: 'Best for: perfect edges & accents',
        icon: Wrench,
        gradient: 'from-emerald-500/25 via-lime-500/10 to-transparent',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1600&auto=format&fit=crop',
        pills: ['Trims', 'Borders', 'Profiles'],
      },
    ]

    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-6 sm:px-12 pt-10 pb-8 sm:pt-14 sm:pb-10">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-background/50 backdrop-blur">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold tracking-wide text-foreground">Premium collections curated by Omkar Ceramic</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl text-foreground leading-tight">
                Shop
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
                What do you want to buy today?
              </p>

              <div className="mt-2 text-xs text-muted-foreground/80">
                Choose a category to see admin-curated filters and products.
              </div>
            </div>
          </div>
        </section>

        {/* Category cards */}
        <section className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-6 sm:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCollectionChange(c.id)}
                  className="group relative text-left rounded-3xl border border-border overflow-hidden bg-card hover:shadow-2xl hover:border-foreground/30 transition-all h-80"
                >
                  {/* Background image */}
                  <div className="absolute inset-0">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-75 scale-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-b ${c.gradient}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  </div>

                  <div className="relative p-8 h-full flex flex-col justify-between">
                    {/* Top section */}
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-background/80 backdrop-blur border border-border/60 flex items-center justify-center mb-6">
                        <c.icon className="w-6 h-6 text-foreground" />
                      </div>
                      <h3 className="text-3xl font-serif text-foreground mb-2">{c.title}</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">{c.subtitle}</p>
                    </div>

                    {/* Bottom section */}
                    <div className="space-y-4">
                      <p className="text-xs text-muted-foreground/80 uppercase tracking-widest">{c.hint}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {c.pills.map((p) => (
                          <span
                            key={p}
                            className="text-xs px-3 py-1.5 rounded-full bg-background/70 backdrop-blur border border-border/50 text-foreground/90 font-medium"
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-semibold text-primary">Explore</span>
                        <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleCollectionChange('ceramic')}
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-foreground text-background text-base font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Start Shopping <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                Tip: You can change or browse any category anytime.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  // Gate the shop: ask for category first
  if (!selectedCollection) {
    return <CategoryGate />
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground">{getCollectionName(selectedCollection)}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Choose filters set in Admin to refine your selection</p>
            </div>
            <button
              onClick={() => setUrlParams({ collection: null, q: '' })}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Change category
            </button>
          </div>

          <div className="flex gap-4 sm:gap-6 lg:gap-12 flex-col lg:flex-row">
            {/* Filters Sidebar - Hidden on mobile */}
            <div className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
              <h2 className="font-serif text-xl lg:text-2xl text-foreground mb-6 lg:mb-8">Filter Options</h2>
              <ProductFilters
                collection={selectedCollection}
                onCollectionChange={handleCollectionChange}
                onFiltersChange={handleFiltersChange}
              />
            </div>

            {/* Products */}
            <div className="flex-1 min-w-0">
              {/* Top Bar */}
              <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <button
                      onClick={() => setShowMobileFilters(!showMobileFilters)}
                      className="lg:hidden flex items-center gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border border-border rounded-lg text-xs sm:text-sm text-foreground hover:bg-muted whitespace-nowrap flex-shrink-0"
                    >
                      <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                      Filters
                    </button>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      Browsing {getCollectionName(selectedCollection)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 border border-border rounded text-xs sm:text-sm bg-background text-foreground cursor-pointer"
                    >
                      <option value="default">Default</option>
                      <option value="price-low">Price ↑</option>
                      <option value="price-high">Price ↓</option>
                      <option value="newest">Newest</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                </div>

                {/* Global Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={(e) => {
                      const next = e.target.value
                      setSearchQuery(next)
                      setUrlParams({ q: next })
                    }}
                    placeholder="Search in this category (name, category, description)"
                    className="w-full h-11 pl-10 pr-10 bg-muted/30 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                  {searchQuery.trim() && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setUrlParams({ q: '' })
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Filters Drawer */}
              {showMobileFilters && (
                <div className="lg:hidden mb-4 sm:mb-6 p-3 sm:p-4 border border-border rounded-lg bg-muted/30 max-h-[60vh] overflow-y-auto">
                  <ProductFilters
                    collection={selectedCollection}
                    onCollectionChange={handleCollectionChange}
                    onFiltersChange={handleFiltersChange}
                  />
                </div>
              )}

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  <span className="text-xs sm:text-sm text-muted-foreground">Active:</span>
                  {activeFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => removeFilter(filter)}
                      className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-muted text-xs sm:text-sm text-foreground rounded-full hover:bg-muted/80 whitespace-nowrap flex-shrink-0"
                    >
                      {filter}
                      <X className="w-3 h-3 sm:w-3 sm:h-3" />
                    </button>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground underline ml-1 sm:ml-2 whitespace-nowrap"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Products Grid */}
              <ProductGrid
                sortBy={sortBy}
                collection={selectedCollection}
                filters={selectedFilters}
                searchQuery={searchQuery}
              />

              {/* Pagination - Mobile optimized */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12">
                <button className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  {'<'}
                </button>
                <button className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-foreground text-background rounded-full text-xs sm:text-sm font-medium">
                  1
                </button>
                <button className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-foreground hover:bg-muted rounded-full text-xs sm:text-sm">
                  2
                </button>
                <button className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-foreground hover:bg-muted rounded-full text-xs sm:text-sm">
                  3
                </button>
                <span className="text-muted-foreground text-xs">...</span>
                <button className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-foreground hover:bg-muted rounded-full text-xs sm:text-sm">
                  10
                </button>
                <button className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  {'>'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
