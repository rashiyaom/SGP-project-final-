'use client'

import React, { useState, useEffect } from "react"
import Link from 'next/link'

type CollectionType = 'ceramic' | 'marble' | 'sanitary' | 'accessories' | null

interface FilterOption {
  id: string
  label: string
  checked: boolean
}

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

export function ProductFilters({ collection, onCollectionChange, onFiltersChange }: ProductFiltersProps) {

  // ===== CERAMIC TILES FILTERS =====
  const [ceramicTypes, setCeramicTypes] = useState<FilterOption[]>([
    { id: 'floor', label: 'Floor Tiles', checked: false },
    { id: 'wall', label: 'Wall Tiles', checked: false },
    { id: 'bathroom', label: 'Bathroom Tiles', checked: false },
    { id: 'kitchen', label: 'Kitchen Tiles', checked: false },
  ])

  const [ceramicFinishes, setCeramicFinishes] = useState<FilterOption[]>([
    { id: 'polished', label: 'Polished', checked: false },
    { id: 'matte', label: 'Matte', checked: false },
    { id: 'glossy', label: 'Glossy', checked: false },
    { id: 'textured', label: 'Textured', checked: false },
    { id: 'rustic', label: 'Rustic', checked: false },
  ])

  const [ceramicSizes, setCeramicSizes] = useState<FilterOption[]>([
    { id: '30x30', label: '30x30 cm', checked: false },
    { id: '45x45', label: '45x45 cm', checked: false },
    { id: '60x60', label: '60x60 cm', checked: false },
    { id: '75x75', label: '75x75 cm', checked: false },
    { id: '30x60', label: '30x60 cm (Subway)', checked: false },
  ])

  const [ceramicUsages, setCeramicUsages] = useState<FilterOption[]>([
    { id: 'floor', label: 'Floor Only', checked: false },
    { id: 'wall', label: 'Wall Only', checked: false },
    { id: 'both', label: 'Floor & Wall', checked: false },
  ])

  // ===== MARBLE FILTERS =====
  const [marbleTypes, setMarbleTypes] = useState<FilterOption[]>([
    { id: 'white', label: 'White Marble', checked: false },
    { id: 'black', label: 'Black Marble', checked: false },
    { id: 'grey', label: 'Grey/Beige Marble', checked: false },
    { id: 'colored', label: 'Colored Marble', checked: false },
    { id: 'patterned', label: 'Patterned Marble', checked: false },
  ])

  const [marbleFinishes, setMarbleFinishes] = useState<FilterOption[]>([
    { id: 'polished', label: 'Polished', checked: false },
    { id: 'honed', label: 'Honed', checked: false },
    { id: 'brushed', label: 'Brushed', checked: false },
    { id: 'tumbled', label: 'Tumbled', checked: false },
    { id: 'flamed', label: 'Flamed', checked: false },
  ])

  const [marbleSizes, setMarbleSizes] = useState<FilterOption[]>([
    { id: '30x30', label: '30x30 cm', checked: false },
    { id: '60x60', label: '60x60 cm', checked: false },
    { id: '120x120', label: '120x120 cm', checked: false },
    { id: '30x60', label: '30x60 cm', checked: false },
    { id: 'custom', label: 'Custom Size', checked: false },
  ])

  const [marbleOrigins, setMarbleOrigins] = useState<FilterOption[]>([
    { id: 'italian', label: 'Italian', checked: false },
    { id: 'spanish', label: 'Spanish', checked: false },
    { id: 'indian', label: 'Indian', checked: false },
    { id: 'portuguese', label: 'Portuguese', checked: false },
    { id: 'turkish', label: 'Turkish', checked: false },
  ])

  // ===== SANITARY WARE FILTERS =====
  const [sanitaryTypes, setSanitaryTypes] = useState<FilterOption[]>([
    { id: 'washbasin', label: 'Wash Basins / Sinks', checked: false },
    { id: 'toilet', label: 'Toilets', checked: false },
    { id: 'bathtub', label: 'Bathtubs', checked: false },
    { id: 'shower', label: 'Shower Trays', checked: false },
    { id: 'bidet', label: 'Bidets', checked: false },
  ])

  const [sanitaryMaterials, setSanitaryMaterials] = useState<FilterOption[]>([
    { id: 'ceramic', label: 'Ceramic', checked: false },
    { id: 'porcelain', label: 'Porcelain', checked: false },
    { id: 'glass', label: 'Glass', checked: false },
    { id: 'steel', label: 'Stainless Steel', checked: false },
    { id: 'acrylic', label: 'Acrylic', checked: false },
  ])

  const [sanitaryStyles, setSanitaryStyles] = useState<FilterOption[]>([
    { id: 'modern', label: 'Modern', checked: false },
    { id: 'classic', label: 'Classic', checked: false },
    { id: 'contemporary', label: 'Contemporary', checked: false },
    { id: 'minimalist', label: 'Minimalist', checked: false },
    { id: 'vintage', label: 'Vintage', checked: false },
  ])

  // ===== ACCESSORIES FILTERS =====
  const [accessoriesTypes, setAccessoriesTypes] = useState<FilterOption[]>([
    { id: 'trim', label: 'Tile Trim & Border', checked: false },
    { id: 'grout', label: 'Grout & Adhesives', checked: false },
    { id: 'handles', label: 'Handles & Knobs', checked: false },
    { id: 'hardware', label: 'Bathroom Hardware', checked: false },
    { id: 'decos', label: 'Decorative Elements', checked: false },
  ])

  const [accessoriesMaterials, setAccessoriesMaterials] = useState<FilterOption[]>([
    { id: 'stainless', label: 'Stainless Steel', checked: false },
    { id: 'ceramic', label: 'Ceramic', checked: false },
    { id: 'brass', label: 'Brass', checked: false },
    { id: 'wood', label: 'Wood', checked: false },
    { id: 'plastic', label: 'Plastic/Resin', checked: false },
  ])

  const [accessoriesColors, setAccessoriesColors] = useState<FilterOption[]>([
    { id: 'silver', label: 'Silver/Chrome', checked: false },
    { id: 'gold', label: 'Gold/Brass', checked: false },
    { id: 'black', label: 'Matte Black', checked: false },
    { id: 'white', label: 'White', checked: false },
    { id: 'wood', label: 'Natural Wood', checked: false },
  ])

  const [accessoriesFinishes, setAccessoriesFinishes] = useState<FilterOption[]>([
    { id: 'matte', label: 'Matte', checked: false },
    { id: 'glossy', label: 'Glossy', checked: false },
    { id: 'brushed', label: 'Brushed', checked: false },
    { id: 'polished', label: 'Polished', checked: false },
  ])

  // ===== ALL PRODUCTS FILTERS =====
  const [allCategories, setAllCategories] = useState<FilterOption[]>([
    { id: 'ceramic', label: 'Ceramic Tiles', checked: false },
    { id: 'marble', label: 'Marble', checked: false },
    { id: 'sanitary', label: 'Sanitary Ware', checked: false },
    { id: 'accessories', label: 'Accessories', checked: false },
  ])
  const toggleFilter = (
    setter: React.Dispatch<React.SetStateAction<FilterOption[]>>,
    id: string,
  ) => {
    setter((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      )
    )
  }

  // Effect to notify parent when filters change
  useEffect(() => {
    if (onFiltersChange) {
      const allFilters: Record<string, string[]> = {
        ceramicTypes: ceramicTypes.filter(t => t.checked).map(t => t.id),
        ceramicFinishes: ceramicFinishes.filter(f => f.checked).map(f => f.id),
        ceramicSizes: ceramicSizes.filter(s => s.checked).map(s => s.id),
        ceramicUsages: ceramicUsages.filter(u => u.checked).map(u => u.id),
        marbleTypes: marbleTypes.filter(t => t.checked).map(t => t.id),
        marbleFinishes: marbleFinishes.filter(f => f.checked).map(f => f.id),
        marbleSizes: marbleSizes.filter(s => s.checked).map(s => s.id),
        marbleOrigins: marbleOrigins.filter(o => o.checked).map(o => o.id),
        sanitaryTypes: sanitaryTypes.filter(t => t.checked).map(t => t.id),
        sanitaryMaterials: sanitaryMaterials.filter(m => m.checked).map(m => m.id),
        sanitaryStyles: sanitaryStyles.filter(s => s.checked).map(s => s.id),
        accessoriesTypes: accessoriesTypes.filter(t => t.checked).map(t => t.id),
        accessoriesMaterials: accessoriesMaterials.filter(m => m.checked).map(m => m.id),
        accessoriesColors: accessoriesColors.filter(c => c.checked).map(c => c.id),
        accessoriesFinishes: accessoriesFinishes.filter(f => f.checked).map(f => f.id),
        allCategories: allCategories.filter(c => c.checked).map(c => c.id),
      }
      onFiltersChange(allFilters)
    }  }, [
    ceramicTypes,
    ceramicFinishes,
    ceramicSizes,
    ceramicUsages,
    marbleTypes,
    marbleFinishes,
    marbleSizes,
    marbleOrigins,
    sanitaryTypes,
    sanitaryMaterials,
    sanitaryStyles,
    accessoriesTypes,
    accessoriesMaterials,
    accessoriesColors,
    accessoriesFinishes,
    allCategories,
  ])

  const FilterSection = ({
    title,
    options,
    setter,
  }: {
    title: string
    options: FilterOption[]
    setter: React.Dispatch<React.SetStateAction<FilterOption[]>>
  }) => (
    <div className="mb-8">
      <h3 className="font-medium text-foreground text-sm mb-4">{title}</h3>
      <div className="space-y-2.5">
        {options.map((option) => (
          <label key={option.id} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => toggleFilter(setter, option.id)}
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
      <p className="text-sm text-muted-foreground mb-3">Rs. 500 - Rs. 50,000</p>
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

      {/* ===== CERAMIC TILES FILTERS ===== */}
      {collection === 'ceramic' && (
        <>
          <FilterSection title="By Type" options={ceramicTypes} setter={setCeramicTypes} />
          <FilterSection title="By Finish" options={ceramicFinishes} setter={setCeramicFinishes} />
          <FilterSection title="By Size" options={ceramicSizes} setter={setCeramicSizes} />
          <FilterSection title="By Usage" options={ceramicUsages} setter={setCeramicUsages} />
          <PriceRangeSection />
        </>
      )}

      {/* ===== MARBLE FILTERS ===== */}
      {collection === 'marble' && (
        <>
          <FilterSection title="By Type" options={marbleTypes} setter={setMarbleTypes} />
          <FilterSection title="By Finish" options={marbleFinishes} setter={setMarbleFinishes} />
          <FilterSection title="By Size" options={marbleSizes} setter={setMarbleSizes} />
          <FilterSection title="By Origin" options={marbleOrigins} setter={setMarbleOrigins} />
          <PriceRangeSection />
        </>
      )}

      {/* ===== SANITARY WARE FILTERS ===== */}
      {collection === 'sanitary' && (
        <>
          <FilterSection title="By Type" options={sanitaryTypes} setter={setSanitaryTypes} />
          <FilterSection title="By Material" options={sanitaryMaterials} setter={setSanitaryMaterials} />
          <FilterSection title="By Style" options={sanitaryStyles} setter={setSanitaryStyles} />
          <PriceRangeSection />
        </>
      )}

      {/* ===== ACCESSORIES FILTERS ===== */}
      {collection === 'accessories' && (
        <>
          <FilterSection title="By Type" options={accessoriesTypes} setter={setAccessoriesTypes} />
          <FilterSection title="By Material" options={accessoriesMaterials} setter={setAccessoriesMaterials} />
          <FilterSection title="By Color" options={accessoriesColors} setter={setAccessoriesColors} />
          <FilterSection title="By Finish" options={accessoriesFinishes} setter={setAccessoriesFinishes} />
          <PriceRangeSection />
        </>
      )}

      {/* ===== ALL PRODUCTS DEFAULT FILTERS ===== */}
      {!collection && (
        <>
          <FilterSection title="By Categories" options={allCategories} setter={setAllCategories} />
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
