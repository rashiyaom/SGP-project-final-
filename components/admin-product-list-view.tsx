'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Edit2,
  Trash2,
  MoreHorizontal,
  Image as ImageIcon,
  Tag,
  Star,
  Package,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Product } from '@/contexts/admin-context'

interface AdminProductListViewProps {
  products: Product[]
  categoryMeta?: {
    color: string
    bgLight: string
    textColor: string
    borderColor: string
  }
  onEdit: (product: Product) => void
  onDelete: (productId: string, productName: string) => void
  searchQuery?: string
}

export default function AdminProductListView({
  products,
  categoryMeta,
  onEdit,
  onDelete,
  searchQuery = '',
}: AdminProductListViewProps) {
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'stock'>('name')
  const [showOutOfStock, setShowOutOfStock] = useState(true)

  // Filter products
  const filteredProducts = products.filter(p => {
    if (!showOutOfStock && !p.inStock) return false
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (a.price || 0) - (b.price || 0)
      case 'rating':
        return b.rating - a.rating
      case 'stock':
        return (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0)
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  return (
    <div className="space-y-4">
      {/* View Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-9 px-3 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price">Price (Low to High)</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="stock">Stock Status</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOutOfStock(!showOutOfStock)}
            className={`flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium border transition-all ${
              showOutOfStock
                ? 'bg-muted/50 border-border text-foreground'
                : 'bg-red-500/10 border-red-500/30 text-red-600'
            }`}
          >
            {showOutOfStock ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showOutOfStock ? 'Showing All' : 'Hiding Out of Stock'}
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing {sortedProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.02 }}
                className="group"
              >
                <button
                  onClick={() =>
                    setExpandedProductId(expandedProductId === product.id ? null : product.id)
                  }
                  className="w-full text-left"
                >
                  {/* Main Product Row */}
                  <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-foreground/20 transition-all">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.images && product.images.length > 1 && (
                          <div className="absolute top-1 right-1 bg-foreground/80 text-background text-[10px] font-bold px-1.5 py-0.5 rounded">
                            +{product.images.length}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              ID: {product.id}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-semibold text-foreground">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        {/* Pricing & Stock Row */}
                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Price */}
                          <div className="flex items-center gap-1">
                            {product.pricingType === 'inquire' ? (
                              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 italic">
                                Inquire at Store
                              </span>
                            ) : (
                              <>
                                <span className="text-sm font-bold text-foreground">
                                  ₹{product.price?.toLocaleString('en-IN') || '0'}
                                </span>
                                {product.originalPrice && (
                                  <>
                                    <span className="text-xs line-through text-muted-foreground">
                                      ₹{product.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">
                                      {Math.round(
                                        ((product.originalPrice - (product.price || 0)) /
                                          product.originalPrice) *
                                          100
                                      )}
                                      % off
                                    </span>
                                  </>
                                )}
                              </>
                            )}
                          </div>

                          {/* Stock Status */}
                          <div
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
                              product.inStock
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400'
                            }`}
                          >
                            <Package className="w-3 h-3" />
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </div>

                          {/* Pricing Type Badge */}
                          {product.pricingType === 'inquire' && (
                            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-1 rounded">
                              INQUIRY
                            </span>
                          )}

                          {/* Tags Count */}
                          {product.tags && product.tags.length > 0 && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Tag className="w-3 h-3" />
                              <span className="text-[10px]">{product.tags.length} tags</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(product)
                          }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(product.id, product.name)
                          }}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-600 hover:text-red-700 dark:text-red-400"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedProductId(
                              expandedProductId === product.id ? null : product.id
                            )
                          }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground group-hover:text-foreground"
                        >
                          <MoreHorizontal
                            className={`w-4 h-4 transition-transform ${
                              expandedProductId === product.id ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedProductId === product.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 pt-4 border-t border-border space-y-3"
                        >
                          {/* Description */}
                          {product.description && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-1">
                                Description
                              </p>
                              <p className="text-sm text-foreground line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                          )}

                          {/* Images */}
                          {product.images && product.images.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-2">
                                Images ({product.images.length})
                              </p>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {product.images.map((img, idx) => (
                                  <div
                                    key={idx}
                                    className="relative aspect-square rounded-lg overflow-hidden bg-muted/30 border border-border"
                                  >
                                    <img
                                      src={img}
                                      alt={`${product.name} ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    {idx === 0 && (
                                      <div className="absolute top-1 left-1 bg-foreground text-background text-[9px] font-bold px-1.5 py-0.5 rounded">
                                        Primary
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tags */}
                          {product.tags && product.tags.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-2">
                                Tags
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {product.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs font-medium bg-muted text-foreground px-2.5 py-1 rounded-full"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* SKU & Details */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {product.sku && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground">SKU</p>
                                <p className="text-sm font-mono text-foreground">{product.sku}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground">
                                Category
                              </p>
                              <p className="text-sm text-foreground">{product.category}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground">Rating</p>
                              <p className="text-sm text-foreground">
                                {product.rating.toFixed(1)} / 5.0
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground">Images</p>
                              <p className="text-sm text-foreground">
                                {product.images?.length || 1} image
                                {(product.images?.length || 1) !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {searchQuery ? 'No products found matching your search.' : 'No products in this category.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
