'use client'

import React, { useState, useEffect, useMemo } from "react"
import Link from 'next/link'
import { useAdmin } from '@/contexts/admin-context'

type CollectionType = 'ceramic' | 'marble' | 'sanitary' | 'accessories' | null

interface ProductFiltersProps {
  collection?: CollectionType
  onCollectionChange?: (collection: CollectionType) => void
  onFiltersChange?: (filters: Record<string, string[]>) => void
}

const collections = [
  { id: 'ceramic', label: 'Ceramic Tiles' },
  { id: 'marble', label: 'Marble' },
  { id: 'sanitary', label: 'Bathroom & Sanitary' },
  { id: 'accessories', label: 'Accessories' },
]

const collectionToCategoryMap: Record<string, string> = {
  ceramic: 'Ceramic Tiles',
  marble: 'Marble',
  sanitary: 'Bathroom & Sanitary Ware',
  accessories: 'Accessories',
}

export function ProductFilters({ collection, onCollectionChange, onFiltersChange }: ProductFiltersProps) {
  const { customFilters } = useAdmin()

  // Track checked state per filterGroup -> optionId
  const [checkedState, setCheckedState] = useState<Record<string, Set<string>>>({})

  // Get relevant filters for the current view
  const relevantFilters = useMemo(() => {
    if (!collection) {
      // "All Products" view — show the allCategories pseudo-filter
      return []
    }
    const categoryName = collectionToCategoryMap[collection]
    if (!categoryName) return []
    return customFilters.filter(f => f.category === categoryName || f.category === 'all')
  }, [collection, customFilters])

  // allCategories filter for "All Products" view
  const allCategoryOptions = useMemo(() => [
    { id: 'ceramic', label: 'Ceramic Tiles' },
    { id: 'marble', label: 'Marble' },
    { id: 'sanitary', label: 'Sanitary Ware' },
    { id: 'accessories', label: 'Accessories' },
  ], [])

  const toggleFilter = (filterGroup: string, optionId: string) => {
    setCheckedState(prev => {
      const next = { ...prev }
      const current = new Set(prev[filterGroup] || [])
      if (current.has(optionId)) {
        current.delete(optionId)
      } else {
        current.add(optionId)
      }
      next[filterGroup] = current
      return next
    })
  }

  // Notify parent when filters change
  useEffect(() => {
    if (onFiltersChange) {
      const allFilters: Record<string, string[]> = {}
      for (const [group, ids] of Object.entries(checkedState)) {
        allFilters[group] = Array.from(ids)
      }
      onFiltersChange(allFilters)
    }
  }, [checkedState, onFiltersChange])

  // Reset checked state when collection changes
  useEffect(() => {
    setCheckedState({})
  }, [collection])

  const FilterSection = ({
    title,
    filterGroup,
    options,
  }: {
    title: string
    filterGroup: string
    options: { id: string; label: string }[]
  }) => (
    <div className="mb-8">
      <h3 className="font-medium text-foreground text-sm mb-4">By {title}</h3>
      <div className="space-y-2.5">
        {options.map((option) => (
          <label key={option.id} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={checkedState[filterGroup]?.has(option.id) || false}
              onChange={() => toggleFilter(filterGroup, option.id)}
              className="w-4 h-4 rounded border-muted-foreground cursor-pointer accent-foreground"
            />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors text-sm">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )

  const PriceRangeSection = () => (
    <div className="mb-8">
      <h3 className="font-medium text-foreground text-sm mb-4">Price</h3>
      <p className="text-sm text-muted-foreground mb-3">₹500 - ₹50,000</p>
      <input
        type="range"
        min="500"
        max="50000"
        defaultValue="25000"
        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
      />
    </div>
  )

  return (
    <div className="h-fit sticky top-24">
      {/* Category Selection */}
      <div className="mb-8 pb-6 border-b border-border">
        <h3 className="font-medium text-foreground text-sm mb-4">Category</h3>
        <div className="space-y-2">
          <Link
            href="/products"
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              !collection ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            All Products
          </Link>
          {collections.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?collection=${cat.id}`}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                collection === cat.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Dynamic filters from admin context */}
      {collection && relevantFilters.length > 0 && (
        <>
          {relevantFilters.map(filter => (
            <FilterSection
              key={filter.id}
              title={filter.label}
              filterGroup={filter.filterGroup}
              options={filter.options}
            />
          ))}
          <PriceRangeSection />
        </>
      )}

      {/* All Products view — category filter */}
      {!collection && (
        <>
          <FilterSection
            title="Categories"
            filterGroup="allCategories"
            options={allCategoryOptions}
          />
          <PriceRangeSection />
        </>
      )}

      {/* Availability Section */}
      <div className="mb-8">
        <h3 className="font-medium text-foreground text-sm mb-4">Availability</h3>
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded cursor-pointer accent-foreground" />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors text-sm">In Stock</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded cursor-pointer accent-foreground" />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors text-sm">Out of Stock</span>
          </label>
        </div>
      </div>
    </div>
  )
}
