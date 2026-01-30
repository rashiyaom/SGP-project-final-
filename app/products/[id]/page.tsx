'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Product360View } from '@/components/product-360-view'
import { ProductComparison } from '@/components/product-comparison'
import { useState } from 'react'
import { Heart, ShoppingCart, ArrowRight, Star, ChevronLeft, ChevronRight, RotateCcw, View } from 'lucide-react'
import Link from 'next/link'

// Product images based on category
const productImages: Record<string, string[]> = {
  '1': [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop',
  ],
}

const relatedProducts = [
  { id: '2', name: 'Ceramic White Pearl', price: 1200, image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=600&auto=format&fit=crop' },
  { id: '3', name: 'Cream Travertine', price: 2200, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop' },
  { id: '4', name: 'Polished Quartz', price: 3200, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop' },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(2)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showVR, setShowVR] = useState(false)
  const [show360, setShow360] = useState(false)

  const images = productImages[params.id] || productImages.default

  const product = {
    id: params.id,
    name: 'Marble Elegance 60x60',
    price: 2500,
    originalPrice: 2980,
    category: 'MARBLE TILES',
    rating: 4.2,
    reviews: 34,
    inStock: true,
    stockCount: 3,
    recommended: 93,
    description: 'A design that has truly stood the test of time, the Marble Elegance is one of the most recognised premium tiles of the decade. Originally crafted in Italy, this marble tile\'s most prominent feature is its curved natural veining. Pioneering at the time, our artisans overcame the difficulty of forming a single polished marble piece with precision cuts, by creating a fluid shape using a singular curve.',
    specs: [
      { label: 'HEIGHT', value: '600MM' },
      { label: 'WIDTH', value: '600MM' },
      { label: 'DEPTH', value: '12MM' },
      { label: 'COVERAGE', value: '0.36 SQ.M' },
      { label: 'FINISH', value: 'POLISHED' },
      { label: 'WEIGHT', value: '7KG' },
    ],
    finishes: ['#2C2C2C', '#8B7355', '#D4C4B0'],
    frames: ['#F5F5F5', '#1A1A1A'],
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

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
            <span className="text-foreground">{product.name.toUpperCase()}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Thumbnails */}
            <div className="hidden lg:flex flex-col gap-3 col-span-1">
              {images.map((img, index) => (
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
                    src={images[selectedImageIndex] || "/placeholder.svg"} 
                    alt={product.name}
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
                {images.map((img, index) => (
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
                <p className="text-xs text-muted-foreground tracking-wider">{product.category}</p>
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-foreground text-foreground' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">{product.reviews} reviews</span>
                </div>
              </div>

              {/* Title with Heart */}
              <div className="flex items-center gap-3 mb-4">
                <h1 className="font-serif text-3xl sm:text-4xl text-foreground">{product.name}</h1>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-semibold text-foreground">Rs. {product.price.toLocaleString()}</span>
                <span className="text-muted-foreground line-through">Rs. {product.originalPrice.toLocaleString()}</span>
              </div>

              {/* Finish Options */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">FINISH</p>
                  <div className="flex gap-2">
                    {product.finishes.map((color, i) => (
                      <button 
                        key={i}
                        className={`w-6 h-6 rounded-full border-2 ${i === 0 ? 'border-foreground' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">FRAME</p>
                  <div className="flex gap-2">
                    {product.frames.map((color, i) => (
                      <button 
                        key={i}
                        className={`w-6 h-6 rounded-full border-2 ${i === 0 ? 'border-foreground' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Stock Warning */}
              <div className="mb-2">
                <p className="text-xs font-medium text-foreground">
                  LAST {product.stockCount} LEFT - <span className="text-muted-foreground">MAKE IT YOURS!</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                {product.recommended}% OF BUYERS HAVE RECOMMENDED THIS
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
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded hover:bg-foreground/90 transition-colors">
                  ADD TO CART
                  <ShoppingCart className="w-4 h-4" />
                  <span className="ml-2">Rs. {(product.price * quantity).toLocaleString()}</span>
                </button>
              </div>

              {/* Description */}
              <div className="border-t border-border pt-8">
                <h2 className="font-serif text-2xl text-foreground mb-4">Description</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {product.description}
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
                    src={images[0] || "/placeholder.svg"} 
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
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-sm text-muted-foreground">{spec.label}</span>
                      <span className="text-sm text-foreground">{spec.value}</span>
                    </div>
                  ))}
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
                    <p className="text-sm font-semibold text-foreground">Rs. {item.price.toLocaleString()}</p>
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
