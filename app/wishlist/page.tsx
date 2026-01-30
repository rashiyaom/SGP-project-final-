'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'

export default function WishlistPage() {
  const wishlistItems = [
    { id: '1', name: 'Marble Elegance 60x60', price: 45, image: '🪨' },
    { id: '3', name: 'Luxury Granite Finish', price: 58, image: '🏔️' },
  ]

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <h1 className="font-serif text-4xl text-foreground mb-8">My Wishlist</h1>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-2xl text-muted-foreground mb-4">
                Your wishlist is empty
              </p>
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Explore Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-xl p-6 flex flex-col"
                >
                  <div className="h-48 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center text-6xl mb-4">
                    {item.image}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {item.name}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-4 mt-auto">
                    ${item.price}<span className="text-sm text-muted-foreground">/sqft</span>
                  </p>
                  <Link href={`/products/${item.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      View Product
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
