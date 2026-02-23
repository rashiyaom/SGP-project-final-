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
} from 'lucide-react'
import { useAdmin, type Product, type GalleryItem, type CustomFilter } from '@/contexts/admin-context'
import Link from 'next/link'

// ===== ADMIN LOGIN =====
function AdminLogin({ onLogin }: { onLogin: (password: string) => boolean }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = onLogin(password)
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
  { id: 'Ceramic Tiles', label: 'Ceramic Tiles', color: 'from-blue-500 to-cyan-500' },
  { id: 'Marble', label: 'Marble', color: 'from-amber-500 to-orange-500' },
  { id: 'Bathroom & Sanitary Ware', label: 'Bathroom & Sanitary', color: 'from-emerald-500 to-teal-500' },
  { id: 'Accessories', label: 'Accessories', color: 'from-purple-500 to-pink-500' },
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
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    category: (product?.category || 'Ceramic Tiles') as Product['category'],
    rating: product?.rating || 4.5,
    inStock: product?.inStock ?? true,
    image: product?.image || '',
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
    onSave({
      ...form,
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
type Tab = 'products' | 'gallery' | 'filters'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'filters', label: 'Filters', icon: Filter },
]

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
    isAdmin,
    adminLogin,
    adminLogout,
  } = useAdmin()

  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('products')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

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

  // ===== FILTERED DATA =====
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredGallery = gallery.filter(g =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFilters = customFilters.filter(f =>
    f.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ===== STATS =====
  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'from-blue-500 to-cyan-500' },
    { label: 'Gallery Items', value: gallery.length, icon: ImageIcon, color: 'from-amber-500 to-orange-500' },
    { label: 'Filter Groups', value: customFilters.length, icon: Filter, color: 'from-emerald-500 to-teal-500' },
    { label: 'Out of Stock', value: products.filter(p => !p.inStock).length, icon: Eye, color: 'from-red-500 to-pink-500' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Modals */}
      <AnimatePresence>
        {showProductForm && (
          <ProductFormModal
            product={editingProduct}
            onSave={(data) => {
              if (editingProduct) {
                updateProduct(editingProduct.id, data)
              } else {
                addProduct(data)
              }
              setEditingProduct(undefined)
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
            }}
            onClose={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-4 sm:p-5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1 bg-muted/50 border border-border rounded-xl p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-foreground text-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search + Add Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <button
              onClick={() => {
                if (activeTab === 'products') { setEditingProduct(undefined); setShowProductForm(true) }
                else if (activeTab === 'gallery') { setEditingGallery(undefined); setShowGalleryForm(true) }
                else if (activeTab === 'filters') { setEditingFilter(undefined); setShowFilterForm(true) }
              }}
              className="h-10 px-4 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add {activeTab === 'products' ? 'Product' : activeTab === 'gallery' ? 'Item' : 'Filter'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter (Products & Filters Tab) */}
        {(activeTab === 'products' || activeTab === 'filters') && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
                selectedCategory === 'all'
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
              }`}
            >
              All ({products.length})
            </button>
            {categories.map(cat => {
              const count = products.filter(p => p.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              )
            })}
          </div>
        )}

        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-muted/30 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Stock Badge */}
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      product.inStock
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-red-500/90 text-white'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setEditingProduct(product)
                          setShowProductForm(true)
                        }}
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
                  {/* Content */}
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{product.category}</p>
                    <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-1">{product.name}</h3>
                    {/* Filter tags */}
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
                        <span className="font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium text-foreground">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No products found</p>
              </div>
            )}
          </div>
        )}

        {/* ===== GALLERY TAB ===== */}
        {activeTab === 'gallery' && (
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
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.featured && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-white text-[10px] font-bold uppercase tracking-wider">
                        ★ Featured
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setEditingGallery(item)
                          setShowGalleryForm(true)
                        }}
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
        )}

        {/* ===== FILTERS TAB ===== */}
        {activeTab === 'filters' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5 mb-2">
              <h3 className="font-medium text-foreground text-sm mb-1">Manage Filters</h3>
              <p className="text-xs text-muted-foreground">Create and edit filter groups by category. These appear on the website filter sidebar and inside the product form for auto-classification.</p>
            </div>

            {/* Category-wise filter groups */}
            {categories
              .filter(cat => selectedCategory === 'all' || selectedCategory === cat.id)
              .map(cat => {
              const catFilters = customFilters.filter(f => f.category === cat.id)
              if (catFilters.length === 0 && searchQuery) return null
              return (
                <div key={cat.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0`}>
                      <Filter className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">{cat.label}</h3>
                      <p className="text-[11px] text-muted-foreground">{catFilters.length} filter group{catFilters.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {catFilters
                      .filter(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((filter) => (
                      <motion.div
                        key={filter.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-card border border-border rounded-2xl p-4 ml-11 flex flex-col sm:flex-row sm:items-center gap-3"
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
                              <span key={opt.id} className="px-2.5 py-1 bg-muted/70 rounded-lg text-xs text-foreground">
                                {opt.label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              setEditingFilter(filter)
                              setShowFilterForm(true)
                            }}
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

                  {catFilters.length === 0 && (
                    <p className="ml-11 text-xs text-muted-foreground py-2">No filters for this category yet</p>
                  )}
                </div>
              )
            })}

            {/* Global / All-category filters */}
            {(() => {
              const globalFilters = customFilters.filter(f => f.category === 'all')
              if (globalFilters.length === 0) return null
              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0">
                      <Filter className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">All Categories (Global)</h3>
                      <p className="text-[11px] text-muted-foreground">{globalFilters.length} filter group{globalFilters.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {globalFilters
                      .filter(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((filter) => (
                      <motion.div
                        key={filter.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-card border border-border rounded-2xl p-4 ml-11 flex flex-col sm:flex-row sm:items-center gap-3"
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
                              <span key={opt.id} className="px-2.5 py-1 bg-muted/70 rounded-lg text-xs text-foreground">
                                {opt.label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              setEditingFilter(filter)
                              setShowFilterForm(true)
                            }}
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

            {customFilters.length === 0 && (
              <div className="py-20 text-center">
                <Filter className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground mb-2">No filters yet</p>
                <p className="text-xs text-muted-foreground">Add filters to help users find products easily</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
