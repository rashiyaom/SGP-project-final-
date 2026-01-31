'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart()

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

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl text-muted-foreground mb-4">Your cart is empty</p>
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-lg p-6 flex gap-6 items-start"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 bg-muted/50 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image || "/placeholder.svg"} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <Link href={`/products/${item.id}`} className="hover:text-accent transition-colors">
                        <h3 className="font-semibold text-lg text-foreground mb-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground mb-1">
                        Rs. {item.price.toLocaleString()} per unit
                      </p>
                      {item.category && (
                        <p className="text-xs text-muted-foreground mb-4">
                          {item.category}
                        </p>
                      )}

                      {/* Quantity Control */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-muted/20 rounded px-3 py-2 w-fit">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="text-foreground hover:text-primary transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold text-foreground w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="text-foreground hover:text-primary transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-accent hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h2 className="font-semibold text-xl text-foreground mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax (10%)</span>
                      <span>Rs. {tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                        {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    {shipping === 0 && (
                      <p className="text-xs text-green-600 font-semibold">
                        Free shipping on orders over Rs. 100
                      </p>
                    )}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        Rs. {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold mb-3">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full border-2 border-primary text-primary hover:bg-primary/5 bg-transparent"
                  >
                    <Link href="/products">Continue Shopping</Link>
                  </Button>

                  {/* Promo Code */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Have a promo code?</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-border rounded bg-background text-foreground text-sm"
                      />
                      <Button size="sm" variant="outline" className="border-border bg-transparent">
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

      <Footer />
    </main>
  )
}
