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
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
  isLoading: boolean
  error: string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Load cart from MongoDB on mount
  useEffect(() => {
    const email = sessionStorage.getItem('userEmail')
    setUserEmail(email)
    if (email) {
      loadCart(email)
    }
  }, [])

  const loadCart = async (email: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/users/cart?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.data || [])
      }
      setError(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load cart'
      console.error('Error loading cart:', err)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const saveCart = async (cartItems: CartItem[]) => {
    if (!userEmail) return

    try {
      await fetch('/api/users/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          cart: cartItems
        })
      })
      setError(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save cart'
      console.error('Error saving cart:', err)
      setError(errorMsg)
    }
  }

  const addItem = async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    if (!item.id || !item.name || item.price < 0) {
      console.error('Invalid item data:', item)
      return
    }

    const quantity = Math.max(1, Math.min(999, Math.floor(item.quantity || 1)))

    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      let newItems: CartItem[]
      
      if (existingItem) {
        const newQuantity = Math.min(999, existingItem.quantity + quantity)
        newItems = prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: newQuantity }
            : i
        )
      } else {
        newItems = [...prevItems, { ...item, quantity } as CartItem]
      }
      
      saveCart(newItems)
      return newItems
    })
  }

  const removeItem = async (id: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== id)
      saveCart(newItems)
      return newItems
    })
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1 || quantity > 999) {
      console.error('Quantity must be between 1 and 999')
      return
    }

    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.floor(quantity) }
          : item
      )
      saveCart(newItems)
      return newItems
    })
  }

  const clearCart = async () => {
    setItems([])
    if (userEmail) {
      try {
        await fetch(`/api/users/cart?email=${encodeURIComponent(userEmail)}`, {
          method: 'DELETE'
        })
      } catch (err) {
        console.error('Error clearing cart:', err)
      }
    }
  }

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isLoading,
      error
    }}>
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
