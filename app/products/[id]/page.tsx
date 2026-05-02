'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Product360View } from '@/components/product-360-view'
import { ProductComparison } from '@/components/product-comparison'
import { Toast } from '@/components/toast'
import { useEffect, useMemo, useState } from 'react'
import { Heart, ShoppingCart, ArrowRight, Star, ChevronLeft, ChevronRight, RotateCcw, View } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import { useDreams } from '@/contexts/dreams-context'
import { useParams } from 'next/navigation'

type ProductRecord = {
  id: string
  name: string
  price?: number
  originalPrice?: number
  category: string
  rating?: number
  inStock?: boolean
  images?: string[]
  image?: string
  description?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { addItem } = useCart()
  const { isAuthenticated, requireAuth } = useAuth()
  const { addDream, removeDream, isDreamSaved } = useDreams()
  const isWishlisted = isDreamSaved(productId)
  
  const [quantity, setQuantity] = useState(2)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showVR, setShowVR] = useState(false)
  const [show360, setShow360] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [product, setProduct] = useState<ProductRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    const loadProduct = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }

        const result = await response.json()
        const data = result.data || result
        if (!alive) return

        setProduct({
          id: data._id?.toString?.() || data.id || productId,
          name: data.name || 'Product',
          price: data.price,
          originalPrice: data.originalPrice,
          category: data.category || 'Product',
          rating: data.rating ?? 4.2,
          inStock: data.inStock ?? true,
          images: Array.isArray(data.images) && data.images.length > 0
            ? data.images
            : data.image
              ? [data.image]
              : [],
          image: data.image || '',
          description: data.description || '',
        })
      } catch (error) {
        if (!alive) return
        setLoadError(error instanceof Error ? error.message : 'Failed to load product')
      } finally {
        if (alive) setIsLoading(false)
      }
    }

    loadProduct()

    return () => {
      alive = false
    }
  }, [productId])

  const images = useMemo(() => {
    if (product?.images && product.images.length > 0) return product.images
    if (product?.image) return [product.image]
    return []
  }, [product])

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=800&auto=format&fit=crop',
  ]

  const productName = product?.name || 'Product'
  const productCategory = product?.category || 'Product'
  const productPrice = product?.price || 0
  const productOriginalPrice = product?.originalPrice || 0
  const productDescription = product?.description || 'No description available yet.'
  const productRating = product?.rating ?? 4.2
  const productInStock = product?.inStock ?? true
  const productImage = displayImages[0]

  const relatedProducts = []

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      quantity,
      image: productImage,
      category: product.category,
    })
    setAddedToCart(true)
    setShowToast(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <section className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-6 sm:px-12">
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (loadError || !product) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <section className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-4">
            <h1 className="font-serif text-3xl text-foreground">Product not found</h1>
            <p className="text-muted-foreground">{loadError || 'This product may have been deleted or the link is invalid.'}</p>
            <Link href="/products" className="inline-flex items-center gap-2 text-foreground underline">
              Back to catalog
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {showToast && (
        <Toast
          message={`${quantity} item(s) added to cart!`}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <section className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              HOME PAGE
            </Link>
            <span className="text-muted-foreground">-</span>
            <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
              CATALOG
            </Link>
            <span className="text-muted-foreground">-</span>
            <span className="text-foreground">{productName.toUpperCase()}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Thumbnails */}
            <div className="hidden lg:flex flex-col gap-3 col-span-1">
              {displayImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-foreground' : 'border-transparent hover:border-muted-foreground/50'
                  }`}
                >
                  <img src={img || "/placeholder.svg"} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Center: Main Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-square bg-muted/20 rounded-lg overflow-hidden">
                {show360 ? (
                  <Product360View productId={product.id} />
                ) : (
                  <img 
                    src={displayImages[selectedImageIndex] || "/placeholder.svg"} 
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Navigation Arrows */}
                {!show360 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-foreground" />
                    </button>
                  </>
                )}

                {/* View Mode Buttons */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={() => { setShow360(!show360); setShowVR(false); }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      show360 ? 'bg-foreground text-background' : 'bg-background/80 backdrop-blur-sm text-foreground hover:bg-background'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    360
                  </button>
                  <button
                    onClick={() => { setShowVR(!showVR); setShow360(false); }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      showVR ? 'bg-foreground text-background' : 'bg-background/80 backdrop-blur-sm text-foreground hover:bg-background'
                    }`}
                  >
                    <View className="w-3.5 h-3.5" />
                    VR
                  </button>
                </div>
              </div>

              {/* Mobile Thumbnails */}
              <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto pb-2">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? 'border-foreground' : 'border-transparent'
                    }`}
                  >
                    <img src={img || "/placeholder.svg"} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Category & Rating Row */}
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-muted-foreground tracking-wider">{productCategory}</p>
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < Math.floor(productRating) ? 'fill-foreground text-foreground' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{productRating}</span>
                  <span className="text-xs text-muted-foreground">34 reviews</span>
                </div>
              </div>

              {/* Title with Heart */}
              <div className="flex items-center gap-3 mb-4">
                <h1 className="font-serif text-3xl sm:text-4xl text-foreground">{productName}</h1>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-semibold text-foreground">₹{productPrice.toLocaleString()}</span>
                <span className="text-muted-foreground line-through">₹{productOriginalPrice.toLocaleString()}</span>
              </div>

              {/* Stock Warning */}
              <div className="mb-2">
                <p className="text-xs font-medium text-foreground">
                  {productInStock ? 'IN STOCK -' : 'OUT OF STOCK -'} <span className="text-muted-foreground">MAKE IT YOURS!</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                This product is available to add to cart.
              </p>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-foreground hover:bg-muted/50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-foreground font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-foreground hover:bg-muted/50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium rounded transition-colors ${
                    addedToCart 
                      ? 'bg-green-600 text-white' 
                      : 'bg-foreground text-background hover:bg-foreground/90'
                  }`}
                >
                  {addedToCart ? 'ADDED!' : 'ADD TO CART'}
                  <ShoppingCart className="w-4 h-4" />
                  <span className="ml-2">₹{(product.price * quantity).toLocaleString()}</span>
                </button>
                <button
                  onClick={() => {
                    if (isWishlisted) {
                      removeDream(productId)
                    } else {
                      addDream({
                        id: productId,
                        title: productName,
                        category: productCategory,
                        description: productName,
                        image: productImage || '/placeholder.svg',
                        style: '',
                        colorPalette: '',
                        tileSize: '',
                        type: 'product',
                        price: productPrice,
                        originalPrice: productOriginalPrice,
                        rating: productRating,
                        inStock: productInStock,
                      })
                    }
                  }}
                  className={`p-3 rounded border transition-colors ${
                    isWishlisted
                      ? 'bg-rose-50 dark:bg-rose-950 border-rose-300 dark:border-rose-700 text-rose-600'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Description */}
              <div className="border-t border-border pt-8">
                <h2 className="font-serif text-2xl text-foreground mb-4">Description</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {productDescription}
                </p>
                <p className="text-xs text-muted-foreground">No assembly required.</p>
              </div>
            </div>
          </div>

          {/* Dimensions Section */}
          <div className="mt-16 pt-8 border-t border-border">
            <h2 className="font-serif text-2xl text-foreground mb-8">Dimensions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Dimension Illustration */}
              <div className="flex items-center justify-center gap-8">
                <div className="relative w-48 h-48 border border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                  <img 
                    src={displayImages[0] || "/placeholder.svg"} 
                    alt="Dimension view"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">600mm</span>
                  <span className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-xs text-muted-foreground">600mm</span>
                </div>
                <div className="relative w-32 h-48 border border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                  <div className="w-24 h-8 bg-muted/50 rounded" />
                  <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">12mm</span>
                </div>
              </div>

              {/* Specs Table */}
              <div>
                <div className="text-right mb-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{product.name.toUpperCase()}</span>
                </div>
                <div className="space-y-0">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm text-foreground">{productCategory}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="text-sm text-foreground">{productInStock ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Images</span>
                    <span className="text-sm text-foreground">{displayImages.length} image{displayImages.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Section */}
          <div className="mt-16 pt-8 border-t border-border">
            <h2 className="font-serif text-2xl text-foreground mb-8">Compare with Similar Products</h2>
            <ProductComparison productId={product.id} />
          </div>

          {/* Related Products */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl text-foreground leading-tight">
                You might<br />also like
              </h2>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted/50 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
                <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted/50 transition-colors">
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-square bg-muted/20 rounded-lg overflow-hidden mb-4">
                      <img 
                        src={item.image || "/placeholder.svg"} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button className="absolute bottom-3 right-3 w-8 h-8 bg-background rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingCart className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                    <h3 className="text-sm text-foreground mb-1">{item.name}</h3>
                    <p className="text-sm font-semibold text-foreground">₹{item.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
