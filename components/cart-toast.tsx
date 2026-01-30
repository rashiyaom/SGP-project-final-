'use client'

import { useEffect, useState } from 'react'
import { Check, ShoppingCart } from 'lucide-react'

interface CartToastProps {
  show: boolean
  itemName: string
  itemImage: string
  quantity: number
  onClose: () => void
}

export function CartToast({
  show,
  itemName,
  itemImage,
  quantity,
  onClose,
}: CartToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-top-2 fade-in-0 duration-300">
      <div className="bg-foreground text-background rounded-lg shadow-xl overflow-hidden backdrop-blur-sm border border-foreground/20">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-background/20 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
              <Check className="w-5 h-5" />
            </div>
            <div className="absolute inset-0 rounded-full border border-white/30 animate-ping" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Added to cart!</p>
            <p className="text-xs opacity-75 truncate">{itemName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
