'use client'

import { useCart } from '@/contexts/cart-context'
import { ShoppingCart, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export function CartNotification() {
  const { items, getTotalItems } = useCart()
  const [showNotification, setShowNotification] = useState(false)
  const [lastAddedCount, setLastAddedCount] = useState(0)

  useEffect(() => {
    const currentCount = getTotalItems()
    if (currentCount > lastAddedCount) {
      setShowNotification(true)
      setLastAddedCount(currentCount)

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [items, getTotalItems, lastAddedCount])

  if (!showNotification || items.length === 0) {
    return null
  }

  const latestItem = items[items.length - 1]

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-foreground text-background rounded-lg shadow-2xl overflow-hidden max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-background/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Item Added</p>
              <p className="text-xs opacity-80">to your cart</p>
            </div>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="p-1 hover:bg-background/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex gap-4">
            <img
              src={latestItem.image}
              alt={latestItem.name}
              className="w-16 h-16 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold line-clamp-2">
                {latestItem.name}
              </h3>
              <p className="text-xs opacity-75 mt-1">
                Qty: {latestItem.quantity}
              </p>
              <p className="text-sm font-bold mt-2">
                ₹{(latestItem.price * latestItem.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-foreground/20">
          <button
            onClick={() => setShowNotification(false)}
            className="flex-1 px-4 py-2 rounded bg-background/20 hover:bg-background/30 text-background transition-colors text-sm font-medium"
          >
            Continue Shopping
          </button>
          <Link href="/cart" className="flex-1">
            <button className="w-full px-4 py-2 rounded bg-background text-foreground hover:bg-background/90 transition-colors text-sm font-medium">
              View Cart
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
