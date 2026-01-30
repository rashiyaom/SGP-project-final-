'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Collection {
  id: string
  name: string
  description: string
  productCount: number
  image: string
}

const collections: Collection[] = [
  {
    id: 'ceramic',
    name: 'Ceramic Tiles',
    description: 'Premium quality ceramic tiles perfect for any room. Available in various sizes, finishes, and colors.',
    productCount: 128,
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'marble',
    name: 'Marble',
    description: 'Natural marble with timeless elegance. Premium selections perfect for luxury interiors and statement spaces.',
    productCount: 156,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'sanitary',
    name: 'Bathroom & Sanitary Ware',
    description: 'Complete bathroom solutions with premium fixtures and accessories for modern, functional spaces.',
    productCount: 94,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Premium home accessories and finishing elements to complete your design beautifully.',
    productCount: 87,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop',
  },
]

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-6xl sm:text-7xl text-foreground mb-4">
              Collections
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our premium categories designed for every space and need
            </p>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/products?collection=${collection.id}`}
              >
                <div className="group cursor-pointer h-full">
                  <div className="flex flex-col h-full">
                    {/* Collection Image */}
                    <div className="h-64 rounded-lg mb-6 overflow-hidden">
                      <img 
                        src={collection.image || "/placeholder.svg"} 
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <h2 className="font-serif text-2xl text-foreground mb-3">
                      {collection.name}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                      {collection.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        {collection.productCount} Products
                      </span>
                      <ArrowRight className="w-4 h-4 text-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16 bg-muted/10 rounded-2xl p-12 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="font-semibold text-foreground text-lg mb-2">
                  Curated Collections
                </p>
                <p className="text-muted-foreground">
                  Each collection is carefully selected to ensure quality, style, and durability for your space.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg mb-2">
                  Quality Assured
                </p>
                <p className="text-muted-foreground">
                  All our products meet stringent quality standards and come with proper warranties.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg mb-2">
                  Expert Support
                </p>
                <p className="text-muted-foreground">
                  Our team is ready to help you find the perfect products for your project.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Need personalized assistance? Contact our experts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Contact Us
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  Browse All Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
