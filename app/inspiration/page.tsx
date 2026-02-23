'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toast } from '@/components/toast'
import { Star, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { useDreams } from '@/contexts/dreams-context'
import { useAdmin } from '@/contexts/admin-context'

interface Inspiration {
  id: string
  title: string
  category: string
  icon: string
  description: string
  featured: boolean
}

export default function InspirationPage() {
  const { isDreamSaved, addDream, removeDream } = useDreams()
  const { gallery } = useAdmin()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Map gallery items to Inspiration type
  const inspirationProjects: Inspiration[] = gallery.map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    icon: item.image,
    description: item.description,
    featured: item.featured,
  }))

  const handleSaveDream = (e: React.MouseEvent, inspiration: Inspiration) => {
    e.preventDefault()
    
    if (isDreamSaved(inspiration.id)) {
      removeDream(inspiration.id)
      setToastMessage('Removed from your dreams')
    } else {
      addDream({
        id: inspiration.id,
        title: inspiration.title,
        category: inspiration.category,
        description: inspiration.description,
        image: inspiration.icon,
        style: 'Beautiful Design',
        colorPalette: 'Premium Colors',
        tileSize: '60x60 cm',
      })
      setToastMessage('Added to your dreams!')
    }
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleShare = (e: React.MouseEvent, inspiration: Inspiration) => {
    e.preventDefault()
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/inspiration/${inspiration.id}`
    const shareText = `Check out this beautiful ${inspiration.title} design on Luxe Tiles!`

    if (navigator.share) {
      navigator.share({
        title: inspiration.title,
        text: shareText,
        url: shareUrl,
      }).catch(() => {
        copyToClipboard(shareUrl)
      })
    } else {
      copyToClipboard(shareUrl)
    }
  }
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage('Link copied to clipboard!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    })
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

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
                        </p>                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => handleSaveDream(e, inspiration)}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                              isDreamSaved(inspiration.id)
                                ? 'bg-accent text-foreground hover:bg-accent/90'
                                : 'border border-border bg-transparent text-foreground hover:bg-muted'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${isDreamSaved(inspiration.id) ? 'fill-current' : ''}`} />
                            Save
                          </button>
                          <button
                            onClick={(e) => handleShare(e, inspiration)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded text-sm font-medium bg-transparent text-foreground hover:bg-muted transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
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
              </Button>            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
