'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductGrid } from '@/components/product-grid'
import { ProductFilters } from '@/components/product-filters'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { X, SlidersHorizontal } from 'lucide-react'

type CollectionType = 'ceramic' | 'marble' | 'sanitary' | 'accessories' | null

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const collectionParam = searchParams.get('collection') as CollectionType
    const [sortBy, setSortBy] = useState('default')
  const [selectedCollection, setSelectedCollection] = useState<CollectionType>(collectionParam || null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  useEffect(() => {
    setSelectedCollection(collectionParam || null)
  }, [collectionParam])

  const getCollectionName = (id: CollectionType) => {
    const names: Record<string, string> = {
      ceramic: 'Ceramic Tiles',
      marble: 'Marble',
      sanitary: 'Bathroom & Sanitary',
      accessories: 'Accessories',    }
    return id ? names[id] : 'All Products'
  }

  const handleCollectionChange = (collection: CollectionType) => {
    setSelectedCollection(collection)
    if (collection) {
      router.push(`/products?collection=${collection}`)
    } else {
      router.push('/products')
    }
  }

  const handleFiltersChange = useCallback((filters: Record<string, string[]>) => {
    setSelectedFilters(filters)
    
    // Convert filters to active filter tags
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

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <section className="flex-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8">
          {/* Main Content */}
          <div className="flex gap-4 sm:gap-6 lg:gap-12 flex-col lg:flex-row">            {/* Filters Sidebar - Hidden on mobile */}
            <div className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
              <h2 className="font-serif text-xl lg:text-2xl text-foreground mb-6 lg:mb-8">Filter Options</h2>
              <ProductFilters collection={selectedCollection} onCollectionChange={handleCollectionChange} onFiltersChange={handleFiltersChange} />
            </div>

            {/* Products */}
            <div className="flex-1 min-w-0">
              {/* Top Bar - Mobile optimized */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden flex items-center gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border border-border rounded-lg text-xs sm:text-sm text-foreground hover:bg-muted whitespace-nowrap flex-shrink-0"
                  >
                    <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                    Filters
                  </button>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    Showing {getCollectionName(selectedCollection)}
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
              </div>              {/* Mobile Filters Drawer */}
              {showMobileFilters && (
                <div className="lg:hidden mb-4 sm:mb-6 p-3 sm:p-4 border border-border rounded-lg bg-muted/30 max-h-[60vh] overflow-y-auto">
                  <ProductFilters collection={selectedCollection} onCollectionChange={handleCollectionChange} onFiltersChange={handleFiltersChange} />
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

              {/* Collection Title */}
              {selectedCollection && (
                <div className="mb-4 sm:mb-6">
                  <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-foreground">
                    {getCollectionName(selectedCollection)}
                  </h1>
                </div>
              )}              {/* Products Grid */}
              <ProductGrid sortBy={sortBy} collection={selectedCollection} filters={selectedFilters} />

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

export default ProductsContent
