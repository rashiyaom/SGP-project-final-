'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart()

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.1
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + tax + shipping

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

<section className="flex-1 py-8">
  <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <h1 className="font-serif text-4xl text-foreground mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-24 px-4">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
              </div>
              <p className="text-3xl font-serif text-foreground mb-2">Your Cart is Empty</p>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Discover our premium collection of tiles, marble, and bathroom accessories to create your dream space.
              </p>
              <Link href="/products">
                <Button className="bg-foreground hover:bg-foreground/90 text-background h-12 px-8 text-lg font-semibold">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
                  </p>
                </div>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-card border border-border rounded-lg p-6 flex gap-6 items-start hover:border-foreground/30 hover:shadow-lg transition-all duration-300 animate-in fade-in-50 duration-300"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center text-5xl flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <Link href={`/products/${item.id}`} className="hover:text-foreground/70 transition-colors">
                        <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                        {item.category}
                      </p>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-1 py-1 w-fit border border-border/50 hover:border-foreground/20 transition-colors">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 text-foreground hover:bg-muted/50 rounded transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold text-foreground w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 text-foreground hover:bg-muted/50 rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto p-2 text-muted-foreground hover:text-red-600 hover:bg-red-600/10 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-muted-foreground mb-2">
                        ₹{item.price.toLocaleString()} each
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-gradient-to-b from-card to-card/50 border border-border rounded-xl p-6 sm:p-8 sticky top-24 shadow-lg">
                  <h2 className="font-serif text-2xl text-foreground mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Subtotal</span>
                      <span className="text-sm font-medium text-foreground">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-y border-border/30">
                      <span className="text-sm text-muted-foreground">Tax (10%)</span>
                      <span className="text-sm font-medium text-foreground">₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Shipping</span>
                      <span className={`text-sm font-medium ${shipping === 0 ? 'text-emerald-600' : 'text-foreground'}`}>
                        {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    {shipping === 0 && (
                      <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-lg px-3 py-2 mt-2">
                        <p className="text-xs text-emerald-700 dark:text-emerald-600 font-semibold">
                          🎉 Free shipping on orders over ₹100
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium text-foreground">Total Amount</span>
                      <span className="text-3xl font-bold text-foreground">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Link href="/checkout" className="block mb-3">
                    <button className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 rounded-lg text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2 group">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>

                  <Link href="/products">
                    <button className="w-full border border-border bg-transparent text-foreground hover:bg-muted/50 h-11 rounded-lg text-sm font-medium transition-colors">
                      Continue Shopping
                    </button>
                  </Link>

                  {/* Promo Code */}
                  <div className="mt-6 pt-6 border-t border-border/30">
                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block mb-3">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 border border-border/50 rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-colors"
                      />
                      <button className="px-4 py-2 border border-border/50 bg-transparent text-foreground hover:bg-muted/50 rounded-lg text-sm font-medium transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
