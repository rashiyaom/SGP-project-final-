'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Star, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Inspiration {
  id: string
  title: string
  category: string
  icon: string
  description: string
  featured: boolean
}

const inspirationProjects: Inspiration[] = [
  {
    id: '1',
    title: 'Modern Bathroom',
    category: 'Bathroom',
    icon: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1200&auto=format&fit=crop',
    description: 'Sleek white marble tiles create a spa-like atmosphere',
    featured: true,
  },
  {
    id: '2',
    title: 'Kitchen Elegance',
    category: 'Kitchen',
    icon: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200&auto=format&fit=crop',
    description: 'Premium granite counters with coordinating backsplash',
    featured: false,
  },
  {
    id: '3',
    title: 'Living Room Luxury',
    category: 'Living Room',
    icon: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
    description: 'Large format tiles create continuity in modern living spaces',
    featured: true,
  },
  {
    id: '4',
    title: 'Bedroom Serenity',
    category: 'Bedroom',
    icon: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
    description: 'Warm terracotta tiles bring natural comfort to bedrooms',
    featured: false,
  },
  {
    id: '5',
    title: 'Entryway Statement',
    category: 'Entryway',
    icon: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
    description: 'Bold geometric patterns make a striking first impression',
    featured: true,
  },
  {
    id: '6',
    title: 'Outdoor Oasis',
    category: 'Outdoor',
    icon: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop',
    description: 'Weather-resistant tiles perfect for patios and pools',
    featured: false,
  },
  {
    id: '7',
    title: 'Commercial Space',
    category: 'Commercial',
    icon: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    description: 'Durable tiles for high-traffic commercial environments',
    featured: false,
  },
  {
    id: '8',
    title: 'Accent Walls',
    category: 'Accent',
    icon: 'https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1200&auto=format&fit=crop',
    description: 'Feature walls with unique tile patterns and textures',
    featured: true,
  },
]

export default function InspirationPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

<section className="flex-1 py-8">
  <div className="max-w-7xl mx-auto px-6 sm:px-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl text-foreground mb-4">
              Design Inspiration
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore real projects and room inspirations to spark your creative
              journey. Get ideas for every space in your home.
            </p>
          </div>

          {/* Featured Inspiration */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl text-foreground mb-6">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inspirationProjects
                .filter((p) => p.featured)
                .map((inspiration) => (
                  <Link
                    key={inspiration.id}
                    href={`/inspiration/${inspiration.id}`}
                  >
                    <div className="group cursor-pointer">
                      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all">
                        {/* Featured Image */}
                        <div className="relative h-80 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                          <img
                            src={inspiration.icon}
                            alt={inspiration.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <p className="text-accent font-semibold uppercase text-xs mb-2">
                            {inspiration.category}
                          </p>
                          <h3 className="font-serif text-2xl text-foreground mb-3">
                            {inspiration.title}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {inspiration.description}
                          </p>

                          {/* CTA */}
                          <div className="flex items-center text-primary font-semibold hover:gap-2 transition-all gap-1">
                            View Project
                            <span>→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* All Inspirations Grid */}
          <div>
            <h2 className="font-serif text-3xl text-foreground mb-6">
              All Inspirations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {inspirationProjects.map((inspiration) => (
                <Link
                  key={inspiration.id}
                  href={`/inspiration/${inspiration.id}`}
                >
                  <div className="group cursor-pointer h-full">
                    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                        <img
                          src={inspiration.icon}
                          alt={inspiration.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col">
                        <p className="text-accent font-semibold uppercase text-xs mb-2">
                          {inspiration.category}
                        </p>
                        <h3 className="font-semibold text-foreground text-lg mb-2">
                          {inspiration.title}
                        </h3>
                        <p className="text-muted-foreground text-sm flex-1 mb-4 line-clamp-2">
                          {inspiration.description}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-border bg-transparent"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-border bg-transparent"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mood Board CTA */}
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 text-center">
            <h2 className="font-serif text-4xl text-foreground mb-4">
              Create Your Mood Board
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Combine your favorite inspirations, tiles, and accessories into a
              personal mood board. Save, edit, and share with designers.
            </p>
            <Link href="/mood-board">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-lg font-semibold">
                Start Creating
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
