'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'Marble Elegance 60x60', price: 45, quantity: 2, image: '🪨' },
    { id: '2', name: 'Ceramic White Pearl', price: 32, quantity: 1, image: '⚪' },
  ])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    )
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + tax + shipping

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

<section className="flex-1 py-6 sm:py-8 pb-32 sm:pb-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-6 sm:mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl sm:text-2xl text-muted-foreground mb-4">Your cart is empty</p>
              <Link href="/products">
                <Button className="bg-foreground hover:bg-foreground/90 text-background">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-muted/40 border border-border rounded-lg p-4 sm:p-6 flex gap-4 sm:gap-6 items-start"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0">
                      {item.image}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.id}`} className="hover:opacity-70 transition-opacity">
                        <h3 className="font-semibold text-sm sm:text-lg text-foreground mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-sm mb-3">
                        Rs. {item.price} per sqft
                      </p>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 w-fit">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="text-foreground hover:bg-muted/50 transition-colors p-1"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <span className="font-semibold text-foreground w-6 sm:w-8 text-center text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="text-foreground hover:bg-muted/50 transition-colors p-1"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-muted-foreground hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg sm:text-2xl font-bold text-foreground">
                        Rs. {(item.price * item.quantity).toFixed(0)}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Rs. {item.price} ea.</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary - Hidden on mobile, shown in sticky footer */}
              <div className="hidden lg:block">
                <div className="bg-foreground text-background rounded-lg p-6 sticky top-24">
                  <h2 className="font-semibold text-lg text-background mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-background/70 text-sm">
                      <span>Subtotal</span>
                      <span>Rs. {subtotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-background/70 text-sm">
                      <span>Tax (10%)</span>
                      <span>Rs. {tax.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-background/70 text-sm">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-300 font-semibold' : ''}>
                        {shipping === 0 ? 'FREE' : `Rs. ${shipping.toFixed(0)}`}
                      </span>
                    </div>
                    {shipping === 0 && (
                      <p className="text-xs text-green-300 font-semibold">
                        Free shipping on orders over Rs. 5000
                      </p>
                    )}
                  </div>

                  <div className="border-t border-background/20 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-background">Total</span>
                      <span className="text-2xl font-bold text-background">
                        Rs. {total.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <Link href="/checkout" className="block mb-3">
                    <Button className="w-full bg-background hover:bg-background/90 text-foreground h-12 text-sm font-semibold">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  <Link href="/products">
                    <Button
                      variant="outline"
                      className="w-full border-background/30 text-background hover:bg-background/10 bg-transparent"
                    >
                      Continue Shopping
                    </Button>
                  </Link>

                  {/* Promo Code */}
                  <div className="mt-6 pt-6 border-t border-background/20">
                    <p className="text-xs text-background/70 mb-3">Have a promo code?</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-background/30 rounded bg-background/10 text-background placeholder:text-background/50 text-sm"
                      />
                      <Button size="sm" variant="outline" className="border-background/30 bg-transparent text-background hover:bg-background/20">
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Sticky Order Summary Footer */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-foreground text-background border-t border-background/20 p-4 z-50">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-background/70 text-sm">
              <span>Subtotal: Rs. {subtotal.toFixed(0)}</span>
              <span>Tax: Rs. {tax.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-background/70">Shipping:</span>
              <span className={shipping === 0 ? 'text-green-300 font-semibold text-sm' : 'text-sm'}>
                {shipping === 0 ? 'FREE' : `Rs. ${shipping.toFixed(0)}`}
              </span>
            </div>
          </div>
          <div className="border-t border-background/20 pt-3 mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-background">Total</span>
              <span className="text-lg font-bold text-background">Rs. {total.toFixed(0)}</span>
            </div>
          </div>
          <Link href="/checkout" className="block">
            <Button className="w-full bg-background hover:bg-background/90 text-foreground font-semibold py-3">
              Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      <Footer />
    </main>
  )
}
