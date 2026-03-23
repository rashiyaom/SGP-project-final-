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
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getProductsByCategory: (category: string) => Product[]

  // Gallery
  gallery: GalleryItem[]
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void>
  deleteGalleryItem: (id: string) => Promise<void>

  // Custom Filters
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
  
  // Loading states
  isLoading: boolean
  error: string | null
}

const ADMIN_PASSWORD = 'admin123'

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [customFilters, setCustomFilters] = useState<CustomFilter[]>([])
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Get user email from sessionStorage (set during login)
  useEffect(() => {
    const email = sessionStorage.getItem('userEmail')
    setUserEmail(email)
    if (email) {
      loadAdminData(email)
    }
  }, [])

  // Load admin data from MongoDB
  const loadAdminData = async (email: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/users/admin?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        const adminData = data.data || {}
        setProducts(adminData.products || [])
        setGallery(adminData.gallery || [])
        setCustomFilters(adminData.filters || [])
        setContactMessages(adminData.contactMessages || [])
      }
      setError(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load admin data'
      console.error('Error loading admin data:', err)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // Save admin data to MongoDB
  const saveAdminData = async () => {
    if (!userEmail) return

    try {
      await fetch('/api/users/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          adminData: {
            products,
            gallery,
            filters: customFilters,
            contactMessages
          }
        })
      })
      setError(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save admin data'
      console.error('Error saving admin data:', err)
      setError(errorMsg)
    }
  }

  // Auto-save whenever data changes
  useEffect(() => {
    if (userEmail && (products.length > 0 || gallery.length > 0 || customFilters.length > 0 || contactMessages.length > 0)) {
      saveAdminData()
    }
  }, [products, gallery, customFilters, contactMessages, userEmail])

  // ===== PRODUCT CRUD =====
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5)

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: generateId() }
    setProducts(prev => [...prev, newProduct])
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category)
  }

  // ===== GALLERY CRUD =====
  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = { ...item, id: generateId() }
    setGallery(prev => [...prev, newItem])
  }

  const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>) => {
    setGallery(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
  }

  const deleteGalleryItem = async (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id))
  }

  // ===== CUSTOM FILTERS CRUD =====
  const addCustomFilter = async (filter: Omit<CustomFilter, 'id'>) => {
    const newFilter: CustomFilter = { ...filter, id: generateId() }
    setCustomFilters(prev => [...prev, newFilter])
  }

  const updateCustomFilter = async (id: string, updates: Partial<CustomFilter>) => {
    setCustomFilters(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const deleteCustomFilter = async (id: string) => {
    setCustomFilters(prev => prev.filter(f => f.id !== id))
  }

  const getFiltersForCategory = (category: Product['category']) => {
    return customFilters.filter(f => f.category === category || f.category === 'all')
  }

  // ===== CONTACT MESSAGES CRUD =====
  const addContactMessage = async (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: generateId(),
      date: new Date().toISOString(),
      read: false,
    }
    setContactMessages(prev => [newMsg, ...prev])
  }

  const markMessageRead = async (id: string) => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const deleteContactMessage = async (id: string) => {
    setContactMessages(prev => prev.filter(m => m.id !== id))
  }

  // ===== ADMIN AUTH =====
  const adminLogin = async (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      return true
    }
    return false
  }

  const adminLogout = async () => {
    setIsAdmin(false)
    await saveAdminData()
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
      isLoading,
      error
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
