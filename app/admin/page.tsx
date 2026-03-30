'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Image as ImageIcon,
  Filter,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Search,
  Package,
  Eye,
  Star,
  ChevronDown,
  LayoutDashboard,
  Lock,
  ArrowLeft,
  Layers,
  Gem,
  Bath,
  Wrench,
  TrendingUp,
  AlertCircle,
  Tag,
  Grid3X3,
  BarChart3,
  ArrowUpRight,
  MessageSquare,
  Mail,
  Phone,
  Download,
  List,
} from 'lucide-react'
import { useAdmin, type Product, type GalleryItem, type CustomFilter, type ContactMessage } from '@/contexts/admin-context'
import FullscreenProductForm from '@/components/admin-product-form'
import AdminProductListView from '@/components/admin-product-list-view'
import { exportProductsToExcel } from '@/lib/excel-export'
import Link from 'next/link'

// ===== ADMIN LOGIN =====
function AdminLogin({ onLogin }: { onLogin: (password: string) => Promise<boolean> | boolean }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await Promise.resolve(onLogin(password))
    if (!success) {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setError(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-background" />
          </div>
          <h1 className="font-serif text-3xl text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Enter your password to continue</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full h-12 px-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              autoFocus
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              Incorrect password. Try again.
            </motion.p>
          )}
          <button
            type="submit"
            className="w-full h-12 bg-foreground text-background font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Access Dashboard
          </button>
        </motion.form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Default password: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">admin123</code>
        </p>

        <Link href="/" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </Link>
      </motion.div>
    </div>
  )
}

// ===== CATEGORY HELPERS =====
const categories = [
  { id: 'Ceramic Tiles', label: 'Ceramic Tiles', shortLabel: 'Ceramic', color: 'from-blue-500 to-cyan-500', icon: Layers, bgLight: 'bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400', borderColor: 'border-blue-500/20' },
  { id: 'Marble', label: 'Marble', shortLabel: 'Marble', color: 'from-amber-500 to-orange-500', icon: Gem, bgLight: 'bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400', borderColor: 'border-amber-500/20' },
  { id: 'Bathroom & Sanitary Ware', label: 'Bathroom & Sanitary', shortLabel: 'Sanitary', color: 'from-emerald-500 to-teal-500', icon: Bath, bgLight: 'bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400', borderColor: 'border-emerald-500/20' },
  { id: 'Accessories', label: 'Accessories', shortLabel: 'Accessories', color: 'from-purple-500 to-pink-500', icon: Wrench, bgLight: 'bg-purple-500/10', textColor: 'text-purple-600 dark:text-purple-400', borderColor: 'border-purple-500/20' },
] as const

type CategoryId = typeof categories[number]['id']

// ===== PRODUCT FORM MODAL =====
function ProductFormModal({
  product,
  onSave,
  onClose,
}: {
  product?: Product
  onSave: (data: Omit<Product, 'id'>) => void
  onClose: () => void
}) {
  const { customFilters } = useAdmin()
  const [form, setForm] = useState({
    name: product?.name || '',
    pricingType: (product?.pricingType || 'fixed') as 'fixed' | 'inquire',
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    category: (product?.category || 'Ceramic Tiles') as Product['category'],
    rating: product?.rating || 4.5,
    inStock: product?.inStock ?? true,
    image: product?.image || '',
    images: product?.images || [],
    description: product?.description || '',
    filters: product?.filters || {} as Record<string, string[]>,
  })

  // Get filters relevant to the selected category
  const categoryFilters = customFilters.filter(
    f => f.category === form.category || f.category === 'all'
  )

  const toggleFilterOption = (filterGroup: string, optionId: string) => {
    setForm(prev => {
      const current = prev.filters[filterGroup] || []
      const next = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId]
      return {
        ...prev,
        filters: { ...prev.filters, [filterGroup]: next },
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // ✅ Validate required fields
    if (!form.name || form.name.trim() === '') {
      alert('❌ Product name is required')
      return
    }
    if (form.pricingType === 'fixed' && (!form.price || form.price <= 0)) {
      alert('❌ Product price must be greater than 0')
      return
    }
    if (!form.image) {
      alert('❌ Product image is required')
      return
    }
    
    onSave({
      ...form,
      pricingType: form.pricingType,
      images: form.image ? [form.image] : [],
      originalPrice: form.originalPrice || undefined,
    })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="font-serif text-xl text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Product Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="e.g., Marble Elegance 60x60"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Product['category'] })}
              className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 appearance-none"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Price (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="1200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Original Price (₹)</label>
              <input
                type="number"
                min={0}
                value={form.originalPrice || ''}
                onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="1500 (optional)"
              />
            </div>
          </div>

          {/* Rating & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Rating</label>
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">In Stock</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, inStock: !form.inStock })}
                className={`w-full h-11 px-4 rounded-xl text-sm font-medium border transition-all ${
                  form.inStock
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                }`}
              >
                {form.inStock ? '✓ In Stock' : '✕ Out of Stock'}
              </button>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Image URL *</label>
            <input
              type="url"
              required
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="https://images.unsplash.com/..."
            />
            {form.image && (
              <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full h-24 px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
              placeholder="Brief product description..."
            />
          </div>

          {/* Filter Tags — auto-populated by category */}
          {categoryFilters.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Classify Product <span className="text-muted-foreground font-normal">({form.category} filters)</span>
              </label>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                {categoryFilters.map(filter => (
                  <div key={filter.id} className="bg-muted/30 border border-border/50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{filter.label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {filter.options.map(opt => {
                        const isSelected = (form.filters[filter.filterGroup] || []).includes(opt.id)
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleFilterOption(filter.filterGroup, opt.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              isSelected
                                ? 'bg-foreground text-background border-foreground'
                                : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
                            }`}
                          >
                            {isSelected && <span className="mr-1">✓</span>}
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border border-border rounded-xl text-foreground font-medium text-sm hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 bg-foreground text-background rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
            >
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ===== GALLERY FORM MODAL =====
function GalleryFormModal({
  item,
  onSave,
  onClose,
}: {
  item?: GalleryItem
  onSave: (data: Omit<GalleryItem, 'id'>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    title: item?.title || '',
    category: item?.category || '',
    image: item?.image || '',
    description: item?.description || '',
    featured: item?.featured ?? false,
  })

  const galleryCategories = ['Bathroom', 'Kitchen', 'Living Room', 'Bedroom', 'Entryway', 'Outdoor', 'Commercial', 'Accent']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="font-serif text-xl text-foreground">
            {item ? 'Edit Gallery Item' : 'Add Gallery Item'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="e.g., Modern Bathroom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Category *</label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 appearance-none"
            >
              <option value="">Select category...</option>
              {galleryCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Image URL *</label>
            <input
              type="url"
              required
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="https://images.unsplash.com/..."
            />
            {form.image && (
              <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden border border-border">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full h-24 px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
              placeholder="Brief description..."
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`h-11 px-5 rounded-xl text-sm font-medium border transition-all ${
                form.featured
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'bg-muted/50 border-border text-muted-foreground'
              }`}
            >
              {form.featured ? '★ Featured' : '☆ Mark as Featured'}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border border-border rounded-xl text-foreground font-medium text-sm hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 bg-foreground text-background rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
            >
              {item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ===== FILTER FORM MODAL =====
function FilterFormModal({
  filter,
  onSave,
  onClose,
}: {
  filter?: CustomFilter
  onSave: (data: Omit<CustomFilter, 'id'>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    label: filter?.label || '',
    category: (filter?.category || 'all') as CustomFilter['category'],
    filterGroup: filter?.filterGroup || '',
    options: filter?.options || [{ id: '', label: '' }],
  })

  const addOption = () => {
    setForm({ ...form, options: [...form.options, { id: '', label: '' }] })
  }

  const removeOption = (index: number) => {
    setForm({ ...form, options: form.options.filter((_, i) => i !== index) })
  }

  const updateOption = (index: number, field: 'id' | 'label', value: string) => {
    const newOptions = [...form.options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    // Auto-generate id from label
    if (field === 'label') {
      newOptions[index].id = value.toLowerCase().replace(/[^a-z0-9]/g, '-')
    }
    setForm({ ...form, options: newOptions })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...form,
      options: form.options.filter(o => o.label.trim() !== ''),
    })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="font-serif text-xl text-foreground">
            {filter ? 'Edit Custom Filter' : 'Add Custom Filter'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Filter Name *</label>
            <input
              type="text"
              required
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="e.g., Surface Finish"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Apply to Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as CustomFilter['category'] })}
              className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Filter Group ID *</label>
            <input
              type="text"
              required
              value={form.filterGroup}
              onChange={(e) => setForm({ ...form, filterGroup: e.target.value })}
              className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="e.g., surfaceFinish"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Filter Options</label>
            <div className="space-y-2">
              {form.options.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => updateOption(index, 'label', e.target.value)}
                    className="flex-1 h-10 px-3 bg-muted/50 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder={`Option ${index + 1}`}
                  />
                  {form.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Option
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border border-border rounded-xl text-foreground font-medium text-sm hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 bg-foreground text-background rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
            >
              {filter ? 'Save Changes' : 'Add Filter'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ===== DELETE CONFIRM =====
function DeleteConfirm({
  title,
  onConfirm,
  onClose,
}: {
  title: string
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl"
      >
        <h3 className="font-serif text-lg text-foreground mb-2">Delete Confirmation</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <strong className="text-foreground">{title}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 border border-border rounded-xl text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 h-10 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ===== SIDEBAR TABS =====
type Tab = 'dashboard' | 'ceramic' | 'marble' | 'sanitary' | 'accessories' | 'gallery' | 'filters' | 'messages'

const tabs: { id: Tab; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { id: 'ceramic', label: 'Ceramic Tiles', shortLabel: 'Ceramic', icon: Layers },
  { id: 'marble', label: 'Marble', shortLabel: 'Marble', icon: Gem },
  { id: 'sanitary', label: 'Bathroom & Sanitary', shortLabel: 'Sanitary', icon: Bath },
  { id: 'accessories', label: 'Accessories', shortLabel: 'Accessories', icon: Wrench },
  { id: 'gallery', label: 'Gallery', shortLabel: 'Gallery', icon: ImageIcon },
  { id: 'filters', label: 'Filters', shortLabel: 'Filters', icon: Filter },
  { id: 'messages', label: 'Messages', shortLabel: 'Msgs', icon: MessageSquare },
]

const tabToCategoryMap: Record<string, string> = {
  ceramic: 'Ceramic Tiles',
  marble: 'Marble',
  sanitary: 'Bathroom & Sanitary Ware',
  accessories: 'Accessories',
}

const categoryToTabMap: Record<string, Tab> = {
  'Ceramic Tiles': 'ceramic',
  'Marble': 'marble',
  'Bathroom & Sanitary Ware': 'sanitary',
  'Accessories': 'accessories',
}

// ===== MAIN ADMIN DASHBOARD =====
export default function AdminPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    customFilters,
    addCustomFilter,
    updateCustomFilter,
    deleteCustomFilter,
    contactMessages,
    markMessageRead,
    deleteContactMessage,
    isAdmin,
    adminLogin,
    adminLogout,
    refreshMessages,
  } = useAdmin()

  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Modals
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [showGalleryForm, setShowGalleryForm] = useState(false)
  const [editingGallery, setEditingGallery] = useState<GalleryItem | undefined>()
  const [showFilterForm, setShowFilterForm] = useState(false)
  const [editingFilter, setEditingFilter] = useState<CustomFilter | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; title: string } | null>(null)

  if (!isAdmin) {
    return <AdminLogin onLogin={adminLogin} />
  }

  // ===== HELPERS =====
  const isCategoryTab = ['ceramic', 'marble', 'sanitary', 'accessories'].includes(activeTab)
  const currentCategoryName = tabToCategoryMap[activeTab] || ''
  const currentCategoryMeta = categories.find(c => c.id === currentCategoryName)

  const getCategoryProducts = (catName: string) =>
    products.filter(p => p.category === catName)

  const getCategoryFilters = (catName: string) =>
    customFilters.filter(f => f.category === catName || f.category === 'all')

  // Current tab's products (for category views)
  const currentProducts = isCategoryTab
    ? getCategoryProducts(currentCategoryName).filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  // Gallery filtered
  const filteredGallery = gallery.filter(g =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Modals */}
      <AnimatePresence>
        {showProductForm && (
          <FullscreenProductForm
            product={editingProduct}
            onSave={(data) => {
              try {
                if (editingProduct) {
                  updateProduct(editingProduct.id, data)
                } else {
                  addProduct(data)
                }
                setEditingProduct(undefined)
                setShowProductForm(false)
              } catch (err) {
                // ✅ FIXED: Show validation error to user
                const errorMsg = err instanceof Error ? err.message : 'Failed to add product'
                alert('Error: ' + errorMsg)
              }
            }}
            onClose={() => {
              setShowProductForm(false)
              setEditingProduct(undefined)
            }}
          />
        )}
        {showGalleryForm && (
          <GalleryFormModal
            item={editingGallery}
            onSave={(data) => {
              if (editingGallery) {
                updateGalleryItem(editingGallery.id, data)
              } else {
                addGalleryItem(data)
              }
              setEditingGallery(undefined)
            }}
            onClose={() => {
              setShowGalleryForm(false)
              setEditingGallery(undefined)
            }}
          />
        )}
        {showFilterForm && (
          <FilterFormModal
            filter={editingFilter}
            onSave={(data) => {
              if (editingFilter) {
                updateCustomFilter(editingFilter.id, data)
              } else {
                addCustomFilter(data)
              }
              setEditingFilter(undefined)
            }}
            onClose={() => {
              setShowFilterForm(false)
              setEditingFilter(undefined)
            }}
          />
        )}
        {deleteTarget && (
          <DeleteConfirm
            title={deleteTarget.title}
            onConfirm={() => {
              if (deleteTarget.type === 'product') deleteProduct(deleteTarget.id)
              else if (deleteTarget.type === 'gallery') deleteGalleryItem(deleteTarget.id)
              else if (deleteTarget.type === 'filter') deleteCustomFilter(deleteTarget.id)
              else if (deleteTarget.type === 'message') deleteContactMessage(deleteTarget.id)
            }}
            onClose={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-foreground rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-none">Admin Dashboard</h1>
              <p className="text-[11px] text-muted-foreground">Omkar Ceramic</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 h-9 px-4 border border-border rounded-full text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Site
            </Link>
            <button
              onClick={() => {
                adminLogout()
                router.push('/')
              }}
              className="flex items-center gap-2 h-9 px-4 bg-red-500/10 border border-red-500/20 rounded-full text-sm text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - scrollable on mobile */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0.5 overflow-x-auto py-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id
              const isCatTab = ['ceramic', 'marble', 'sanitary', 'accessories'].includes(tab.id)
              const catMeta = isCatTab ? categories.find(c => c.id === tabToCategoryMap[tab.id]) : null
              const count = isCatTab ? getCategoryProducts(tabToCategoryMap[tab.id]).length : 0
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSearchQuery('')
                    if (tab.id === 'messages') refreshMessages()
                  }}
                  className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-foreground text-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{tab.label}</span>
                  <span className="lg:hidden">{tab.shortLabel}</span>
                  {isCatTab && count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                    }`}>
                      {count}
                    </span>
                  )}
                  {tab.id === 'messages' && contactMessages.filter(m => !m.read).length > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-red-400 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {contactMessages.filter(m => !m.read).length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ============================================== */}
        {/* ===== DASHBOARD TAB - Overview of everything ===== */}
        {/* ============================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Dashboard Header with Export */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl text-foreground mb-1">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Complete overview of your products and inventory</p>
              </div>
              <button
                onClick={() => {
                  exportProductsToExcel({
                    products: products,
                    categoryName: 'All Products',
                  })
                }}
                className="flex items-center gap-2 h-11 px-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export All Products
              </button>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-foreground">{products.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Total Products</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-foreground">{gallery.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Gallery Items</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-foreground">{customFilters.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Filter Groups</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                onClick={() => { setActiveTab('messages'); setSearchQuery('') }}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5 cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-foreground">{contactMessages.length}</p>
                  {contactMessages.filter(m => !m.read).length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                      {contactMessages.filter(m => !m.read).length} new
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Messages</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mb-3">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-foreground">{products.filter(p => !p.inStock).length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Out of Stock</p>
              </motion.div>
            </div>

            {/* Category Cards — click to go to category */}
            <div>
              <h2 className="font-serif text-lg text-foreground mb-4">Product Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat, i) => {
                  const catProducts = getCategoryProducts(cat.id)
                  const inStock = catProducts.filter(p => p.inStock).length
                  const outOfStock = catProducts.filter(p => !p.inStock).length
                  const avgPrice = catProducts.length > 0
                    ? Math.round(catProducts.reduce((s, p) => s + (p.price || 0), 0) / catProducts.length)
                    : 0
                  const catFilters = getCategoryFilters(cat.id)

                  return (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      onClick={() => {
                        setActiveTab(categoryToTabMap[cat.id])
                        setSearchQuery('')
                      }}
                      className="bg-card border border-border rounded-2xl p-5 text-left hover:shadow-lg hover:border-foreground/20 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                          <cat.icon className="w-6 h-6 text-white" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{cat.label}</h3>
                      <p className="text-xs text-muted-foreground mb-4">{catProducts.length} products · {catFilters.length} filters</p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-muted/50 rounded-lg py-2">
                          <p className="text-sm font-bold text-foreground">{inStock}</p>
                          <p className="text-[10px] text-muted-foreground">In Stock</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg py-2">
                          <p className="text-sm font-bold text-foreground">{outOfStock}</p>
                          <p className="text-[10px] text-muted-foreground">Out</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg py-2">
                          <p className="text-sm font-bold text-foreground">₹{avgPrice > 999 ? `${(avgPrice / 1000).toFixed(1)}k` : avgPrice}</p>
                          <p className="text-[10px] text-muted-foreground">Avg</p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Recently added products */}
            <div>
              <h2 className="font-serif text-lg text-foreground mb-4">Recent Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {products.slice(-6).reverse().map(product => {
                  const catMeta = categories.find(c => c.id === product.category)
                  return (
                    <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden group">
                      <div className="relative aspect-square bg-muted/30 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-2.5">
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{catMeta?.shortLabel}</p>
                        <h4 className="text-xs font-medium text-foreground line-clamp-1 mt-0.5">{product.name}</h4>
                        <p className="text-xs font-bold text-foreground mt-1">₹{(product.price || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* ===== CATEGORY VIEWS (Ceramic / Marble / Sanitary / Accessories) ===== */}
        {/* ============================================== */}
        {isCategoryTab && currentCategoryMeta && (
          <div className="space-y-6">
            {/* Category Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentCategoryMeta.color} flex items-center justify-center`}>
                  <currentCategoryMeta.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-foreground">{currentCategoryMeta.label}</h2>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryProducts(currentCategoryName).length} products · {getCategoryFilters(currentCategoryName).filter(f => f.category === currentCategoryName).length} filters
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                </div>
                <button
                  onClick={() => {
                    exportProductsToExcel({
                      products: getCategoryProducts(currentCategoryName),
                      categoryName: currentCategoryMeta.label,
                    })
                  }}
                  className="h-10 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(undefined)
                    setShowProductForm(true)
                  }}
                  className={`h-10 px-4 bg-gradient-to-r ${currentCategoryMeta.color} text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap shadow-sm`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Product</span>
                </button>
              </div>
            </div>

            {/* Category Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(() => {
                const catProds = getCategoryProducts(currentCategoryName)
                const inStock = catProds.filter(p => p.inStock).length
                const outOfStock = catProds.filter(p => !p.inStock).length
                const avgRating = catProds.length > 0
                  ? (catProds.reduce((s, p) => s + p.rating, 0) / catProds.length).toFixed(1)
                  : '0'
                const totalValue = catProds.reduce((s, p) => s + (p.price || 0), 0)
                return [
                  { label: 'Total Products', value: catProds.length, icon: Package },
                  { label: 'In Stock', value: inStock, icon: Check },
                  { label: 'Out of Stock', value: outOfStock, icon: AlertCircle },
                  { label: 'Avg Rating', value: avgRating, icon: Star },
                ].map(stat => (
                  <div key={stat.label} className={`${currentCategoryMeta.bgLight} border ${currentCategoryMeta.borderColor} rounded-xl p-3.5`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <stat.icon className={`w-4 h-4 ${currentCategoryMeta.textColor}`} />
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                ))
              })()}
            </div>

            {/* Category Filters Quick View */}
            {(() => {
              const catFilters = customFilters.filter(f => f.category === currentCategoryName)
              if (catFilters.length === 0) return null
              return (
                <div className={`${currentCategoryMeta.bgLight} border ${currentCategoryMeta.borderColor} rounded-2xl p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Tag className={`w-4 h-4 ${currentCategoryMeta.textColor}`} />
                      <h3 className="font-medium text-foreground text-sm">Active Filters</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('filters')}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      Manage <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {catFilters.map(filter => (
                      <div key={filter.id} className="bg-background/60 rounded-xl px-3 py-2 border border-border/50">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{filter.label}</p>
                        <div className="flex flex-wrap gap-1">
                          {filter.options.map(opt => (
                            <span key={opt.id} className="px-2 py-0.5 bg-muted/70 rounded text-[10px] text-foreground">{opt.label}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* Products Grid/List View */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground text-sm">
                  {searchQuery ? `Search results (${currentProducts.length})` : `All ${currentCategoryMeta.shortLabel} Products`}
                </h3>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted-foreground">{currentProducts.length} items</p>
                  <div className="flex items-center gap-1 bg-muted/50 border border-border rounded-lg p-0.5">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      title="Grid view"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded transition-colors ${
                        viewMode === 'list'
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      title="List view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {currentProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow"
                      >
                        <div className="relative aspect-square bg-muted/30 overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            product.inStock ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </div>
                          {product.originalPrice && (
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                              -{Math.round(((product.originalPrice! - (product.price || 0)) / (product.originalPrice || 1)) * 100)}%
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => { setEditingProduct(product); setShowProductForm(true) }}
                              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                            >
                              <Pencil className="w-4 h-4 text-gray-800" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'product', id: product.id, title: product.name })}
                              className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-foreground text-sm mb-1.5 line-clamp-1">{product.name}</h3>
                          {product.filters && Object.values(product.filters).flat().length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {Object.values(product.filters).flat().slice(0, 3).map((tag, i) => (
                                <span key={i} className="px-1.5 py-0.5 bg-muted/70 rounded text-[9px] text-muted-foreground">{tag}</span>
                              ))}
                              {Object.values(product.filters).flat().length > 3 && (
                                <span className="px-1.5 py-0.5 bg-muted/70 rounded text-[9px] text-muted-foreground">
                                  +{Object.values(product.filters).flat().length - 3}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-bold text-foreground">₹{product.price?.toLocaleString('en-IN') || '0'}</span>
                              {product.originalPrice && (
                                <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-medium text-foreground">{product.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {currentProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">No products found</p>
                      <button
                        onClick={() => { setEditingProduct(undefined); setShowProductForm(true) }}
                        className="text-sm text-foreground underline underline-offset-4 hover:no-underline"
                      >
                        Add your first {currentCategoryMeta.shortLabel} product
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <AdminProductListView
                  products={currentProducts}
                  searchQuery={searchQuery}
                  categoryMeta={{
                    color: currentCategoryMeta.color,
                    bgLight: currentCategoryMeta.bgLight,
                    textColor: currentCategoryMeta.textColor,
                    borderColor: currentCategoryMeta.borderColor,
                  }}
                  onEdit={(product) => {
                    setEditingProduct(product)
                    setShowProductForm(true)
                  }}
                  onDelete={(id, name) => {
                    setDeleteTarget({ type: 'product', id, title: name })
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* ===== GALLERY TAB ===== */}
        {/* ============================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-foreground">Gallery</h2>
                <p className="text-sm text-muted-foreground">{gallery.length} inspiration images</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search gallery..."
                    className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                </div>
                <button
                  onClick={() => { setEditingGallery(undefined); setShowGalleryForm(true) }}
                  className="h-10 px-4 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Item</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredGallery.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-52 bg-muted/30 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {item.featured && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-white text-[10px] font-bold uppercase tracking-wider">
                          ★ Featured
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => { setEditingGallery(item); setShowGalleryForm(true) }}
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                          <Pencil className="w-4 h-4 text-gray-800" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: 'gallery', id: item.id, title: item.title })}
                          className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.category}</p>
                      <h3 className="font-medium text-foreground text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredGallery.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No gallery items found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* ===== FILTERS TAB ===== */}
        {/* ============================================== */}
        {activeTab === 'filters' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-foreground">Filters</h2>
                <p className="text-sm text-muted-foreground">{customFilters.length} filter groups across all categories</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search filters..."
                    className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                </div>
                <button
                  onClick={() => { setEditingFilter(undefined); setShowFilterForm(true) }}
                  className="h-10 px-4 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Filter</span>
                </button>
              </div>
            </div>

            {/* Category-wise filter groups */}
            {categories.map(cat => {
              const catFilters = customFilters
                .filter(f => f.category === cat.id)
                .filter(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()))
              return (
                <div key={cat.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0`}>
                      <cat.icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">{cat.label}</h3>
                      <p className="text-[11px] text-muted-foreground">
                        {catFilters.length} filter group{catFilters.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingFilter(undefined)
                        setShowFilterForm(true)
                      }}
                      className={`text-xs ${cat.textColor} hover:underline transition-colors flex items-center gap-1`}
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>

                  {catFilters.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                      {catFilters.map((filter) => (
                        <motion.div
                          key={filter.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`${cat.bgLight} border ${cat.borderColor} rounded-2xl p-4 ml-12 flex flex-col sm:flex-row sm:items-center gap-3`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h4 className="font-medium text-foreground text-sm">{filter.label}</h4>
                              <span className="px-2 py-0.5 rounded-full bg-background/60 text-[10px] font-medium text-muted-foreground uppercase tracking-wider border border-border/50">
                                {filter.filterGroup}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {filter.options.map(opt => (
                                <span key={opt.id} className="px-2.5 py-1 bg-background/60 rounded-lg text-xs text-foreground border border-border/30">
                                  {opt.label}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => { setEditingFilter(filter); setShowFilterForm(true) }}
                              className="p-2 border border-border rounded-lg hover:bg-background/60 transition-colors"
                            >
                              <Pencil className="w-4 h-4 text-foreground" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'filter', id: filter.id, title: filter.label })}
                              className="p-2 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <p className="ml-12 text-xs text-muted-foreground py-2">No filters for this category yet</p>
                  )}
                </div>
              )
            })}

            {/* Global / All-category filters */}
            {(() => {
              const globalFilters = customFilters
                .filter(f => f.category === 'all')
                .filter(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()))
              if (globalFilters.length === 0) return null
              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0">
                      <Grid3X3 className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">All Categories (Global)</h3>
                      <p className="text-[11px] text-muted-foreground">{globalFilters.length} filter group{globalFilters.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {globalFilters.map((filter) => (
                      <motion.div
                        key={filter.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-muted/30 border border-border rounded-2xl p-4 ml-12 flex flex-col sm:flex-row sm:items-center gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h4 className="font-medium text-foreground text-sm">{filter.label}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                              {filter.filterGroup}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {filter.options.map(opt => (
                              <span key={opt.id} className="px-2.5 py-1 bg-background/60 rounded-lg text-xs text-foreground border border-border/30">
                                {opt.label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => { setEditingFilter(filter); setShowFilterForm(true) }}
                            className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
                          >
                            <Pencil className="w-4 h-4 text-foreground" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: 'filter', id: filter.id, title: filter.label })}
                            className="p-2 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )
            })()}
          </div>
        )}

        {/* ============================================== */}
        {/* ===== MESSAGES TAB ===== */}
        {/* ============================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-foreground">Customer Messages</h2>
                <p className="text-sm text-muted-foreground">
                  {contactMessages.length} total · {contactMessages.filter(m => !m.read).length} unread
                </p>
              </div>
              <div className="relative flex-1 sm:w-64 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>
            </div>

            {/* Messages list */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {contactMessages
                  .filter(msg =>
                    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    msg.email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((msg) => {
                    const date = new Date(msg.date)
                    const timeAgo = getTimeAgo(date)
                    return (
                      <motion.div
                        key={msg.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`border rounded-2xl p-5 transition-all ${
                          msg.read
                            ? 'bg-card border-border'
                            : 'bg-violet-500/[0.03] border-violet-500/20 dark:bg-violet-500/[0.06]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                              msg.read
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                            }`}>
                              {msg.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-foreground text-sm truncate">{msg.name}</h4>
                                {!msg.read && (
                                  <span className="px-1.5 py-0.5 bg-violet-500 text-white text-[9px] font-bold rounded-full uppercase tracking-wider flex-shrink-0">
                                    New
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-0.5">
                                {msg.email && (
                                  <span className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                    {msg.email}
                                  </span>
                                )}
                                {msg.phone && (
                                  <span className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                                    <Phone className="w-3 h-3 flex-shrink-0" />
                                    {msg.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0">{timeAgo}</span>
                        </div>

                        {/* Message content */}
                        <div className="ml-[52px]">
                          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-4">
                            {!msg.read && (
                              <button
                                onClick={() => markMessageRead(msg.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground/5 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-foreground/10 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Mark Read
                              </button>
                            )}
                            {msg.email && (
                              <a
                                href={`mailto:${msg.email}?subject=Re: Your inquiry at Omkar Ceramic&body=Hi ${msg.name},%0D%0A%0D%0AThank you for reaching out to us.%0D%0A%0D%0A`}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground/5 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-foreground/10 transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                Reply
                              </a>
                            )}
                            {msg.phone && (
                              <a
                                href={`tel:${msg.phone}`}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground/5 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-foreground/10 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                Call
                              </a>
                            )}
                            <button
                              onClick={() => setDeleteTarget({ type: 'message', id: msg.id, title: `Message from ${msg.name}` })}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/20 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
              </AnimatePresence>

              {contactMessages.length === 0 && (
                <div className="py-20 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground mb-2">No messages yet</p>
                  <p className="text-xs text-muted-foreground">Messages from the contact form will appear here</p>
                </div>
              )}

              {contactMessages.length > 0 && contactMessages.filter(msg =>
                msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                msg.email.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="py-20 text-center">
                  <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No messages match your search</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper: relative time
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
