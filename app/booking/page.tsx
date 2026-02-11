'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Mail, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export default function BookingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    appointmentType: 'consultation',
    message: '',
  })

  // Protect booking page - require authentication
  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', '/booking')
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

<section className="flex-1 py-8">
  <div className="max-w-4xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl text-foreground mb-4">
              Book an Appointment
            </h1>
            <p className="text-lg text-muted-foreground">
              Schedule a showroom visit, design consultation, or product demo
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-xl p-8">
                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Appointment Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'consultation', label: 'Design Consultation' },
                      { value: 'showroom', label: 'Showroom Visit' },
                      { value: 'demo', label: 'Product Demo' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      >
                        <input
                          type="radio"
                          name="appointmentType"
                          value={option.value}
                          checked={formData.appointmentType === option.value}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              appointmentType: e.target.value,
                            })
                          }
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-foreground">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Name
                    </label>
                    <div className="flex items-center border border-border rounded-lg px-3 py-2">
                      <User className="w-4 h-4 text-muted-foreground mr-2" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="flex-1 bg-transparent text-foreground outline-none"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email
                    </label>
                    <div className="flex items-center border border-border rounded-lg px-3 py-2">
                      <Mail className="w-4 h-4 text-muted-foreground mr-2" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="flex-1 bg-transparent text-foreground outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Phone
                  </label>
                  <div className="flex items-center border border-border rounded-lg px-3 py-2">
                    <Phone className="w-4 h-4 text-muted-foreground mr-2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="flex-1 bg-transparent text-foreground outline-none"
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Preferred Date
                    </label>
                    <div className="flex items-center border border-border rounded-lg px-3 py-2">
                      <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="flex-1 bg-transparent text-foreground outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Preferred Time
                    </label>
                    <div className="flex items-center border border-border rounded-lg px-3 py-2">
                      <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        className="flex-1 bg-transparent text-foreground outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Additional Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Tell us about your project or specific interests..."
                  />
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold">
                  Confirm Appointment
                </Button>
              </form>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Appointment Types */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-lg text-foreground mb-4">
                  Our Services
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">
                      Design Consultation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      30-60 min with expert designer
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">
                      Showroom Visit
                    </p>
                    <p className="text-xs text-muted-foreground">
                      1-2 hours exploring products
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">
                      Product Demo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      See samples and AR visualization
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="bg-muted/20 rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3">
                  Available Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-foreground">
                    <span className="font-semibold">Monday-Friday:</span> 9am - 6pm
                  </p>
                  <p className="text-foreground">
                    <span className="font-semibold">Saturday:</span> 10am - 4pm
                  </p>
                  <p className="text-foreground">
                    <span className="font-semibold">Sunday:</span> Closed
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-4">
                  Prefer to call ahead?
                </p>
                <a
                  href="tel:+1234567890"
                  className="block text-center mb-3"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Call: +1 (234) 567-890
                  </Button>
                </a>
                <a
                  href="mailto:hello@luxetiles.com"
                  className="block text-center"
                >
                  <Button
                    variant="outline"
                    className="w-full border-2 border-primary text-primary hover:bg-primary/5 bg-transparent"
                  >
                    Email Us
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
