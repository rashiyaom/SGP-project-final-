'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
      setLoadError(null)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load cart'
      console.error('Error loading cart:', error)
      setLoadError(errorMsg)
      setItems([])
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        const cartJson = JSON.stringify(items)
        // Warn if approaching limit
        if (cartJson.length > 4500000) {
          console.warn('Cart data exceeds 4.5MB. Consider using backend storage.')
        }
        localStorage.setItem('cart', cartJson)
      } catch (error) {
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded. Clearing old cart items.')
          // Keep only last 50 items
          const recentItems = items.slice(-50)
          localStorage.setItem('cart', JSON.stringify(recentItems))
        }
      }
    }
  }, [items, isLoaded])

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    // Validate item data
    if (!item.id || !item.name || item.price < 0) {
      console.error('Invalid item data:', item)
      return
    }

    // Validate quantity
    const quantity = Math.max(1, Math.min(999, Math.floor(item.quantity || 1)))

    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        // Update quantity if item already exists (but don't exceed 999 total)
        const newQuantity = Math.min(999, existingItem.quantity + quantity)
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: newQuantity }
            : i
        )
      }
      // Add new item
      return [...prevItems, { ...item, quantity } as CartItem]
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    // Validate quantity: must be between 1 and 999
    const validQuantity = Math.max(1, Math.min(999, Math.floor(quantity)))
    
    if (validQuantity !== quantity) {
      console.warn(`Quantity adjusted to valid range: ${quantity} → ${validQuantity}`)
    }

    if (validQuantity <= 0) {
      removeItem(id)
      return
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: validQuantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
