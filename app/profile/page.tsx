'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, MapPin, Heart, ShoppingBag, Package, Settings, LogOut,
  Edit3, Check, X, Camera, ChevronRight, Star, Clock, CreditCard,
  Home as HomeIcon, Truck, Shield, Bell, Eye, EyeOff, Trash2, Plus,
  ArrowLeft, Calendar, Tag
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/contexts/cart-context'
import { useDreams } from '@/contexts/dreams-context'
import dynamic from 'next/dynamic'

const ProfileCard = dynamic(() => import('@/components/profile-card'), { ssr: false })

// ─── Types ──────────────────────────────────────────────────────
interface UserProfile {
  name: string
  email: string
  phone: string
  avatar: string
  address: string
  city: string
  state: string
  pincode: string
  bio: string
  joinedDate: string
  notifications: boolean
  newsletter: boolean
}

interface Order {
  id: string
  date: string
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled'
  total: number
  items: number
  image: string
}

// ─── Tab config ──────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const

type TabId = typeof TABS[number]['id']

// ─── Mock orders ──────────────────────────────────────────────────
const MOCK_ORDERS: Order[] = [
  { id: 'ORD-2024-001', date: '2024-12-15', status: 'delivered', total: 2450, items: 3, image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=120&h=120&fit=crop' },
  { id: 'ORD-2024-002', date: '2025-01-22', status: 'shipped', total: 1890, items: 2, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=120&h=120&fit=crop' },
  { id: 'ORD-2025-003', date: '2025-02-10', status: 'processing', total: 3200, items: 5, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=120&h=120&fit=crop' },
]

// ─── Status badge ──────────────────────────────────────────────────
const statusConfig = {
  delivered: { color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', label: 'Delivered' },
  shipped: { color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', label: 'Shipped' },
  processing: { color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', label: 'Processing' },
  cancelled: { color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', label: 'Cancelled' },
}

// ─── Main Page ──────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, logout } = useAuth()
  const { items: cartItems, getTotalPrice } = useCart()
  const { dreams, removeDream } = useDreams()

  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    bio: '',
    joinedDate: new Date().toISOString(),
    notifications: true,
    newsletter: false,
  })

  const [editForm, setEditForm] = useState<UserProfile>(profile)

  // ─── Init from auth + localStorage ──────────────────────
  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) { router.push('/auth/login'); return }

    const saved = localStorage.getItem('userProfile')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setProfile(parsed)
        setEditForm(parsed)
      } catch { /* fallback below */ }
    }

    if (user) {
      setProfile(prev => {
        const updated = {
          ...prev,
          name: prev.name || user.name || '',
          email: prev.email || user.email || '',
        }
        setEditForm(updated)
        return updated
      })
    }
  }, [isAuthenticated, user, router])

  // ─── Read tab from URL query params ──────────────────────
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && TABS.some(t => t.id === tab)) {
      setActiveTab(tab as TabId)
    }
  }, [searchParams])

  // ─── Persist profile ──────────────────────
  const saveProfile = useCallback((data: UserProfile) => {
    setProfile(data)
    setEditForm(data)
    localStorage.setItem('userProfile', JSON.stringify(data))
    // Also sync name back to auth localStorage
    if (data.name) localStorage.setItem('userName', data.name)
    if (data.email) localStorage.setItem('userEmail', data.email)
  }, [])

  const handleSave = () => {
    saveProfile(editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const url = reader.result as string
      const updated = { ...editForm, avatar: url }
      setEditForm(updated)
      saveProfile(updated)
      setShowAvatarUpload(false)
    }
    reader.readAsDataURL(file)
  }

  if (!mounted || !isAuthenticated) return null

  // ─── Stats ──────────────────────
  const stats = [
    { label: 'Orders', value: MOCK_ORDERS.length, icon: Package, color: 'from-blue-500 to-blue-600' },
    { label: 'Wishlist', value: dreams.length, icon: Heart, color: 'from-rose-500 to-rose-600' },
    { label: 'Cart Items', value: cartItems.length, icon: ShoppingBag, color: 'from-amber-500 to-amber-600' },
    { label: 'Cart Value', value: `₹${getTotalPrice().toLocaleString()}`, icon: CreditCard, color: 'from-emerald-500 to-emerald-600' },
  ]

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* ─── Hero Section with ProfileCard ────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background pb-6 lg:pb-10">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-4 lg:pt-8">
          {/* Back button - mobile */}
          <button onClick={() => router.back()} className="lg:hidden flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10">
            {/* ProfileCard — left */}
            <div className="flex-shrink-0 w-full max-w-[260px] lg:max-w-[280px]">
              <ProfileCard
                avatarUrl={profile.avatar || undefined}
                name={profile.name || 'User'}
                title={profile.bio || 'Omkar Ceramic Member'}
                handle={profile.email?.split('@')[0] || 'user'}
                status={isAuthenticated ? 'Online' : 'Offline'}
                contactText="Edit"
                onContactClick={() => { setActiveTab('overview'); setIsEditing(true) }}
                showUserInfo={true}
                compact={true}
                enableTilt={true}
                innerGradient="linear-gradient(145deg, #1a1a2e 0%, #16213e44 50%, #0f3460aa 100%)"
                behindGlowColor="rgba(100, 120, 255, 0.4)"
              />
              {/* Upload avatar overlay */}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-xl py-2.5 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" /> Change Photo
              </button>
            </div>

            {/* Right — Info + Stats */}
            <div className="flex-1 w-full text-center lg:text-left">
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground mb-1">
                {profile.name || 'Welcome'}
              </h1>
              <p className="text-muted-foreground text-sm mb-1">{profile.email}</p>
              {profile.phone && <p className="text-muted-foreground text-xs mb-3"><Phone className="w-3 h-3 inline mr-1" />{profile.phone}</p>}
              {profile.city && (
                <p className="text-muted-foreground text-xs mb-4">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {[profile.city, profile.state].filter(Boolean).join(', ')}
                </p>
              )}
              <div className="flex items-center gap-2 justify-center lg:justify-start text-xs text-muted-foreground mb-5">
                <Calendar className="w-3 h-3" />
                Member since {new Date(profile.joinedDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="bg-card border border-border rounded-2xl p-3.5 text-center hover:border-foreground/10 transition-all">
                    <div className={`mx-auto w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
                      <s.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-lg font-bold text-foreground">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tabs ────────── */}
      <div className="sticky top-14 sm:top-20 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex gap-0 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 sm:px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {active && (
                    <motion.div
                      layoutId="profileTab"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-foreground rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── Tab Content ────────── */}
      <section className="flex-1 py-6 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <OverviewTab profile={profile} editForm={editForm} setEditForm={setEditForm} isEditing={isEditing} setIsEditing={setIsEditing} handleSave={handleSave} handleCancel={handleCancel} />
              </motion.div>
            )}
            {activeTab === 'wishlist' && (
              <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <WishlistTab dreams={dreams} removeDream={removeDream} />
              </motion.div>
            )}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <OrdersTab orders={MOCK_ORDERS} />
              </motion.div>
            )}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <SettingsTab profile={profile} saveProfile={saveProfile} logout={logout} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB: Overview — Editable user details
// ═══════════════════════════════════════════════════════════════════
function OverviewTab({ profile, editForm, setEditForm, isEditing, setIsEditing, handleSave, handleCancel }: {
  profile: UserProfile; editForm: UserProfile; setEditForm: React.Dispatch<React.SetStateAction<UserProfile>>
  isEditing: boolean; setIsEditing: (v: boolean) => void; handleSave: () => void; handleCancel: () => void
}) {
  const fields: { key: keyof UserProfile; label: string; icon: React.ElementType; type?: string; placeholder: string }[] = [
    { key: 'name', label: 'Full Name', icon: User, placeholder: 'Enter your name' },
    { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'your@email.com' },
    { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+91 98765 43210' },
    { key: 'bio', label: 'Bio', icon: Tag, placeholder: 'Tell us about yourself' },
    { key: 'address', label: 'Street Address', icon: HomeIcon, placeholder: '123 Main Street' },
    { key: 'city', label: 'City', icon: MapPin, placeholder: 'Mumbai' },
    { key: 'state', label: 'State', icon: MapPin, placeholder: 'Maharashtra' },
    { key: 'pincode', label: 'PIN Code', icon: MapPin, type: 'number', placeholder: '400001' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your profile details</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-xl hover:opacity-90 transition-opacity">
            <Edit3 className="w-4 h-4" /> Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={handleCancel} className="flex items-center gap-1.5 px-3.5 py-2 border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors">
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-xl hover:opacity-90 transition-opacity">
              <Check className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        )}
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => {
          const Icon = f.icon
          const value = isEditing ? (editForm[f.key] as string) : (profile[f.key] as string)
          return (
            <div key={f.key} className="group">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Icon className="w-3 h-3" /> {f.label}
              </label>
              {isEditing ? (
                <input
                  type={f.type || 'text'}
                  value={value || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all"
                />
              ) : (
                <div className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground min-h-[46px] flex items-center">
                  {value || <span className="text-muted-foreground/40">Not set</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB: Wishlist (reads from Dreams context)
// ═══════════════════════════════════════════════════════════════════
function WishlistTab({ dreams, removeDream }: { dreams: any[]; removeDream: (id: string) => void }) {
  const router = useRouter()

  if (dreams.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
          <Heart className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No saved items yet</h3>
        <p className="text-sm text-muted-foreground mb-5">Like products or save inspirations to see them here</p>
        <button onClick={() => router.push('/products')} className="px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-xl hover:opacity-90 transition-opacity">
          Browse Products
        </button>
      </div>
    )
  }

  const productItems = dreams.filter((d) => d.type === 'product')
  const inspirationItems = dreams.filter((d) => d.type !== 'product')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">My Wishlist</h2>
        <span className="text-sm text-muted-foreground">{dreams.length} item{dreams.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Product Wishlist Items */}
      {productItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Liked Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-foreground/10 transition-all"
              >
                <Link href={`/products/${item.id}`}>
                  <div className="relative h-40 sm:h-48 bg-muted overflow-hidden">
                    <img src={item.image || '/placeholder.svg'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {item.inStock === false && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">Out of Stock</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); removeDream(item.id) }}
                      className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full border border-border hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="text-sm font-semibold text-foreground mb-1 truncate hover:text-primary transition-colors">{item.title}</h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mb-2 truncate">{item.category}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-foreground">₹{item.price?.toLocaleString()}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Inspiration Wishlist Items */}
      {inspirationItems.length > 0 && (
        <div className="space-y-3">
          {productItems.length > 0 && (
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Saved Inspirations</h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inspirationItems.map((dream) => (
              <motion.div
                key={dream.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-foreground/10 transition-all"
              >
                <div className="relative h-40 sm:h-48 bg-muted overflow-hidden">
                  {dream.image ? (
                    <img src={dream.image} alt={dream.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">✨</div>
                  )}
                  <button
                    onClick={() => removeDream(dream.id)}
                    className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full border border-border hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1 truncate">{dream.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2 truncate">{dream.category}{dream.style ? ` • ${dream.style}` : ''}</p>
                  {dream.tileSize && (
                    <span className="inline-block text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{dream.tileSize}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB: Orders
// ═══════════════════════════════════════════════════════════════════
function OrdersTab({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
          <Package className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No orders yet</h3>
        <p className="text-sm text-muted-foreground">Your order history will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-foreground">Order History</h2>

      <div className="space-y-3">
        {orders.map((order) => {
          const st = statusConfig[order.status]
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:border-foreground/10 transition-all"
            >
              {/* Image */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                <img src={order.image} alt={order.id} className="w-full h-full object-cover" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-foreground">{order.id}</h4>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${st.color}`}>{st.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {order.items} item{order.items !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-base font-bold text-foreground">₹{order.total.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 text-muted-foreground hidden sm:block flex-shrink-0" />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB: Settings
// ═══════════════════════════════════════════════════════════════════
function SettingsTab({ profile, saveProfile, logout }: { profile: UserProfile; saveProfile: (d: UserProfile) => void; logout: () => void }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const toggleSetting = (key: 'notifications' | 'newsletter') => {
    saveProfile({ ...profile, [key]: !profile[key] })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold text-foreground">Settings</h2>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Get notified about orders & offers</p>
            </div>
          </div>
          <button
            onClick={() => toggleSetting('notifications')}
            className={`relative w-11 h-6 rounded-full transition-colors ${profile.notifications ? 'bg-foreground' : 'bg-muted'}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-background transition-transform ${profile.notifications ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Newsletter</p>
              <p className="text-xs text-muted-foreground">Weekly design inspiration & deals</p>
            </div>
          </div>
          <button
            onClick={() => toggleSetting('newsletter')}
            className={`relative w-11 h-6 rounded-full transition-colors ${profile.newsletter ? 'bg-foreground' : 'bg-muted'}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-background transition-transform ${profile.newsletter ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Account Security</p>
            <p className="text-xs text-muted-foreground">Password & login preferences</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Danger zone */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Danger Zone</h3>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-4 sm:p-5 bg-card border border-border rounded-2xl hover:border-foreground/10 transition-all text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <LogOut className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Log Out</p>
            <p className="text-xs text-muted-foreground">Sign out of your account</p>
          </div>
        </button>

        {/* Delete account */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-3 p-4 sm:p-5 bg-card border border-destructive/20 rounded-2xl hover:border-destructive/40 transition-all text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-destructive">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently remove your account data</p>
            </div>
          </button>
        ) : (
          <div className="p-4 sm:p-5 bg-destructive/5 border border-destructive/20 rounded-2xl space-y-3">
            <p className="text-sm text-foreground">Are you sure? This action cannot be undone.</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { localStorage.clear(); logout() }}
                className="px-4 py-2 bg-destructive text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
