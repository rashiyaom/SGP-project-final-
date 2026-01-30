'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MoodBoardPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
          <h1 className="font-serif text-5xl text-foreground mb-4">Mood Board Creator</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create personalized mood boards by combining your favorite tiles, inspirations, and accessories. Save, edit, and share with designers.
          </p>

          <div className="bg-card border border-border rounded-xl p-16 inline-block">
            <p className="text-6xl mb-4">🎨</p>
            <p className="text-muted-foreground text-lg">Mood Board Creator Coming Soon</p>
            <p className="text-muted-foreground mb-6">Start building your design vision today</p>
            <Link href="/inspiration">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore Inspirations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
