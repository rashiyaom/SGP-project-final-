'use client'

import { use } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'

const inspirationData: Record<string, {
  title: string
  category: string
  description: string
  image: string
  style: string
  colorPalette: string
  tileSize: string
  products: Array<{ name: string; price: number }>
}> = {
  '1': {
    title: 'Modern Bathroom',
    category: 'Bathroom',
    description: 'Sleek white marble tiles create a spa-like atmosphere in this luxurious bathroom design.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1600&auto=format&fit=crop',
    style: 'Modern Luxury',
    colorPalette: 'White & Grey',
    tileSize: '60x60 cm',
    products: [
      { name: 'Marble Elegance 60x60', price: 45 },
      { name: 'Polished Quartz', price: 60 },
    ],
  },
  '2': {
    title: 'Kitchen Elegance',
    category: 'Kitchen',
    description: 'Premium granite counters with coordinating backsplash tiles for a sophisticated cooking space.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1600&auto=format&fit=crop',
    style: 'Contemporary',
    colorPalette: 'Granite & Cream',
    tileSize: '30x60 cm',
    products: [
      { name: 'Granite Subway Tiles', price: 38 },
      { name: 'Ceramic Backsplash', price: 28 },
    ],
  },
  '3': {
    title: 'Living Room Luxury',
    category: 'Living Room',
    description: 'Large format tiles create continuity in modern living spaces with elegant minimalist design.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
    style: 'Modern Minimalist',
    colorPalette: 'Beige & Warm Grey',
    tileSize: '80x80 cm',
    products: [
      { name: 'Large Format Porcelain', price: 52 },
      { name: 'Matte Finish Tiles', price: 48 },
    ],
  },
  '4': {
    title: 'Bedroom Serenity',
    category: 'Bedroom',
    description: 'Warm terracotta tiles bring natural comfort and earthy elegance to bedroom spaces.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1600&auto=format&fit=crop',
    style: 'Rustic Modern',
    colorPalette: 'Terracotta & Cream',
    tileSize: '40x40 cm',
    products: [
      { name: 'Terracotta Classic', price: 35 },
      { name: 'Warm Clay Tiles', price: 32 },
    ],
  },
  '5': {
    title: 'Entryway Statement',
    category: 'Entryway',
    description: 'Bold geometric patterns make a striking first impression in this contemporary entryway design.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
    style: 'Contemporary Bold',
    colorPalette: 'Black & White',
    tileSize: '30x30 cm',
    products: [
      { name: 'Geometric Pattern Tiles', price: 42 },
      { name: 'Monochrome Mosaic', price: 55 },
    ],
  },
  '6': {
    title: 'Outdoor Oasis',
    category: 'Outdoor',
    description: 'Weather-resistant tiles perfect for patios and pools, combining durability with style.',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1600&auto=format&fit=crop',
    style: 'Outdoor Modern',
    colorPalette: 'Stone & Natural',
    tileSize: '60x60 cm',
    products: [
      { name: 'Weather-Proof Porcelain', price: 48 },
      { name: 'Anti-Slip Outdoor Tiles', price: 52 },
    ],
  },
  '7': {
    title: 'Commercial Space',
    category: 'Commercial',
    description: 'Durable tiles for high-traffic commercial environments with professional aesthetic.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
    style: 'Professional Modern',
    colorPalette: 'Neutral Grey',
    tileSize: '60x60 cm',
    products: [
      { name: 'Commercial Grade Porcelain', price: 45 },
      { name: 'High-Traffic Tiles', price: 50 },
    ],
  },
  '8': {
    title: 'Accent Walls',
    category: 'Accent',
    description: 'Feature walls with unique tile patterns and textures that become the focal point of any room.',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1600&auto=format&fit=crop',
    style: 'Artistic Contemporary',
    colorPalette: 'Multi-Tone',
    tileSize: '20x60 cm',
    products: [
      { name: '3D Textured Tiles', price: 65 },
      { name: 'Feature Wall Collection', price: 58 },
    ],
  },
}

export default function InspirationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const inspiration = inspirationData[id] || inspirationData['1']
  const currentId = parseInt(id)
  const prevId = currentId > 1 ? currentId - 1 : 8
  const nextId = currentId < 8 ? currentId + 1 : 1

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/inspiration" className="hover:text-foreground">Inspiration</Link>
            <span>/</span>
            <span className="text-foreground">{inspiration.title}</span>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image */}
            <div className="lg:col-span-2">
              <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden group">
                <img
                  src={inspiration.image}
                  alt={inspiration.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4 mt-6">
                <Link href={`/inspiration/${prevId}`} className="flex-1">
                  <button className="w-full p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors flex items-center justify-center gap-2">
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                </Link>
                <Link href={`/inspiration/${nextId}`} className="flex-1">
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
                  {inspiration.category}
                </p>
                <h1 className="font-serif text-4xl text-foreground mb-2">
                  {inspiration.title}
                </h1>
                <p className="text-muted-foreground">
                  {inspiration.description}
                </p>
              </div>

              {/* Featured Products */}
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-3">
                  Featured Products
                </h3>
                <div className="space-y-2">
                  {inspiration.products.map((product, i) => (
                    <div
                      key={i}
                      className="p-3 bg-card border border-border rounded-lg hover:border-accent transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ${product.price}/sqft
                          </p>
                        </div>
                        <span className="text-primary group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design Details */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">
                  Design Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Style</span>
                    <span className="text-foreground font-semibold">{inspiration.style}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color Palette</span>
                    <span className="text-foreground font-semibold">{inspiration.colorPalette}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tile Size</span>
                    <span className="text-foreground font-semibold">{inspiration.tileSize}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors">
                  <Heart className="w-5 h-5" />
                  Save Inspiration
                </button>
                <button className="w-full flex items-center justify-center gap-2 p-3 border-2 border-primary text-primary hover:bg-primary/5 rounded-lg font-semibold transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>

              {/* Similar Inspirations */}
              <div className="bg-muted/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Like this inspiration? Explore similar bathroom designs and create your perfect mood board.
                </p>
                <Link href="/inspiration">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3 border-primary text-primary hover:bg-primary/5 bg-transparent"
                  >
                    View All Inspirations
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
