'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Check, CreditCard, Truck } from 'lucide-react'
import { useState } from 'react'

export default function CheckoutPage() {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>(
    'shipping',
  )

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-6 sm:px-12">
          <h1 className="font-serif text-4xl text-foreground mb-8">Checkout</h1>

          {/* Progress Indicator */}
          <div className="flex gap-4 mb-12">
            {['Shipping', 'Payment', 'Confirmation'].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    i ===
                    ['shipping', 'payment', 'confirmation'].indexOf(step)
                      ? 'bg-primary text-primary-foreground'
                      : i <
                        ['shipping', 'payment', 'confirmation'].indexOf(step)
                      ? 'bg-accent text-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i < ['shipping', 'payment', 'confirmation'].indexOf(step) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={
                    i === ['shipping', 'payment', 'confirmation'].indexOf(step)
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground'
                  }
                >
                  {label}
                </span>
                {i < 2 && <div className="w-8 h-1 bg-border mx-2"></div>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {step === 'shipping' && (
                <div className="bg-card border border-border rounded-xl p-8">
                  <h2 className="font-serif text-2xl text-foreground mb-6">
                    Shipping Address
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Shipping Method
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                          <input
                            type="radio"
                            name="shipping"
                            defaultChecked
                            className="mr-3"
                          />
                          <span className="flex-1">
                            <span className="font-semibold text-foreground">
                              Standard Shipping
                            </span>
                            <span className="text-muted-foreground text-sm block">
                              3-5 business days - FREE
                            </span>
                          </span>
                        </label>
                        <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                          <input type="radio" name="shipping" className="mr-3" />
                          <span className="flex-1">
                            <span className="font-semibold text-foreground">
                              Express Shipping
                            </span>
                            <span className="text-muted-foreground text-sm block">
                              1-2 business days - $50
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Link href="/cart">
                        <Button variant="outline" className="border-2 border-border bg-transparent">
                          Back to Cart
                        </Button>
                      </Link>
                      <Button
                        className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => setStep('payment')}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div className="bg-card border border-border rounded-xl p-8">
                  <h2 className="font-serif text-2xl text-foreground mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {['Credit Card', 'PayPal', 'Wire Transfer'].map((method) => (
                        <button
                          key={method}
                          className="p-4 border-2 border-border rounded-lg hover:border-primary transition-colors hover:bg-primary/5"
                        >
                          <CreditCard className="w-6 h-6 mx-auto mb-2 text-foreground" />
                          <p className="text-sm font-semibold text-foreground">
                            {method}
                          </p>
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button
                        variant="outline"
                        className="border-2 border-border bg-transparent"
                        onClick={() => setStep('shipping')}
                      >
                        Back
                      </Button>
                      <Button
                        className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => setStep('confirmation')}
                      >
                        Place Order
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {step === 'confirmation' && (
                <div className="bg-card border border-accent rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="font-serif text-3xl text-foreground mb-2">
                    Order Confirmed!
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Order #123456 • Expected delivery: 5-7 business days
                  </p>
                  <p className="text-muted-foreground mb-6">
                    A confirmation email has been sent to your email address.
                  </p>
                  <Link href="/">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Return Home
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
              <h3 className="font-semibold text-lg text-foreground mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                {[
                  {
                    name: 'Marble Elegance 60x60',
                    qty: 2,
                    price: 45,
                  },
                  { name: 'Ceramic White Pearl', qty: 1, price: 32 },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <div>
                      <p className="text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.qty}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      ${(item.qty * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>$122.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>$12.20</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    $134.20
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
