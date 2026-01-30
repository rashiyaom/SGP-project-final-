'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'

export default async function InspirationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  
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
            <span className="text-foreground">Modern Bathroom</span>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image */}
            <div className="lg:col-span-2">
              <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center text-9xl overflow-hidden group">
                🚿
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4 mt-6">
                <button className="flex-1 p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors flex items-center justify-center gap-2">
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                <button className="flex-1 p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors flex items-center justify-center gap-2">
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <p className="text-accent font-semibold uppercase text-xs mb-2">
                  Bathroom
                </p>
                <h1 className="font-serif text-4xl text-foreground mb-2">
                  Modern Bathroom
                </h1>
                <p className="text-muted-foreground">
                  Sleek white marble tiles create a spa-like atmosphere in this luxurious bathroom design.
                </p>
              </div>

              {/* Featured Products */}
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-3">
                  Featured Products
                </h3>
                <div className="space-y-2">
                  {[
                    { name: 'Marble Elegance 60x60', price: 45 },
                    { name: 'Polished Quartz', price: 60 },
                  ].map((product, i) => (
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
                    <span className="text-foreground font-semibold">Modern Luxury</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color Palette</span>
                    <span className="text-foreground font-semibold">White & Grey</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tile Size</span>
                    <span className="text-foreground font-semibold">60x60 cm</span>
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
