'use client'

import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'
import { ShoppingCart, ArrowRight } from 'lucide-react'

export function CartSummary() {
  const { items, getTotalItems, getTotalPrice } = useCart()
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const tax = totalPrice * 0.1
  const shipping = totalPrice > 100 ? 0 : 15
  const total = totalPrice + tax + shipping

  if (totalItems === 0) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm">
      <div className="bg-card border border-border rounded-xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-background" />
          </div>
          <h3 className="font-semibold text-foreground">
            Cart ({totalItems})
          </h3>
        </div>

        <div className="space-y-2 text-sm mb-4 pb-4 border-b border-border/30">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span>₹{Math.round(tax).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-between items-baseline mb-4">
          <span className="text-sm font-medium text-foreground">Total</span>
          <span className="text-lg font-bold text-foreground">
            ₹{Math.round(total).toLocaleString()}
          </span>
        </div>

        <Link href="/cart" className="block">
          <button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-lg font-medium py-2 transition-colors flex items-center justify-center gap-2 text-sm">
            View Cart
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  )
}
