'use client'

import { use, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Toast } from '@/components/toast'
import Link from 'next/link'
import { Heart, Share2, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useDreams } from '@/contexts/dreams-context'

// Related products for each category
const relatedProductsByCategory: Record<string, Array<{ id: string; name: string; price: number; image: string; category: string }>> = {
  'Bathroom': [
    { id: '13', name: 'Designer Wash Basin', price: 8500, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop', category: 'Bathroom & Sanitary Ware' },
    { id: '14', name: 'Chrome Designer Faucet', price: 3200, image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600&auto=format&fit=crop', category: 'Bathroom & Sanitary Ware' },
    { id: '15', name: 'Wall Mounted Toilet', price: 12000, image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=600&auto=format&fit=crop', category: 'Bathroom & Sanitary Ware' },
    { id: '16', name: 'Rainfall Shower Set', price: 7500, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop', category: 'Bathroom & Sanitary Ware' },
  ],
  'Kitchen': [
    { id: '1', name: 'Ceramic White Pearl 60x60', price: 1200, image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '3', name: 'Slate Blue Gray 60x60', price: 1800, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '7', name: 'Marble Elegance 60x60', price: 2500, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '9', name: 'Polished Quartz White', price: 3200, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
  ],
  'Living Room': [
    { id: '7', name: 'Marble Elegance 60x60', price: 2500, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '10', name: 'Thassos White Premium', price: 3500, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '4', name: 'Cement Pattern Tile', price: 1100, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '6', name: 'Hexagon Mosaic White', price: 1400, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
  ],
  'Bedroom': [
    { id: '5', name: 'Terracotta Rustic 30x30', price: 950, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '2', name: 'Minimal Design Tile 45x45', price: 1000, image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '8', name: 'Cream Travertine 80x80', price: 2200, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '11', name: 'Black Marquina Marble', price: 4200, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
  ],
  'Entryway': [
    { id: '1', name: 'Ceramic White Pearl 60x60', price: 1200, image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '6', name: 'Hexagon Mosaic White', price: 1400, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '11', name: 'Black Marquina Marble', price: 4200, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '19', name: 'Glass Mosaic Border', price: 2000, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop', category: 'Accessories' },
  ],
  'Outdoor': [
    { id: '6', name: 'Hexagon Mosaic White', price: 1400, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '3', name: 'Slate Blue Gray 60x60', price: 1800, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '8', name: 'Cream Travertine 80x80', price: 2200, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '10', name: 'Thassos White Premium', price: 3500, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
  ],
  'Commercial': [
    { id: '1', name: 'Ceramic White Pearl 60x60', price: 1200, image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '3', name: 'Slate Blue Gray 60x60', price: 1800, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '7', name: 'Marble Elegance 60x60', price: 2500, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '9', name: 'Polished Quartz White', price: 3200, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
  ],
  'Accent': [
    { id: '19', name: 'Glass Mosaic Border', price: 2000, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop', category: 'Accessories' },
    { id: '20', name: 'Black Matte Trim', price: 2800, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop', category: 'Accessories' },
    { id: '11', name: 'Black Marquina Marble', price: 4200, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '1', name: 'Ceramic White Pearl 60x60', price: 1200, image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
  ],
}

// Unique related products for each inspiration
const uniqueRelatedProductsPerInspiration: Record<string, Array<{ id: string; name: string; price: number; image: string; category: string }>> = {
  '1': [ // Modern Bathroom
    { id: '7', name: 'Marble Elegance 60x60', price: 2500, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '9', name: 'Polished Quartz White', price: 3200, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '13', name: 'Designer Wash Basin', price: 8500, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop', category: 'Bathroom & Sanitary Ware' },
  ],
  '2': [ // Kitchen Elegance
    { id: '1', name: 'Ceramic White Pearl 60x60', price: 1200, image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '7', name: 'Marble Elegance 60x60', price: 2500, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '3', name: 'Slate Blue Gray 60x60', price: 1800, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
  ],
  '3': [ // Living Room Luxury
    { id: '10', name: 'Thassos White Premium', price: 3500, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '8', name: 'Cream Travertine 80x80', price: 2200, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '6', name: 'Hexagon Mosaic White', price: 1400, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
  ],
  '4': [ // Bedroom Serenity
    { id: '5', name: 'Terracotta Rustic 30x30', price: 950, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '2', name: 'Minimal Design Tile 45x45', price: 1000, image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '11', name: 'Black Marquina Marble', price: 4200, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
  ],
  '5': [ // Entryway Statement
    { id: '4', name: 'Cement Pattern Tile', price: 1100, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '19', name: 'Glass Mosaic Border', price: 2000, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop', category: 'Accessories' },
    { id: '11', name: 'Black Marquina Marble', price: 4200, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
  ],
  '6': [ // Outdoor Oasis
    { id: '3', name: 'Slate Blue Gray 60x60', price: 1800, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '6', name: 'Hexagon Mosaic White', price: 1400, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '10', name: 'Thassos White Premium', price: 3500, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
  ],
  '7': [ // Commercial Space
    { id: '1', name: 'Ceramic White Pearl 60x60', price: 1200, image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
    { id: '8', name: 'Cream Travertine 80x80', price: 2200, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
    { id: '7', name: 'Marble Elegance 60x60', price: 2500, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop', category: 'Marble' },
  ],
  '8': [ // Accent Walls
    { id: '20', name: 'Black Matte Trim', price: 2800, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop', category: 'Accessories' },
    { id: '19', name: 'Glass Mosaic Border', price: 2000, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop', category: 'Accessories' },
    { id: '4', name: 'Cement Pattern Tile', price: 1100, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop', category: 'Ceramic Tiles' },
  ],
}

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
  const { isDreamSaved, addDream, removeDream } = useDreams()
  const [showSaveToast, setShowSaveToast] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'info'>('success')

  const isSaved = isDreamSaved(id)
  const relatedProducts = uniqueRelatedProductsPerInspiration[id] || []

  const handleSaveDream = () => {
    if (isSaved) {
      removeDream(id)
      setToastMessage('Removed from your dreams')
    } else {
      addDream({
        id,
        title: inspiration.title,
        category: inspiration.category,
        description: inspiration.description,
        image: inspiration.image,
        style: inspiration.style,
        colorPalette: inspiration.colorPalette,
        tileSize: inspiration.tileSize,
      })
      setToastMessage('Added to your dreams!')
    }
    setToastType('success')
    setShowSaveToast(true)
    setTimeout(() => setShowSaveToast(false), 3000)
  }

  const handleShare = async () => {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/inspiration/${id}`
    const shareText = `Check out this beautiful ${inspiration.title} design on Luxe Tiles!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: inspiration.title,
          text: shareText,
          url: shareUrl,
        })
        setToastMessage('Shared successfully!')
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(shareUrl)
        }
      }
    } else {
      copyToClipboard(shareUrl)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage('Link copied to clipboard!')
      setToastType('info')
      setShowShareToast(true)
      setTimeout(() => setShowShareToast(false), 3000)
    })
  }
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      {showSaveToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowSaveToast(false)}
        />
      )}

      {showShareToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowShareToast(false)}
        />
      )}

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
                    <Link
                      key={i}
                      href={`/products/${relatedProducts[i]?.id || '1'}`}
                    >
                      <div className="p-3 bg-card border border-border rounded-lg hover:border-accent transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Rs. {product.price}
                            </p>
                          </div>
                          <span className="text-primary group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
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
                <button 
                  onClick={handleSaveDream}
                  className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-semibold transition-colors ${
                    isSaved
                      ? 'bg-accent text-foreground hover:bg-accent/90'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved to Dreams' : 'Save to Dreams'}
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-primary text-primary hover:bg-primary/5 rounded-lg font-semibold transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>

              {/* Similar Products */}
              <div className="bg-muted/10 rounded-lg p-4">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Similar Products
                </p>
                <div className="space-y-2">
                  {relatedProducts.slice(0, 3).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                    >
                      <div className="p-2 bg-card border border-border rounded hover:border-accent transition-colors cursor-pointer group">
                        <p className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rs. {product.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
