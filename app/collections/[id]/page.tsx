'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  
  const collection = {
    id: resolvedParams.id,
    name: 'Luxury Collection',
    description: 'Opulent tiles and marble for the most refined spaces',
    productCount: 128,
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <h1 className="font-serif text-5xl text-foreground mb-4">
            {collection.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {collection.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-6xl">
                  🪨
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    Premium Tile {i + 1}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-4">
                    $45<span className="text-sm text-muted-foreground">/sqft</span>
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
