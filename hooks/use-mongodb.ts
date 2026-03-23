'use client'

import { useState, useCallback } from 'react'
import { Product } from '@/contexts/admin-context'
import { GalleryItem } from '@/contexts/admin-context'
import { ContactMessage } from '@/contexts/admin-context'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  total?: number
  page?: number
  pages?: number
}

/**
 * Hook for managing products via MongoDB API
 */
export function useProducts() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async (category?: string, skip = 0, limit = 20) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      params.append('skip', skip.toString())
      params.append('limit', limit.toString())

      const res = await fetch(`/api/products?${params}`)
      const data: ApiResponse<Product[]> = await res.json()

      if (!data.success) throw new Error(data.error)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getProduct = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/products/${id}`)
      const data: ApiResponse<Product> = await res.json()

      if (!data.success) throw new Error(data.error)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch product'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })
      const data: ApiResponse<Product> = await res.json()

      if (!data.success) throw new Error(data.error)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create product'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const data: ApiResponse<Product> = await res.json()

      if (!data.success) throw new Error(data.error)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      const data: ApiResponse<Product> = await res.json()

      if (!data.success) throw new Error(data.error)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  }
}

/**
 * Hook for managing gallery items via MongoDB API
 */
export function useGallery() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGallery = useCallback(async (category?: string, featured = false, skip = 0, limit = 20) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (featured) params.append('featured', 'true')
      params.append('skip', skip.toString())
      params.append('limit', limit.toString())

      const res = await fetch(`/api/gallery?${params}`)
      const data: ApiResponse<GalleryItem[]> = await res.json()

      if (!data.success) throw new Error(data.error)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch gallery'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getGalleryItem = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/gallery/${id}`)
      const data: ApiResponse<GalleryItem> = await res.json()

      if (!data.success) throw new Error(data.error)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch gallery item'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createGalleryItem = useCallback(async (item: Omit<GalleryItem, 'id'>) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      const data: ApiResponse<GalleryItem> = await res.json()

      if (!data.success) throw new Error(data.error)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create gallery item'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateGalleryItem = useCallback(async (id: string, updates: Partial<GalleryItem>) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const data: ApiResponse<GalleryItem> = await res.json()

      if (!data.success) throw new Error(data.error)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update gallery item'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteGalleryItem = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      })
      const data: ApiResponse<GalleryItem> = await res.json()

      if (!data.success) throw new Error(data.error)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete gallery item'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    fetchGallery,
    getGalleryItem,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    loading,
    error,
  }
}

/**
 * Hook for managing contact messages via MongoDB API
 */
export function useContactMessages() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async (read?: boolean, skip = 0, limit = 20) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (read !== undefined) params.append('read', read.toString())
      params.append('skip', skip.toString())
      params.append('limit', limit.toString())

      const res = await fetch(`/api/messages?${params}`)
      const data: ApiResponse<ContactMessage[]> = await res.json()

      if (!data.success) throw new Error(data.error)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch messages'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getMessage = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/messages/${id}`)
      const data: ApiResponse<ContactMessage> = await res.json()

      if (!data.success) throw new Error(data.error)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch message'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createMessage = useCallback(async (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      })
      const data: ApiResponse<ContactMessage> = await res.json()

      if (!data.success) throw new Error(data.error)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create message'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      const data: ApiResponse<ContactMessage> = await res.json()

      if (!data.success) throw new Error(data.error)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark as read'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteMessage = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      })
      const data: ApiResponse<ContactMessage> = await res.json()

      if (!data.success) throw new Error(data.error)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete message'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    fetchMessages,
    getMessage,
    createMessage,
    markAsRead,
    deleteMessage,
    loading,
    error,
  }
}

/**
 * Hook for image uploads to Cloudinary
 */
export function useCloudinaryUpload() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = useCallback(async (imageUrl: string, folder = 'omkar-ceramics') => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl, folder }),
      })
      const data = await res.json()

      if (!data.success) throw new Error(data.error)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadBase64 = useCallback(async (base64: string, folder = 'omkar-ceramics') => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, folder }),
      })
      const data = await res.json()

      if (!data.success) throw new Error(data.error)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteImage = useCallback(async (publicId: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      })
      const data = await res.json()

      if (!data.success) throw new Error(data.error)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete image'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    uploadImage,
    uploadBase64,
    deleteImage,
    loading,
    error,
  }
}
