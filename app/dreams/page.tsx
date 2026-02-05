'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, ArrowRight, Trash2 } from 'lucide-react'
import { useDreams } from '@/contexts/dreams-context'

export default function DreamsPage() {
  const { dreams, removeDream } = useDreams()

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <h1 className="font-serif text-4xl text-foreground mb-2">My Dreams</h1>
          <p className="text-muted-foreground mb-8">Your saved design inspirations and projects</p>

          {dreams.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-2xl text-muted-foreground mb-4">Your dreams collection is empty</p>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start saving your favorite inspirations and design projects to your dreams collection.
              </p>
              <Link href="/inspiration">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Explore Inspirations
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dreams.map((dream) => (
                <div
                  key={dream.id}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                    <img
                      src={dream.image}
                      alt={dream.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-accent font-semibold uppercase text-xs mb-2">
                      {dream.category}
                    </p>
                    <h3 className="font-semibold text-foreground text-lg mb-2">
                      {dream.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {dream.description}
                    </p>

                    {/* Details */}
                    <div className="bg-muted/30 rounded-lg p-3 mb-4 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Style</span>
                        <span className="text-foreground font-semibold">{dream.style}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Colors</span>
                        <span className="text-foreground font-semibold">{dream.colorPalette}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size</span>
                        <span className="text-foreground font-semibold">{dream.tileSize}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/inspiration/${dream.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-border bg-transparent text-foreground hover:bg-muted"
                        >
                          View
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <button
                        onClick={() => removeDream(dream.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-foreground hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-300 transition-colors"
                        title="Remove from dreams"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          {dreams.length > 0 && (
            <div className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 text-center">
              <h2 className="font-serif text-3xl text-foreground mb-4">
                Ready to bring your dreams to life?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Browse our products that match your saved inspirations or contact our design consultants for personalized recommendations.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Shop Products
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                    Get Design Help
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
