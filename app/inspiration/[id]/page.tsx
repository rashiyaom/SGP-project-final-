'use client'

import { useEffect, useMemo, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toast } from '@/components/toast'
import Link from 'next/link'
import { Heart, Share2, ChevronLeft, ChevronRight, Check, Star, View, RotateCcw } from 'lucide-react'
import { useDreams } from '@/contexts/dreams-context'
import { useAdmin } from '@/contexts/admin-context'
import { TOAST_DURATION } from '@/lib/constants'

export default function InspirationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Use React 19's pattern: convert promise to state safely
  const [resolvedId, setResolvedId] = useState<string>('')
  
  useEffect(() => {
    Promise.resolve(params).then((p) => setResolvedId(p.id))
  }, [params])

  const { gallery, products } = useAdmin()
  const { isDreamSaved, addDream, removeDream } = useDreams()

  const [showSaveToast, setShowSaveToast] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
  const [showComingSoonToast, setShowComingSoonToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'info'>('success')
  const [isSavingDream, setIsSavingDream] = useState(false)

  const inspiration = useMemo(() => {
    if (!resolvedId) return null
    return gallery.find((g) => g.id === resolvedId) ?? null
  }, [gallery, resolvedId])

  const galleryIds = useMemo(() => gallery.map((g) => g.id), [gallery])
  const nav = useMemo(() => {
    if (!resolvedId || galleryIds.length === 0) {
      // If no gallery items, use current ID as fallback
      return { prevId: resolvedId || '', nextId: resolvedId || '' }
    }
    const idx = Math.max(0, galleryIds.indexOf(resolvedId))
    const prevId = galleryIds[(idx - 1 + galleryIds.length) % galleryIds.length]
    const nextId = galleryIds[(idx + 1) % galleryIds.length]
    return { prevId, nextId }
  }, [galleryIds, resolvedId])

  const isSaved = resolvedId ? isDreamSaved(resolvedId) : false

  const relatedProducts = useMemo(() => {
    if (!inspiration) return []

    // Use admin products as the source of truth.
    // Match by category name (gallery category may differ from product category format)
    const sameCategory = products.filter(
      (p) => {
        const categoryMatch = 
          p.category.toLowerCase().includes(inspiration.category.toLowerCase()) ||
          inspiration.category.toLowerCase().includes(p.category.toLowerCase())
        return categoryMatch && p.inStock
      }
    )

    // Fallback: if category strings differ, just pick in-stock products.
    const pool = sameCategory.length > 0 ? sameCategory : products.filter((p) => p.inStock)

    // Pick up to 6 deterministically (stable UI) by sorting by rating then price.
    return [...pool]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (a.price ?? 0) - (b.price ?? 0))
      .slice(0, 6)
  }, [inspiration, products])

  const similarInspirations = useMemo(() => {
    if (!inspiration) return []
    return gallery
      .filter((g) => g.id !== inspiration.id)
      .filter((g) => g.category === inspiration.category)
      .slice(0, 3)
  }, [gallery, inspiration])

  const handleSaveDream = async () => {
    if (!resolvedId || !inspiration) return
    
    try {
      setIsSavingDream(true)
      
      if (isSaved) {
        removeDream(resolvedId)
        setToastMessage('Removed from your dreams')
      } else {
        addDream({
          id: resolvedId,
          title: inspiration.title,
          category: inspiration.category,
          description: inspiration.description,
          image: inspiration.image,
          style: 'Gallery Inspiration',
          colorPalette: 'As shown',
          tileSize: 'As shown',
        })
        setToastMessage('Added to your dreams!')
      }

      setToastType('success')
      setShowSaveToast(true)
      setTimeout(() => setShowSaveToast(false), TOAST_DURATION.DEFAULT)
    } catch (error) {
      console.error('Error saving dream:', error)
      setToastMessage('Failed to save dream')
      setToastType('info')
      setShowSaveToast(true)
      setTimeout(() => setShowSaveToast(false), TOAST_DURATION.MEDIUM)
    } finally {
      setIsSavingDream(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage('Link copied to clipboard!')
      setToastType('info')
      setShowShareToast(true)
      setTimeout(() => setShowShareToast(false), TOAST_DURATION.DEFAULT)
    })
  }

  const handleShare = async () => {
    if (!resolvedId || !inspiration) return

    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/inspiration/${resolvedId}`
    const shareText = `Check out this ${inspiration.title} inspiration on Omkar Ceramic.`

    if (navigator.share) {
      try {
        await navigator.share({
          title: inspiration.title,
          text: shareText,
          url: shareUrl,
        })
        setToastMessage('Shared successfully!')
        setToastType('info')
        setShowShareToast(true)
        setTimeout(() => setShowShareToast(false), TOAST_DURATION.DEFAULT)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') copyToClipboard(shareUrl)
      }
    } else {
      copyToClipboard(shareUrl)
    }
  }

  const showComingSoon = () => {
    setToastMessage('AR / VR preview is coming soon')
    setToastType('info')
    setShowComingSoonToast(true)
    setTimeout(() => setShowComingSoonToast(false), TOAST_DURATION.DEFAULT)
  }

  const pageTitle = inspiration?.title ?? 'Inspiration'

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      {showSaveToast && (
        <Toast message={toastMessage} type={toastType} onClose={() => setShowSaveToast(false)} />
      )}

      {showShareToast && (
        <Toast message={toastMessage} type={toastType} onClose={() => setShowShareToast(false)} />
      )}

      {showComingSoonToast && (
        <Toast message={toastMessage} type={toastType} onClose={() => setShowComingSoonToast(false)} />
      )}

      <section className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/inspiration" className="hover:text-foreground">Inspiration</Link>
            <span>/</span>
            <span className="text-foreground">{pageTitle}</span>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image */}
            <div className="lg:col-span-2">
              <div className="relative aspect-[4/3] sm:aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden group">
                {inspiration?.image ? (
                  <img
                    src={inspiration.image}
                    alt={pageTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* Quick actions overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleSaveDream}
                    className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-lg font-semibold transition-colors backdrop-blur ${
                      isSaved
                        ? 'bg-accent/90 text-foreground hover:bg-accent'
                        : 'bg-background/80 hover:bg-background text-foreground'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg font-semibold bg-background/80 hover:bg-background text-foreground backdrop-blur transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4 mt-6">
                <Link href={`/inspiration/${nav.prevId}`} className="flex-1">
                  <button className="w-full p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors flex items-center justify-center gap-2">
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                </Link>
                <Link href={`/inspiration/${nav.nextId}`} className="flex-1">
                  <button className="w-full p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors flex items-center justify-center gap-2">
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <p className="text-accent font-semibold uppercase text-xs mb-2">
                  {inspiration?.category ?? 'Gallery'}
                </p>
                <h1 className="font-serif text-4xl text-foreground mb-2">
                  {pageTitle}
                </h1>
                <p className="text-muted-foreground">
                  {inspiration?.description ?? 'Explore this inspiration from our gallery.'}
                </p>
              </div>

              {/* AR / VR */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={showComingSoon}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                >
                  <View className="w-5 h-5" />
                  AR Preview
                </button>
                <button
                  onClick={showComingSoon}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  VR Tour
                </button>
              </div>

              {/* Featured Products (Admin-synced) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-foreground">Featured Products</h3>
                  <Link href="/products" className="text-sm text-primary hover:underline">View all</Link>
                </div>

                {relatedProducts.length === 0 ? (
                  <div className="p-4 bg-muted/10 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">No products available right now.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {relatedProducts.slice(0, 4).map((product) => (
                      <Link key={product.id} href={`/products/${product.id}`}>
                        <div className="p-3 bg-card border border-border rounded-lg hover:border-accent transition-colors cursor-pointer group">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground text-sm truncate">{product.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-muted-foreground">
                                  ₹{product.price.toLocaleString()}
                                  {product.originalPrice ? (
                                    <span className="ml-1 line-through opacity-70">₹{product.originalPrice.toLocaleString()}</span>
                                  ) : null}
                                </p>
                                <span className="text-[10px] text-muted-foreground">•</span>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span>{product.rating.toFixed(1)}</span>
                                </div>
                                {!product.inStock && (
                                  <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400">Out of stock</span>
                                )}
                              </div>
                            </div>
                            <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Similar Inspirations */}
              <div className="bg-muted/10 rounded-lg p-4">
                <p className="text-sm font-semibold text-foreground mb-3">More from this category</p>
                {similarInspirations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No similar inspirations found.</p>
                ) : (
                  <div className="space-y-2">
                    {similarInspirations.map((g) => (
                      <Link key={g.id} href={`/inspiration/${g.id}`}>
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-background/60 border border-border/60 hover:bg-background transition-colors">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{g.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{g.description}</p>
                          </div>
                          <span className="ml-auto text-primary">→</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Back to gallery */}
              <Link href="/inspiration">
                <button className="w-full flex items-center justify-center gap-2 p-3 border border-border rounded-lg hover:bg-accent/10 transition-colors">
                  <Check className="w-5 h-5" />
                  Back to Inspiration Gallery
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
