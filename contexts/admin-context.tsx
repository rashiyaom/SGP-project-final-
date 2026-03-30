'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ===== TYPES =====
export interface Product {
  id: string
  _id?: string
  name: string
  price?: number
  pricingType: 'fixed' | 'inquire'
  originalPrice?: number
  category: 'Ceramic Tiles' | 'Marble' | 'Bathroom & Sanitary Ware' | 'Accessories'
  rating: number
  inStock: boolean
  images: string[]
  image: string
  description?: string
  filters?: Record<string, string[]>
  sku?: string
  tags?: string[]
}

export interface GalleryItem {
  id: string
  _id?: string
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
  _id?: string
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
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getProductsByCategory: (category: string) => Product[]

  // Gallery
  gallery: GalleryItem[]
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void>
  deleteGalleryItem: (id: string) => Promise<void>

  // Custom Filters (stored in sessionStorage — lightweight, non-critical)
  customFilters: CustomFilter[]
  addCustomFilter: (filter: Omit<CustomFilter, 'id'>) => Promise<void>
  updateCustomFilter: (id: string, filter: Partial<CustomFilter>) => Promise<void>
  deleteCustomFilter: (id: string) => Promise<void>
  getFiltersForCategory: (category: Product['category']) => CustomFilter[]

  // Contact Messages
  contactMessages: ContactMessage[]
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => Promise<void>
  markMessageRead: (id: string) => Promise<void>
  deleteContactMessage: (id: string) => Promise<void>

  // Admin Auth
  isAdmin: boolean
  adminLogin: (password: string) => Promise<boolean>
  adminLogout: () => Promise<void>

  // Upload
  uploadImage: (file: File, folder?: string) => Promise<string>

  // Loading states
  isLoading: boolean
  error: string | null
  refreshProducts: () => Promise<void>
  refreshMessages: () => Promise<void>
  refreshGallery: () => Promise<void>
}

const ADMIN_PASSWORD = 'admin123'
const FILTERS_STORAGE_KEY = 'admin_custom_filters'

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Helper to normalize MongoDB docs (map _id → id)
function normalizeProduct(p: any): Product {
  return { ...p, id: p._id?.toString() || p.id }
}
function normalizeGallery(g: any): GalleryItem {
  return { ...g, id: g._id?.toString() || g.id }
}
function normalizeMessage(m: any): ContactMessage {
  return {
    ...m,
    id: m._id?.toString() || m.id,
    date: m.createdAt || m.date || new Date().toISOString(),
    phone: m.phone || '',
    read: m.read ?? false,
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [customFilters, setCustomFilters] = useState<CustomFilter[]>([])
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ─── On mount: restore session + load data ───────────────────────────────
  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem('isAdminLogged') === 'true'
    if (adminLoggedIn) {
      setIsAdmin(true)
    }

    // Always load products & gallery for the public-facing site
    loadProducts()
    loadGallery()

    // Load filters from sessionStorage (lightweight, non-critical)
    const stored = sessionStorage.getItem(FILTERS_STORAGE_KEY)
    if (stored) {
      try { setCustomFilters(JSON.parse(stored)) } catch {}
    }

    // Load messages only if admin
    if (adminLoggedIn) {
      loadMessages()
    }
  }, [])

  // ─── Persist filters to sessionStorage whenever they change ───────────────
  useEffect(() => {
    sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(customFilters))
  }, [customFilters])

  // ─── PRODUCTS ─────────────────────────────────────────────────────────────
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/products?limit=200')
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts((data.data || []).map(normalizeProduct))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addProduct = async (product: Omit<Product, 'id'>) => {
    if (!product.name?.trim()) throw new Error('Product name is required')
    if (!product.category?.trim()) throw new Error('Product category is required')
    if (product.pricingType === 'fixed' && (!product.price || product.price <= 0))
      throw new Error('Product price must be greater than 0')
    if (!product.image && (!product.images || product.images.length === 0))
      throw new Error('Product must have at least one image')

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...product,
        image: product.image || product.images?.[0] || '',
        images: product.images?.length ? product.images : [product.image],
      }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to create product')
    }
    const data = await res.json()
    setProducts(prev => [normalizeProduct(data.data), ...prev])
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to update product')
    }
    const data = await res.json()
    setProducts(prev => prev.map(p => p.id === id ? normalizeProduct(data.data) : p))
  }

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to delete product')
    }
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const getProductsByCategory = (category: string) =>
    products.filter(p => p.category === category)

  const refreshProducts = loadProducts

  // ─── GALLERY ──────────────────────────────────────────────────────────────
  const loadGallery = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery?limit=200')
      if (!res.ok) return
      const data = await res.json()
      setGallery((data.data || []).map(normalizeGallery))
    } catch {}
  }, [])

  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to create gallery item')
    }
    const data = await res.json()
    setGallery(prev => [normalizeGallery(data.data), ...prev])
  }

  const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>) => {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to update gallery item')
    }
    const data = await res.json()
    setGallery(prev => prev.map(g => g.id === id ? normalizeGallery(data.data) : g))
  }

  const deleteGalleryItem = async (id: string) => {
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to delete gallery item')
    }
    setGallery(prev => prev.filter(g => g.id !== id))
  }

  const refreshGallery = loadGallery

  // ─── CUSTOM FILTERS (sessionStorage-backed) ───────────────────────────────
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5)

  const addCustomFilter = async (filter: Omit<CustomFilter, 'id'>) => {
    setCustomFilters(prev => [...prev, { ...filter, id: generateId() }])
  }

  const updateCustomFilter = async (id: string, updates: Partial<CustomFilter>) => {
    setCustomFilters(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const deleteCustomFilter = async (id: string) => {
    setCustomFilters(prev => prev.filter(f => f.id !== id))
  }

  const getFiltersForCategory = (category: Product['category']) =>
    customFilters.filter(f => f.category === category || f.category === 'all')

  // ─── MESSAGES ─────────────────────────────────────────────────────────────
  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages?limit=200')
      if (!res.ok) return
      const data = await res.json()
      setContactMessages((data.data || []).map(normalizeMessage))
    } catch {}
  }, [])

  const addContactMessage = async (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to send message')
    }
    const data = await res.json()
    setContactMessages(prev => [normalizeMessage(data.data), ...prev])
  }

  const markMessageRead = async (id: string) => {
    await fetch(`/api/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    })
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const deleteContactMessage = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: 'DELETE' })
    setContactMessages(prev => prev.filter(m => m.id !== id))
  }

  const refreshMessages = loadMessages

  // ─── IMAGE UPLOAD (Cloudinary) ────────────────────────────────────────────
  const uploadImage = async (file: File, folder = 'omkar-ceramics'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const base64 = (e.target?.result as string)?.split(',')[1]
          if (!base64) throw new Error('Failed to read file')

          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64, folder }),
          })
          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || 'Upload failed')
          }
          const data = await res.json()
          resolve(data.data.url)
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  // ─── ADMIN AUTH ───────────────────────────────────────────────────────────
  const adminLogin = async (password: string): Promise<boolean> => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      sessionStorage.setItem('isAdminLogged', 'true')
      // Load admin-only data
      await loadMessages()
      return true
    }
    return false
  }

  const adminLogout = async () => {
    setIsAdmin(false)
    sessionStorage.removeItem('isAdminLogged')
    setContactMessages([])
  }

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
      uploadImage,
      isLoading,
      error,
      refreshProducts,
      refreshMessages,
      refreshGallery,
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
