'use client'

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Upload, Check, AlertCircle, Grid3x3, Zap } from 'lucide-react'
import { useAdmin, type Product } from '@/contexts/admin-context'

interface FullscreenProductFormProps {
  product?: Product
  onSave: (data: Omit<Product, 'id'>) => void
  onClose: () => void
}

const QUICK_PRESETS = {
  'Ceramic Tiles': [
    { label: 'Floor Tiles', tags: ['floor', 'durable', 'everyday'] },
    { label: 'Wall Tiles', tags: ['wall', 'decorative', 'modern'] },
    { label: 'Bathroom Tiles', tags: ['bathroom', 'waterproof', 'slip-resistant'] },
    { label: 'Kitchen Backsplash', tags: ['kitchen', 'backsplash', 'easy-clean'] },
    { label: 'Large Format', tags: ['large-format', 'seamless', 'minimalist'] },
  ],
  'Marble': [
    { label: 'Polished Marble', tags: ['polished', 'luxury', 'elegant'] },
    { label: 'Honed Marble', tags: ['honed', 'matte', 'sophisticated'] },
    { label: 'Marble Slabs', tags: ['slab', 'large-format', 'statement'] },
    { label: 'Marble Mosaic', tags: ['mosaic', 'artistic', 'decorative'] },
    { label: 'Veined Marble', tags: ['veined', 'natural', 'premium'] },
  ],
  'Bathroom & Sanitary Ware': [
    { label: 'Wash Basins', tags: ['basin', 'sink', 'modern'] },
    { label: 'Toilets', tags: ['toilet', 'water-efficient', 'durable'] },
    { label: 'Bathtubs', tags: ['bathtub', 'luxury', 'freestanding'] },
    { label: 'Faucets & Taps', tags: ['faucet', 'chrome', 'designer'] },
    { label: 'Shower Systems', tags: ['shower', 'rainfall', 'luxe'] },
  ],
  'Accessories': [
    { label: 'Tile Trim', tags: ['trim', 'border', 'finishing'] },
    { label: 'Grout & Adhesives', tags: ['grout', 'adhesive', 'installation'] },
    { label: 'Hardware', tags: ['hardware', 'handles', 'chrome'] },
    { label: 'Towel Rails', tags: ['towel-rail', 'stainless', 'modern'] },
    { label: 'Decorative Elements', tags: ['decorative', 'accent', 'design'] },
  ],
} as const

export default function FullscreenProductForm({
  product,
  onSave,
  onClose,
}: FullscreenProductFormProps) {
  const { customFilters } = useAdmin()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: product?.name || '',
    pricingType: (product?.pricingType || 'fixed') as 'fixed' | 'inquire',
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    category: (product?.category || 'Ceramic Tiles') as Product['category'],
    rating: product?.rating || 4.5,
    inStock: product?.inStock ?? true,
    images: product?.images || [''],
    description: product?.description || '',
    filters: product?.filters || {} as Record<string, string[]>,
    sku: product?.sku || '',
    tags: product?.tags || [],
  })

  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'pricing' | 'advanced'>('basic')
  const [showPresets, setShowPresets] = useState(false)

  const categoryFilters = customFilters.filter(
    (f) => f.category === form.category || f.category === 'all'
  )

  const toggleFilterOption = (filterGroup: string, optionId: string) => {
    setForm((prev) => {
      const current = prev.filters[filterGroup] || []
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
      return {
        ...prev,
        filters: { ...prev.filters, [filterGroup]: next },
      }
    })
  }

  const addImage = () => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ''],
    }))
  }

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const updateImage = (index: number, url: string) => {
    setForm((prev) => {
      const newImages = [...prev.images]
      newImages[index] = url
      return { ...prev, images: newImages }
    })
  }

  const addTag = (tag: string) => {
    if (!form.tags.includes(tag)) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
  }

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const applyPreset = (preset: (typeof QUICK_PRESETS)[keyof typeof QUICK_PRESETS][number]) => {
    // Add preset tags
    preset.tags.forEach((tag) => addTag(tag))
    setShowPresets(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validImages = form.images.filter((img) => img.trim())
    
    onSave({
      ...form,
      images: validImages.length > 0 ? validImages : [''],
      image: validImages[0] || '', // Primary image is first
      originalPrice: form.originalPrice || undefined,
    })
    onClose()
  }

  const presets =
    QUICK_PRESETS[form.category as keyof typeof QUICK_PRESETS] || []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-screen w-full max-w-3xl bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900/95 backdrop-blur-sm px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-stone-900 dark:text-white">
              {product ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {form.category} • {form.pricingType === 'fixed' ? 'Fixed Price' : 'Price on Inquiry'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900/50 px-8">
          <div className="flex gap-1 overflow-x-auto">
            {(['basic', 'media', 'pricing', 'advanced'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {tab === 'basic' && '📝 Basic Info'}
                {tab === 'media' && '📷 Media & Images'}
                {tab === 'pricing' && '💰 Pricing'}
                {tab === 'advanced' && '⚙️ Advanced'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-8 space-y-8 max-w-2xl">
            {/* BASIC TAB */}
            {activeTab === 'basic' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Marble Elegance 60x60"
                    className="w-full h-12 px-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      setForm({ ...form, category: e.target.value as Product['category'] })
                      setShowPresets(false)
                    }}
                    className="w-full h-12 px-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 appearance-none"
                  >
                    <option>Ceramic Tiles</option>
                    <option>Marble</option>
                    <option>Bathroom & Sanitary Ware</option>
                    <option>Accessories</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Detailed product description..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 resize-none"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-2">
                    SKU / Product Code
                  </label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="e.g., MAR-ELE-60x60"
                    className="w-full h-12 px-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                    className="w-5 h-5 rounded accent-[#d4af37]"
                  />
                  <label htmlFor="inStock" className="text-sm font-medium text-stone-900 dark:text-white">
                    In Stock
                  </label>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-2">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full h-12 px-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>
              </motion.div>
            )}

            {/* MEDIA TAB */}
            {activeTab === 'media' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-stone-900 dark:text-white">
                      Product Images ({form.images.filter(img => img.trim()).length})
                    </label>
                    <button
                      type="button"
                      onClick={addImage}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#d4af37] text-white text-xs font-semibold rounded-lg hover:bg-[#bfa14a] transition-colors"
                    >
                      <Plus size={16} />
                      Add Image
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.images.map((image, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="flex-1">
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => updateImage(idx, e.target.value)}
                            placeholder="Paste image URL here..."
                            className="w-full h-12 px-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                          />
                          {image && (
                            <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700">
                              <img
                                src={image}
                                alt={`Product ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {idx === 0 && (
                                <div className="absolute top-1 right-1 bg-[#d4af37] text-white text-xs px-2 py-1 rounded">
                                  Primary
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {form.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors mt-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PRICING TAB */}
            {activeTab === 'pricing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Pricing Type */}
                <div>
                  <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-3">
                    Pricing Option *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['fixed', 'inquire'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, pricingType: type })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          form.pricingType === type
                            ? 'border-[#d4af37] bg-[#d4af37]/10'
                            : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <p className="font-semibold text-stone-900 dark:text-white">
                          {type === 'fixed' ? '💰 Fixed Price' : '📞 Inquire at Store'}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                          {type === 'fixed'
                            ? 'Set a fixed price for customers'
                            : 'Price varies - customers contact store'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Input (only for fixed pricing) */}
                {form.pricingType === 'fixed' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-2">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        required={form.pricingType === 'fixed'}
                        min={0}
                        value={form.price || ''}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        placeholder="1200"
                        className="w-full h-12 px-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-2">
                        Original Price (₹) - for discounts
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={form.originalPrice || ''}
                        onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                        placeholder="Optional"
                        className="w-full h-12 px-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                      />
                      {form.originalPrice && form.price && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                          Discount: {Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)}%
                        </p>
                      )}
                    </div>
                  </>
                )}

                {form.pricingType === 'inquire' && (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      ℹ️ Customers will see "Inquire at Store" instead of a price. Great for custom or bulk orders.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ADVANCED TAB */}
            {activeTab === 'advanced' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Quick Presets */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-stone-900 dark:text-white">
                      ⚡ Quick Presets
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPresets(!showPresets)}
                      className="text-xs px-3 py-1 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-white hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                    >
                      {showPresets ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showPresets && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4"
                      >
                        {presets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => applyPreset(preset)}
                            className="p-3 text-left rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-[#d4af37]/20 border-2 border-stone-300 dark:border-stone-600 hover:border-[#d4af37] transition-all"
                          >
                            <p className="text-sm font-medium text-stone-900 dark:text-white">
                              {preset.label}
                            </p>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                              {preset.tags.join(', ')}
                            </p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-3">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.tags.map((tag) => (
                      <motion.div
                        key={tag}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center gap-2 px-3 py-1 bg-[#d4af37] text-white text-xs font-medium rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-stone-200"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter tag and press Enter..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value.trim().toLowerCase()
                        if (value) {
                          addTag(value)
                          ;(e.target as HTMLInputElement).value = ''
                        }
                      }
                    }}
                    className="w-full h-10 px-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>

                {/* Category Filters */}
                {categoryFilters.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-3">
                      Category Filters
                    </label>
                    <div className="space-y-4">
                      {categoryFilters.map((filter) => (
                        <div key={filter.id}>
                          <p className="text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase mb-2">
                            {filter.label}
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {filter.options.map((option) => (
                              <label
                                key={option.id}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700/50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    form.filters[filter.filterGroup]?.includes(option.id) || false
                                  }
                                  onChange={() => toggleFilterOption(filter.filterGroup, option.id)}
                                  className="w-4 h-4 rounded accent-[#d4af37]"
                                />
                                <span className="text-sm text-stone-700 dark:text-stone-300">
                                  {option.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900/95 backdrop-blur-sm px-8 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-stone-700 dark:text-stone-300 font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const form_element = document.querySelector('form') as HTMLFormElement
              if (form_element) form_element.requestSubmit()
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#d4af37] text-white font-semibold rounded-lg hover:bg-[#bfa14a] transition-colors"
          >
            <Check size={18} />
            {product ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
