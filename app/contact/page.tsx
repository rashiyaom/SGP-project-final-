'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Mail, Phone, MapPin, Send, ArrowUpRight } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [activeLocation, setActiveLocation] = useState('showroom')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12">
          {/* Page Header */}
          <div className="mb-16">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Contact</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
              Get in <span className="italic">Touch</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Have questions? Our expert team is ready to help you find the perfect tiles for your project.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <div className="p-6 border-b sm:border-b-0 sm:border-r border-border">
              <Phone className="w-5 h-5 text-foreground mb-4" />
              <h3 className="font-medium text-foreground mb-2">Phone</h3>
              <a href="tel:+919979091885" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                +91 9979091885
              </a>
              <p className="text-xs text-muted-foreground mt-1">Mon - Sat, 9am - 7pm</p>
            </div>
            <div className="p-6 border-b sm:border-b-0 sm:border-r border-border">
              <Mail className="w-5 h-5 text-foreground mb-4" />
              <h3 className="font-medium text-foreground mb-2">Email</h3>
              <a href="mailto:omkar_cera@gmail.com" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                omkar_cera@gmail.com
              </a>
              <p className="text-xs text-muted-foreground mt-1">We respond within 24 hours</p>
            </div>
            <div className="p-6">
              <MapPin className="w-5 h-5 text-foreground mb-4" />
              <h3 className="font-medium text-foreground mb-2">Location</h3>
              <p className="text-muted-foreground text-sm">Killa-pardi, Gujarat 396125</p>
              <p className="text-xs text-muted-foreground mt-1">Showroom & Warehouse</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-2xl text-foreground mb-8">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Locations */}
            <div>
              <h2 className="font-serif text-2xl text-foreground mb-6">Our Location</h2>
              
              {/* Toggle Buttons */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveLocation('showroom')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeLocation === 'showroom' 
                      ? 'bg-foreground text-background' 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Showroom
                </button>
                <button
                  onClick={() => setActiveLocation('warehouse')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeLocation === 'warehouse' 
                      ? 'bg-foreground text-background' 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Warehouse
                </button>
              </div>

              {/* Location Details */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-foreground">
                    {activeLocation === 'showroom' ? 'Showroom' : 'Warehouse (Godown)'}
                  </h3>
                  <a 
                    href={activeLocation === 'showroom' 
                      ? "https://www.google.com/maps/place/Omkar+ceramic+pardi/@20.5213475,72.955389,17z"
                      : "https://www.google.com/maps/place/Omkar+ceramic+godawn/@20.5192464,72.9669686,17z"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    Open in Maps <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activeLocation === 'showroom' 
                    ? 'Near Hotel Vishram, Jalaramnagar Society, Killa-pardi, Gujarat 396125'
                    : 'Balda Industrial Park, GIDC, Killa-pardi, Gujarat 396125'
                  }
                </p>
              </div>

              {/* Map */}
              <div className="aspect-video rounded-lg overflow-hidden border border-border">
                <iframe
                  src={activeLocation === 'showroom'
                    ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.8876619289385!2d72.95281761544746!3d20.521347486284098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0c39bfbf792c7%3A0xfb5a359d603edcac!2sOmkar%20ceramic%20pardi!5e0!3m2!1sen!2sin!4v1706547600000!5m2!1sen!2sin"
                    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.9376619289385!2d72.96439761544746!3d20.519246486284098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0c5538815a071%3A0x99d62d131aeedaee!2sOmkar%20ceramic%20godawn!5e0!3m2!1sen!2sin!4v1706547700000!5m2!1sen!2sin"
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={activeLocation === 'showroom' ? "Omkar Ceramic Showroom" : "Omkar Ceramic Warehouse"}
                />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24 border-t border-border pt-16">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="font-serif text-3xl text-foreground mb-12">
              Common <span className="italic">Questions</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { q: 'What is your return policy?', a: 'We offer 30-day returns on all unopened products with original packaging.' },
                { q: 'Do you offer bulk discounts?', a: 'Yes! Projects over 500 sqft receive special bulk pricing. Contact us for details.' },
                { q: 'Can I see samples before ordering?', a: 'Absolutely. Visit our showroom or request samples to see them in your space.' },
                { q: 'What are your delivery options?', a: 'We deliver across Gujarat. Standard delivery is 3-5 business days.' },
              ].map((item, i) => (
                <div key={i} className="border-b border-border pb-6">
                  <h4 className="font-medium text-foreground mb-2">{item.q}</h4>
                  <p className="text-muted-foreground text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
