'use client'

import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/contexts/cart-context'
import { useEffect } from 'react'

interface AddToCartButtonProps {
  productId: string
  productName: string
  price: number
  image: string
  category: string
  originalPrice?: number
  quantity: number
  variant?: 'default' | 'minimal'
}

export function AddToCartButton({
  productId,
  productName,
  price,
  image,
  category,
  originalPrice,
  quantity,
  variant = 'default',
}: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      addToCart(
        {
          id: productId,
          name: productName,
          price,
          image,
          category,
          originalPrice,
        },
        quantity,
      )
      setIsAdding(false)
      setIsAdded(true)

      // Reset the "added" state after 2 seconds
      setTimeout(() => {
        setIsAdded(false)
      }, 2000)
    }, 300)
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={(e) => {
          e.preventDefault()
          handleAddToCart()
        }}
        disabled={isAdding || isAdded}
        className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300 disabled:opacity-50"
      >
        {isAdded ? (
          <Check className="w-4 h-4" />
        ) : (
          <ShoppingCart className="w-4 h-4" />
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || isAdded}
      className="relative overflow-hidden group flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-foreground/90"
    >
      {/* Animated background on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {isAdded ? (
          <>
            <Check className="w-4 h-4 animate-in zoom-in-50 duration-300" />
            <span>Added to Cart</span>
          </>
        ) : isAdding ? (
          <>
            <div className="w-4 h-4 border-2 border-transparent border-t-background border-r-background rounded-full animate-spin" />
            <span>Adding...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            <span>ADD TO CART</span>
            <span className="ml-2 text-sm">₹{(price * quantity).toLocaleString()}</span>
          </>
        )}
      </div>
    </button>
  )
}
