'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ===== TYPES =====
export interface Product {
  id: string
  name: string
  price?: number
  pricingType: 'fixed' | 'inquire' // 'fixed' = has price, 'inquire' = price varies
  originalPrice?: number
  category: 'Ceramic Tiles' | 'Marble' | 'Bathroom & Sanitary Ware' | 'Accessories'
  rating: number
  inStock: boolean
  images: string[] // Support multiple images per product
  image: string // Fallback to first image for backward compatibility
  description?: string
  filters?: Record<string, string[]>
  sku?: string
  tags?: string[]
}

export interface GalleryItem {
  id: string
  title: string
  category: string
  image: string
  description: string
  featured: boolean
  style?: string
  tileSize?: string
}

export interface CustomFilter {
  id: string
  label: string
  category: 'Ceramic Tiles' | 'Marble' | 'Bathroom & Sanitary Ware' | 'Accessories' | 'all'
  filterGroup: string
  options: { id: string; label: string }[]
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  date: string
  read: boolean
}

interface AdminContextType {
  // Products
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductsByCategory: (category: string) => Product[]

  // Gallery
  gallery: GalleryItem[]
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void
  deleteGalleryItem: (id: string) => void

  // Custom Filters
  customFilters: CustomFilter[]
  addCustomFilter: (filter: Omit<CustomFilter, 'id'>) => void
  updateCustomFilter: (id: string, filter: Partial<CustomFilter>) => void
  deleteCustomFilter: (id: string) => void
  getFiltersForCategory: (category: Product['category']) => CustomFilter[]

  // Contact Messages
  contactMessages: ContactMessage[]
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => void
  markMessageRead: (id: string) => void
  deleteContactMessage: (id: string) => void

  // Admin Auth
  isAdmin: boolean
  adminLogin: (password: string) => boolean
  adminLogout: () => void
}

// ===== DEFAULT DATA =====
const defaultProducts: Product[] = [
  // Ceramic Tiles
  { id: '1', name: 'Ceramic White Pearl 60x60', pricingType: 'fixed', price: 1200, category: 'Ceramic Tiles', rating: 4.9, inStock: true, images: ['https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=600&auto=format&fit=crop', description: 'Premium white ceramic tile with pearl finish' },
  { id: '2', name: 'Minimal Design Tile 45x45', pricingType: 'fixed', price: 1000, category: 'Ceramic Tiles', rating: 4.6, inStock: true, images: ['https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=600&auto=format&fit=crop', description: 'Clean minimal design for modern spaces' },
  { id: '3', name: 'Slate Blue Gray 60x60', pricingType: 'fixed', price: 1800, category: 'Ceramic Tiles', rating: 4.8, inStock: true, images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop', description: 'Elegant slate blue-gray ceramic tile' },
  { id: '4', name: 'Cement Pattern Tile', pricingType: 'fixed', price: 1100, category: 'Ceramic Tiles', rating: 4.6, inStock: true, images: ['https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop', description: 'Modern cement pattern tile' },
  { id: '5', name: 'Terracotta Rustic 30x30', pricingType: 'fixed', price: 950, originalPrice: 1200, category: 'Ceramic Tiles', rating: 4.5, inStock: true, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop', description: 'Warm terracotta rustic tile' },
  { id: '6', name: 'Hexagon Mosaic White', pricingType: 'fixed', price: 1400, category: 'Ceramic Tiles', rating: 4.7, inStock: true, images: ['https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop', description: 'Beautiful hexagonal mosaic pattern' },
  
  // Marble
  { id: '7', name: 'Marble Elegance 60x60', pricingType: 'fixed', price: 2500, originalPrice: 3000, category: 'Marble', rating: 4.8, inStock: true, images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop', description: 'Elegant marble with natural veining' },
  { id: '8', name: 'Cream Travertine 80x80', pricingType: 'fixed', price: 2200, originalPrice: 2600, category: 'Marble', rating: 4.7, inStock: true, images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop', description: 'Premium cream travertine marble' },
  { id: '9', name: 'Polished Quartz White', pricingType: 'fixed', price: 3200, originalPrice: 4000, category: 'Marble', rating: 4.9, inStock: true, images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop', description: 'Ultra-polished white quartz' },
  { id: '10', name: 'Thassos White Premium', pricingType: 'fixed', price: 3500, category: 'Marble', rating: 4.8, inStock: true, images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop', description: 'Thassos premium white marble' },
  { id: '11', name: 'Black Marquina Marble', pricingType: 'fixed', price: 4200, category: 'Marble', rating: 4.9, inStock: true, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop', description: 'Luxurious black Marquina marble' },
  { id: '12', name: 'Calacatta Gold Slab', pricingType: 'inquire', originalPrice: 6500, category: 'Marble', rating: 5.0, inStock: false, images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600&auto=format&fit=crop', description: 'Premium Calacatta gold slab' },
  
  // Bathroom & Sanitary Ware
  { id: '13', name: 'Designer Wash Basin', pricingType: 'fixed', price: 8500, originalPrice: 10000, category: 'Bathroom & Sanitary Ware', rating: 4.7, inStock: true, images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop', description: 'Modern designer wash basin' },
  { id: '14', name: 'Chrome Designer Faucet', pricingType: 'fixed', price: 3200, originalPrice: 4200, category: 'Bathroom & Sanitary Ware', rating: 4.7, inStock: true, images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600&auto=format&fit=crop', description: 'Premium chrome faucet' },
  { id: '15', name: 'Wall Mounted Toilet', pricingType: 'fixed', price: 12000, category: 'Bathroom & Sanitary Ware', rating: 4.8, inStock: true, images: ['https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=600&auto=format&fit=crop', description: 'Sleek wall-mounted toilet' },
  { id: '16', name: 'Rainfall Shower Set', pricingType: 'fixed', price: 7500, originalPrice: 9000, category: 'Bathroom & Sanitary Ware', rating: 4.6, inStock: true, images: ['https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop', description: 'Luxury rainfall shower set' },
  { id: '17', name: 'Freestanding Bathtub', pricingType: 'inquire', category: 'Bathroom & Sanitary Ware', rating: 4.9, inStock: false, images: ['https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=600&auto=format&fit=crop', description: 'Elegant freestanding bathtub' },
  { id: '18', name: 'Vanity Mirror Cabinet', pricingType: 'fixed', price: 6800, category: 'Bathroom & Sanitary Ware', rating: 4.5, inStock: true, images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600&auto=format&fit=crop', description: 'Premium vanity mirror cabinet' },
  
  // Accessories
  { id: '19', name: 'Glass Mosaic Border', pricingType: 'fixed', price: 2000, category: 'Accessories', rating: 4.9, inStock: true, images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop', description: 'Decorative glass mosaic border' },
  { id: '20', name: 'Black Matte Trim', pricingType: 'fixed', price: 2800, category: 'Accessories', rating: 4.8, inStock: true, images: ['https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop', description: 'Modern black matte trim' },
  { id: '21', name: 'Stainless Towel Rail', pricingType: 'fixed', price: 1500, category: 'Accessories', rating: 4.6, inStock: true, images: ['https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=600&auto=format&fit=crop', description: 'Stainless steel towel rail' },
  { id: '22', name: 'Brass Soap Dispenser', pricingType: 'fixed', price: 1200, originalPrice: 1500, category: 'Accessories', rating: 4.7, inStock: true, images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop', description: 'Elegant brass soap dispenser' },
  { id: '23', name: 'Chrome Robe Hook Set', pricingType: 'fixed', price: 800, category: 'Accessories', rating: 4.5, inStock: true, images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop', description: 'Chrome robe hook set' },
  { id: '24', name: 'Premium Tile Grout', pricingType: 'fixed', price: 450, category: 'Accessories', rating: 4.4, inStock: true, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop', description: 'High-quality premium tile grout' },
]

const defaultGallery: GalleryItem[] = [
  { id: '1', title: 'Modern Bathroom', category: 'Bathroom', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1200&auto=format&fit=crop', description: 'Sleek white marble tiles create a spa-like atmosphere', featured: true },
  { id: '2', title: 'Kitchen Elegance', category: 'Kitchen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200&auto=format&fit=crop', description: 'Premium granite counters with coordinating backsplash', featured: false },
  { id: '3', title: 'Living Room Luxury', category: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop', description: 'Large format tiles create continuity in modern living spaces', featured: true },
  { id: '4', title: 'Bedroom Serenity', category: 'Bedroom', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop', description: 'Warm terracotta tiles bring natural comfort to bedrooms', featured: false },
  { id: '5', title: 'Entryway Statement', category: 'Entryway', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop', description: 'Bold geometric patterns make a striking first impression', featured: true },
  { id: '6', title: 'Outdoor Oasis', category: 'Outdoor', image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop', description: 'Weather-resistant tiles perfect for patios and pools', featured: false },
  { id: '7', title: 'Commercial Space', category: 'Commercial', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop', description: 'Durable tiles for high-traffic commercial environments', featured: false },
  { id: '8', title: 'Accent Walls', category: 'Accent', image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1200&auto=format&fit=crop', description: 'Feature walls with unique tile patterns and textures', featured: true },
]

// ===== DEFAULT FILTERS (seeded from existing website filters) =====
const defaultFilters: CustomFilter[] = [
  // Ceramic Tiles filters
  { id: 'f-ceramic-type', label: 'Type', category: 'Ceramic Tiles', filterGroup: 'ceramicTypes', options: [
    { id: 'floor', label: 'Floor Tiles' }, { id: 'wall', label: 'Wall Tiles' }, { id: 'bathroom', label: 'Bathroom Tiles' }, { id: 'kitchen', label: 'Kitchen Tiles' },
  ]},
  { id: 'f-ceramic-finish', label: 'Finish', category: 'Ceramic Tiles', filterGroup: 'ceramicFinishes', options: [
    { id: 'polished', label: 'Polished' }, { id: 'matte', label: 'Matte' }, { id: 'glossy', label: 'Glossy' }, { id: 'textured', label: 'Textured' }, { id: 'rustic', label: 'Rustic' },
  ]},
  { id: 'f-ceramic-size', label: 'Size', category: 'Ceramic Tiles', filterGroup: 'ceramicSizes', options: [
    { id: '30x30', label: '30x30 cm' }, { id: '45x45', label: '45x45 cm' }, { id: '60x60', label: '60x60 cm' }, { id: '75x75', label: '75x75 cm' }, { id: '30x60', label: '30x60 cm (Subway)' },
  ]},
  { id: 'f-ceramic-usage', label: 'Usage', category: 'Ceramic Tiles', filterGroup: 'ceramicUsages', options: [
    { id: 'floor', label: 'Floor Only' }, { id: 'wall', label: 'Wall Only' }, { id: 'both', label: 'Floor & Wall' },
  ]},
  // Marble filters
  { id: 'f-marble-type', label: 'Type', category: 'Marble', filterGroup: 'marbleTypes', options: [
    { id: 'white', label: 'White Marble' }, { id: 'black', label: 'Black Marble' }, { id: 'grey', label: 'Grey/Beige Marble' }, { id: 'colored', label: 'Colored Marble' }, { id: 'patterned', label: 'Patterned Marble' },
  ]},
  { id: 'f-marble-finish', label: 'Finish', category: 'Marble', filterGroup: 'marbleFinishes', options: [
    { id: 'polished', label: 'Polished' }, { id: 'honed', label: 'Honed' }, { id: 'brushed', label: 'Brushed' }, { id: 'tumbled', label: 'Tumbled' }, { id: 'flamed', label: 'Flamed' },
  ]},
  { id: 'f-marble-size', label: 'Size', category: 'Marble', filterGroup: 'marbleSizes', options: [
    { id: '30x30', label: '30x30 cm' }, { id: '60x60', label: '60x60 cm' }, { id: '120x120', label: '120x120 cm' }, { id: '30x60', label: '30x60 cm' }, { id: 'custom', label: 'Custom Size' },
  ]},
  { id: 'f-marble-origin', label: 'Origin', category: 'Marble', filterGroup: 'marbleOrigins', options: [
    { id: 'italian', label: 'Italian' }, { id: 'spanish', label: 'Spanish' }, { id: 'indian', label: 'Indian' }, { id: 'portuguese', label: 'Portuguese' }, { id: 'turkish', label: 'Turkish' },
  ]},
  // Bathroom & Sanitary Ware filters
  { id: 'f-sanitary-type', label: 'Type', category: 'Bathroom & Sanitary Ware', filterGroup: 'sanitaryTypes', options: [
    { id: 'washbasin', label: 'Wash Basins / Sinks' }, { id: 'toilet', label: 'Toilets' }, { id: 'bathtub', label: 'Bathtubs' }, { id: 'shower', label: 'Shower Trays' }, { id: 'bidet', label: 'Bidets' },
  ]},
  { id: 'f-sanitary-material', label: 'Material', category: 'Bathroom & Sanitary Ware', filterGroup: 'sanitaryMaterials', options: [
    { id: 'ceramic', label: 'Ceramic' }, { id: 'porcelain', label: 'Porcelain' }, { id: 'glass', label: 'Glass' }, { id: 'steel', label: 'Stainless Steel' }, { id: 'acrylic', label: 'Acrylic' },
  ]},
  { id: 'f-sanitary-style', label: 'Style', category: 'Bathroom & Sanitary Ware', filterGroup: 'sanitaryStyles', options: [
    { id: 'modern', label: 'Modern' }, { id: 'classic', label: 'Classic' }, { id: 'contemporary', label: 'Contemporary' }, { id: 'minimalist', label: 'Minimalist' }, { id: 'vintage', label: 'Vintage' },
  ]},
  // Accessories filters
  { id: 'f-acc-type', label: 'Type', category: 'Accessories', filterGroup: 'accessoriesTypes', options: [
    { id: 'trim', label: 'Tile Trim & Border' }, { id: 'grout', label: 'Grout & Adhesives' }, { id: 'handles', label: 'Handles & Knobs' }, { id: 'hardware', label: 'Bathroom Hardware' }, { id: 'decos', label: 'Decorative Elements' },
  ]},
  { id: 'f-acc-material', label: 'Material', category: 'Accessories', filterGroup: 'accessoriesMaterials', options: [
    { id: 'stainless', label: 'Stainless Steel' }, { id: 'ceramic', label: 'Ceramic' }, { id: 'brass', label: 'Brass' }, { id: 'wood', label: 'Wood' }, { id: 'plastic', label: 'Plastic/Resin' },
  ]},
  { id: 'f-acc-color', label: 'Color', category: 'Accessories', filterGroup: 'accessoriesColors', options: [
    { id: 'silver', label: 'Silver/Chrome' }, { id: 'gold', label: 'Gold/Brass' }, { id: 'black', label: 'Matte Black' }, { id: 'white', label: 'White' }, { id: 'wood', label: 'Natural Wood' },
  ]},
  { id: 'f-acc-finish', label: 'Finish', category: 'Accessories', filterGroup: 'accessoriesFinishes', options: [
    { id: 'matte', label: 'Matte' }, { id: 'glossy', label: 'Glossy' }, { id: 'brushed', label: 'Brushed' }, { id: 'polished', label: 'Polished' },
  ]},
]

const ADMIN_PASSWORD = 'admin123'

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery)
  const [customFilters, setCustomFilters] = useState<CustomFilter[]>(defaultFilters)
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('admin_products')
      const savedGallery = localStorage.getItem('admin_gallery')
      const savedFilters = localStorage.getItem('admin_customFilters')
      const savedAdmin = localStorage.getItem('admin_isAdmin')

      if (savedProducts) setProducts(JSON.parse(savedProducts))
      if (savedGallery) setGallery(JSON.parse(savedGallery))
      if (savedFilters) {
        const parsed = JSON.parse(savedFilters)
        // If previously saved as empty array, use defaults instead
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomFilters(parsed)
        }
      }
      if (savedAdmin === 'true') setIsAdmin(true)
      const savedMessages = localStorage.getItem('admin_contactMessages')
      if (savedMessages) setContactMessages(JSON.parse(savedMessages))
      setLoadError(null)
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to load admin data'
      console.error('Error loading admin data:', e)
      setLoadError(errorMsg)
      // Fall back to defaults on error
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on change (with size limit and batching)
  useEffect(() => {
    if (!isLoaded) return
    try {
      const productsJson = JSON.stringify(products)
      if (productsJson.length > 4500000) {
        console.warn('Products data exceeds 4.5MB. Consider database migration.')
      }
      localStorage.setItem('admin_products', productsJson)
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded for products')
      }
    }
  }, [products, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    try {
      const galleryJson = JSON.stringify(gallery)
      if (galleryJson.length > 4500000) {
        console.warn('Gallery data exceeds 4.5MB. Consider database migration.')
      }
      localStorage.setItem('admin_gallery', galleryJson)
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded for gallery')
      }
    }
  }, [gallery, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    try {
      const filtersJson = JSON.stringify(customFilters)
      localStorage.setItem('admin_customFilters', filtersJson)
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded for filters')
      }
    }
  }, [customFilters, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    try {
      const messagesJson = JSON.stringify(contactMessages)
      localStorage.setItem('admin_contactMessages', messagesJson)
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded for messages. Keeping last 100.')
        const recent = contactMessages.slice(-100)
        localStorage.setItem('admin_contactMessages', JSON.stringify(recent))
      }
    }
  }, [contactMessages, isLoaded])

  // ===== PRODUCT CRUD =====
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5)

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: generateId() }
    setProducts(prev => [...prev, newProduct])
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  const getProductsByCategory = useCallback((category: string) => {
    return products.filter(p => p.category === category)
  }, [products])

  // ===== GALLERY CRUD =====
  const addGalleryItem = useCallback((item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = { ...item, id: generateId() }
    setGallery(prev => [...prev, newItem])
  }, [])

  const updateGalleryItem = useCallback((id: string, updates: Partial<GalleryItem>) => {
    setGallery(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
  }, [])

  const deleteGalleryItem = useCallback((id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id))
  }, [])

  // ===== CUSTOM FILTERS CRUD =====
  const addCustomFilter = useCallback((filter: Omit<CustomFilter, 'id'>) => {
    const newFilter: CustomFilter = { ...filter, id: generateId() }
    setCustomFilters(prev => [...prev, newFilter])
  }, [])

  const updateCustomFilter = useCallback((id: string, updates: Partial<CustomFilter>) => {
    setCustomFilters(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
  }, [])

  const deleteCustomFilter = useCallback((id: string) => {
    setCustomFilters(prev => prev.filter(f => f.id !== id))
  }, [])

  const getFiltersForCategory = useCallback((category: Product['category']) => {
    return customFilters.filter(f => f.category === category || f.category === 'all')
  }, [customFilters])

  // ===== CONTACT MESSAGES CRUD =====
  const addContactMessage = useCallback((msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: generateId(),
      date: new Date().toISOString(),
      read: false,
    }
    setContactMessages(prev => [newMsg, ...prev])
  }, [])

  const markMessageRead = useCallback((id: string) => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }, [])

  const deleteContactMessage = useCallback((id: string) => {
    setContactMessages(prev => prev.filter(m => m.id !== id))
  }, [])

  // ===== ADMIN AUTH =====
  const adminLogin = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      localStorage.setItem('admin_isAdmin', 'true')
      return true
    }
    return false
  }, [])

  const adminLogout = useCallback(() => {
    setIsAdmin(false)
    localStorage.removeItem('admin_isAdmin')
  }, [])

  return (
    <AdminContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsByCategory,
      gallery,
      addGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      customFilters,
      addCustomFilter,
      updateCustomFilter,
      deleteCustomFilter,
      getFiltersForCategory,
      contactMessages,
      addContactMessage,
      markMessageRead,
      deleteContactMessage,
      isAdmin,
      adminLogin,
      adminLogout,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
