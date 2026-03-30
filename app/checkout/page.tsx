'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Check, CreditCard, Truck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/contexts/cart-context'

interface ShippingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentData {
  method: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { items: cartItems, getTotalPrice, clearCart } = useCart()
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [isLoading, setIsLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const [shippingData, setShippingData] = useState<ShippingData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })

  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  // Protect checkout page - require authentication
  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', '/checkout')
      router.push('/admin/login')
    }
  }, [isAuthenticated, router])

  const handleShippingChange = (field: keyof ShippingData, value: string) => {
    setShippingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateShipping = (): boolean => {
    const { firstName, lastName, email, phone, address, city, state, zipCode, country } = shippingData
    return !!(firstName && lastName && email && phone && address && city && state && zipCode && country)
  }

  const handlePlaceOrder = async () => {
    if (!validateShipping()) {
      alert('Please fill in all shipping details')
      return
    }

    setIsLoading(true)

    try {
      const totalAmount = getTotalPrice()
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email || shippingData.email,
          userId: user?._id || 'guest',
          items: cartItems,
          shippingAddress: shippingData,
          paymentMethod: paymentData.method,
          totalAmount
        })
      })

      if (res.ok) {
        const { data } = await res.json()
        setOrderId(data._id)
        
        // Clear cart after successful order
        await clearCart()
        
        setStep('confirmation')
      } else {
        alert('Failed to place order. Please try again.')
      }
    } catch (error) {
      console.error('Order error:', error)
      alert('Error placing order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
                          value={shippingData.firstName}
                          onChange={(e) => handleShippingChange('firstName', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={shippingData.lastName}
                          onChange={(e) => handleShippingChange('lastName', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={shippingData.email}
                          onChange={(e) => handleShippingChange('email', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={shippingData.phone}
                          onChange={(e) => handleShippingChange('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={shippingData.address}
                        onChange={(e) => handleShippingChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={shippingData.city}
                          onChange={(e) => handleShippingChange('city', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={shippingData.state}
                          onChange={(e) => handleShippingChange('state', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          value={shippingData.zipCode}
                          onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={shippingData.country}
                          onChange={(e) => handleShippingChange('country', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        />
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
                      {['credit_card', 'upi', 'net_banking'].map((method) => (
                        <button
                          key={method}
                          onClick={() => setPaymentData(prev => ({ ...prev, method }))}
                          className={`p-4 border-2 rounded-lg transition-colors ${
                            paymentData.method === method
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary hover:bg-primary/5'
                          }`}
                        >
                          <CreditCard className="w-6 h-6 mx-auto mb-2 text-foreground" />
                          <p className="text-sm font-semibold text-foreground">
                            {method === 'credit_card' ? 'Credit Card' : method === 'upi' ? 'UPI' : 'Net Banking'}
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
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
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
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
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
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
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
                        className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                        onClick={handlePlaceOrder}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Placing Order...' : 'Place Order'}
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
                  {orderId && (
                    <p className="text-muted-foreground mb-4">
                      Order #{orderId.slice(-6).toUpperCase()} • Expected delivery: 5-7 business days
                    </p>
                  )}
                  <p className="text-muted-foreground mb-6">
                    A confirmation email has been sent to {shippingData.email}
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
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="text-sm text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">
                        ₹{(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No items in cart</p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>₹{Math.round(getTotalPrice() * 0.1).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{Math.round(getTotalPrice() * 1.1).toLocaleString()}
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
