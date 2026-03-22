'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowUpRight,
  Clock,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import { useAdmin } from '@/contexts/admin-context'
import { VALIDATION } from '@/lib/constants'

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhone = (phone: string): boolean => {
  // Accept 10+ digits (flexible for international numbers)
  const phoneRegex = /^\d{10,}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

const faqs = [
  { q: 'What is your return policy?', a: 'We offer 30-day returns on all unopened products with original packaging. Custom-cut tiles are non-returnable.' },
  { q: 'Do you offer bulk discounts?', a: 'Yes! Projects over 500 sqft receive special bulk pricing. Contact us for a custom quote.' },
  { q: 'Can I see samples before ordering?', a: 'Absolutely. Visit our showroom or request samples delivered to your doorstep for ₹99 (refundable on order).' },
  { q: 'What are your delivery options?', a: 'We deliver across Gujarat within 3-5 business days. Pan-India delivery available for 7-10 days.' },
  { q: 'Do you provide installation services?', a: 'We partner with certified installers across Gujarat. Ask us for a bundled quote with materials + installation.' },
]

export default function ContactPage() {
  const { addContactMessage } = useAdmin()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [activeLocation, setActiveLocation] = useState<'showroom' | 'warehouse'>('showroom')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      message: '',
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10+ digits)'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    } else if (formData.message.length > VALIDATION.MAX_MESSAGE_LENGTH) {
      newErrors.message = `Message must not exceed ${VALIDATION.MAX_MESSAGE_LENGTH} characters`
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(err => err !== '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    addContactMessage({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
    })

    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', message: '' })

    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-foreground/[0.03] to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-foreground/[0.02] to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-16 sm:pt-24 pb-12 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-foreground/30" />
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium">Get in Touch</p>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-foreground mb-6 leading-[1.05]">
              We&apos;d love to<br />
              hear from <span className="italic text-muted-foreground/70">you</span>
            </h1>
            <p className="text-muted-foreground max-w-lg text-base sm:text-lg leading-relaxed">
              Whether you&apos;re planning a renovation or building from scratch — our experts will help you find the perfect surfaces.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== CONTACT INFO STRIP ===== */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
            {[
              {
                icon: Phone,
                label: 'Call Us',
                value: '+91 9979091885',
                sub: 'Mon – Sat, 9am – 7pm',
                href: 'tel:+919979091885',
              },
              {
                icon: Mail,
                label: 'Email Us',
                value: 'omkar_cera@gmail.com',
                sub: 'We respond within 24 hours',
                href: 'mailto:omkar_cera@gmail.com',
              },
              {
                icon: MapPin,
                label: 'Visit Us',
                value: 'Killa-pardi, Gujarat',
                sub: 'Showroom & Warehouse',
                href: 'https://www.google.com/maps/place/Omkar+ceramic+pardi/',
              },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-4 px-6 sm:px-8 py-6 group hover:bg-muted/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-foreground/[0.06] dark:bg-foreground/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/[0.1] transition-colors">
                  <item.icon className="w-5 h-5 text-foreground/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/50 transition-colors flex-shrink-0" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN: FORM + MAP ===== */}
      <section className="flex-1">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* ===== CONTACT FORM ===== */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-background" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-foreground leading-none">Send a Message</h2>
                  <p className="text-xs text-muted-foreground mt-1">We&apos;ll get back to you within 24 hours</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
                      className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5"
                    >
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </motion.div>
                    <h3 className="font-serif text-xl text-foreground mb-2">Message Sent!</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Thank you for reaching out. Our team will review your message and get back to you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full px-4 py-3.5 border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 transition-all text-sm ${
                            errors.name 
                              ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' 
                              : 'border-border/70 focus:border-foreground/40 focus:ring-foreground/10'
                          }`}
                          placeholder="Your name"
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full px-4 py-3.5 border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 transition-all text-sm ${
                            errors.phone 
                              ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' 
                              : 'border-border/70 focus:border-foreground/40 focus:ring-foreground/10'
                          }`}
                          placeholder="+91 98765 43210"
                        />
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3.5 border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 transition-all text-sm ${
                          errors.email 
                            ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' 
                            : 'border-border/70 focus:border-foreground/40 focus:ring-foreground/10'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Message *</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className={`w-full px-4 py-3.5 border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 transition-all text-sm resize-none ${
                          errors.message 
                            ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' 
                            : 'border-border/70 focus:border-foreground/40 focus:ring-foreground/10'
                        }`}
                        placeholder="Tell us about your project — what kind of tiles you're looking for, the area size, budget, or anything else..."
                      />
                      {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                      <p className="text-xs text-muted-foreground text-right">{formData.message.length}/{VALIDATION.MAX_MESSAGE_LENGTH}</p>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-13 px-6 py-3.5 bg-foreground text-background font-medium rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2.5 group text-sm"
                    >
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      Send Message
                    </button>

                    <p className="text-[11px] text-muted-foreground/50 text-center">
                      Your information is secure and will never be shared with third parties.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ===== LOCATIONS + MAP ===== */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-background" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-foreground leading-none">Our Locations</h2>
                  <p className="text-xs text-muted-foreground mt-1">Visit us in person to see our collection</p>
                </div>
              </div>

              {/* Toggle */}
              <div className="flex gap-2 mb-6 p-1 bg-muted/40 border border-border/50 rounded-xl w-fit">
                {(['showroom', 'warehouse'] as const).map(loc => (
                  <button
                    key={loc}
                    onClick={() => setActiveLocation(loc)}
                    className={`relative px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      activeLocation === loc
                        ? 'bg-foreground text-background shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {loc === 'showroom' ? '🏬 Showroom' : '🏭 Warehouse'}
                  </button>
                ))}
              </div>

              {/* Location details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLocation}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mb-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">
                      {activeLocation === 'showroom' ? 'Omkar Ceramic — Showroom' : 'Omkar Ceramic — Warehouse (Godown)'}
                    </h3>
                    <a
                      href={activeLocation === 'showroom'
                        ? 'https://www.google.com/maps/place/Omkar+ceramic+pardi/@20.5213475,72.955389,17z'
                        : 'https://www.google.com/maps/place/Omkar+ceramic+godawn/@20.5192464,72.9669686,17z'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 border border-border/60 rounded-full"
                    >
                      Directions <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {activeLocation === 'showroom'
                      ? 'Near Hotel Vishram, Jalaramnagar Society, Killa-pardi, Gujarat 396125'
                      : 'Balda Industrial Park, GIDC, Killa-pardi, Gujarat 396125'
                    }
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      Mon – Sat, 9am – 7pm
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" />
                      +91 9979091885
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Map */}
              <div className="aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden border border-border/60 bg-muted/20">
                <iframe
                  src={activeLocation === 'showroom'
                    ? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.8876619289385!2d72.95281761544746!3d20.521347486284098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0c39bfbf792c7%3A0xfb5a359d603edcac!2sOmkar%20ceramic%20pardi!5e0!3m2!1sen!2sin!4v1706547600000!5m2!1sen!2sin'
                    : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.9376619289385!2d72.96439761544746!3d20.519246486284098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0c5538815a071%3A0x99d62d131aeedaee!2sOmkar%20ceramic%20godawn!5e0!3m2!1sen!2sin!4v1706547700000!5m2!1sen!2sin'
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={activeLocation === 'showroom' ? 'Omkar Ceramic Showroom' : 'Omkar Ceramic Warehouse'}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="border-t border-border/60">
        <div className="max-w-3xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-muted-foreground/50" />
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">FAQ</p>
              <Sparkles className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
              Common <span className="italic text-muted-foreground/70">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-border/60 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group hover:bg-muted/20 transition-colors"
                >
                  <span className="font-medium text-foreground text-sm pr-4">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="border-t border-border/60 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl mb-2">Ready to start your project?</h3>
            <p className="text-background/60 text-sm sm:text-base">Visit our showroom to explore 500+ tile varieties in person.</p>
          </div>
          <a
            href="tel:+919979091885"
            className="flex items-center gap-2 px-6 py-3.5 bg-background text-foreground rounded-xl font-medium hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
