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
const defaultProducts: Product[] = []

const defaultGallery: GalleryItem[] = []

// ===== DEFAULT FILTERS (seeded from existing website filters) =====
const defaultFilters: CustomFilter[] = []

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
