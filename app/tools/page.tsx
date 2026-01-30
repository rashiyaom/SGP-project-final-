'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState } from 'react'
import { Calculator, Scale, Ruler, Palette, Check, Minus, ArrowRight, LayoutGrid, Grid3X3, Percent } from 'lucide-react'
import Link from 'next/link'

const tools = [
  { id: 'calculator', name: 'Tile Calculator', icon: Calculator, description: 'Calculate tiles needed for your space' },
  { id: 'compare', name: 'Product Compare', icon: Scale, description: 'Compare up to 4 products side by side' },
  { id: 'area', name: 'Area Estimator', icon: Ruler, description: 'Estimate material for complex shapes' },
  { id: 'visualizer', name: 'Color Visualizer', icon: Palette, description: 'Preview tiles in your space' },
]

const tileSizeOptions = [
  { value: '30x30', label: '30x30 cm', area: 0.09 },
  { value: '60x60', label: '60x60 cm', area: 0.36 },
  { value: '60x120', label: '60x120 cm', area: 0.72 },
  { value: '80x80', label: '80x80 cm', area: 0.64 },
  { value: '120x120', label: '120x120 cm', area: 1.44 },
]

const compareProducts = [
  { 
    id: '1', 
    name: 'Marble Elegance', 
    price: 2500, 
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop',
    specs: { material: 'Italian Marble', finish: 'Polished', size: '60x60 cm', waterAbsorption: '<0.5%', slipResistant: true, warranty: '15 Years' }
  },
  { 
    id: '2', 
    name: 'Ceramic White', 
    price: 1200, 
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=400&auto=format&fit=crop',
    specs: { material: 'Ceramic', finish: 'Glossy', size: '60x60 cm', waterAbsorption: '<3%', slipResistant: false, warranty: '10 Years' }
  },
  { 
    id: '3', 
    name: 'Granite Premium', 
    price: 3200, 
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop',
    specs: { material: 'Granite', finish: 'Honed', size: '60x60 cm', waterAbsorption: '<0.3%', slipResistant: true, warranty: '20 Years' }
  },
  { 
    id: '4', 
    name: 'Polished Quartz', 
    price: 2800, 
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=400&auto=format&fit=crop',
    specs: { material: 'Engineered Quartz', finish: 'Polished', size: '60x120 cm', waterAbsorption: '0%', slipResistant: true, warranty: '25 Years' }
  },
]

const specLabels: Record<string, string> = {
  material: 'Material',
  finish: 'Finish',
  size: 'Size',
  waterAbsorption: 'Water Absorption',
  slipResistant: 'Slip Resistant',
  warranty: 'Warranty',
}

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState('calculator')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [tileSize, setTileSize] = useState('60x60')
  const [wastage, setWastage] = useState(10)
  const [unit, setUnit] = useState<'cm' | 'm'>('cm')
  const [selectedProducts, setSelectedProducts] = useState<string[]>(['1', '3'])

  const toggleProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id))
    } else if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  const calculations = (() => {
    if (!length || !width) return null
    let l = parseFloat(length)
    let w = parseFloat(width)
    if (unit === 'cm') { l = l / 100; w = w / 100 }
    const roomArea = l * w
    const selectedTile = tileSizeOptions.find(t => t.value === tileSize)
    if (!selectedTile) return null
    const tilesWithoutWastage = roomArea / selectedTile.area
    const tilesWithWastage = Math.ceil(tilesWithoutWastage * (1 + wastage / 100))
    return {
      roomArea: roomArea.toFixed(2),
      tilesNeeded: tilesWithWastage,
      boxesNeeded: Math.ceil(tilesWithWastage / 4),
      wastageCount: tilesWithWastage - Math.ceil(tilesWithoutWastage),
      coverage: (tilesWithWastage * selectedTile.area).toFixed(2),
    }
  })()

  const selectedCompareProducts = compareProducts.filter(p => selectedProducts.includes(p.id))

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8">
          {/* Page Header */}
          <div className="mb-12">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Planning</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
              Project <span className="italic">Tools</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Plan your renovation with precision using our suite of planning tools.
            </p>
          </div>

          {/* Tool Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border whitespace-nowrap transition-all ${
                  activeTool === tool.id
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border-border hover:border-muted-foreground'
                }`}
              >
                <tool.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tool.name}</span>
              </button>
            ))}
          </div>

          {/* Calculator Tool */}
          {activeTool === 'calculator' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/50 dark:bg-muted/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-border/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-6">
                  {/* Room Dimensions */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-semibold text-foreground flex items-center gap-2.5">
                        <Ruler className="w-4 h-4 text-foreground/60" />
                        Room Dimensions
                      </label>
                      <div className="inline-flex gap-1 bg-muted rounded-full p-1 border border-border">
                        <button onClick={() => setUnit('cm')} className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${unit === 'cm' ? 'bg-foreground text-background shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}>Centimeter</button>
                        <button onClick={() => setUnit('m')} className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${unit === 'm' ? 'bg-foreground text-background shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}>Meter</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground font-medium mb-1.5">Length ({unit})</label>
                        <input type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder={unit === 'cm' ? '300' : '3'} className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground font-medium mb-1.5">Width ({unit})</label>
                        <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder={unit === 'cm' ? '400' : '4'} className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Tile Size Selection */}
                  <div>
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2.5 mb-4">
                      <Grid3X3 className="w-4 h-4 text-foreground/60" />
                      Select Tile Size
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {tileSizeOptions.map((option) => (
                        <button key={option.value} onClick={() => setTileSize(option.value)} className={`py-3 px-2 rounded-lg border-2 transition-all text-xs font-semibold ${tileSize === option.value ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-foreground hover:border-foreground/50'}`}>{option.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Wastage Slider */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3.5">
                      <label className="text-sm font-semibold text-foreground flex items-center gap-2.5">
                        <Percent className="w-4 h-4 text-foreground/60" />
                        Wastage Allowance
                      </label>
                      <span className="text-lg font-bold text-foreground bg-muted/40 px-3 py-1 rounded-full">{wastage}%</span>
                    </div>
                    <input type="range" min="5" max="20" value={wastage} onChange={(e) => setWastage(parseInt(e.target.value))} className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-foreground" />
                    <div className="flex justify-between text-[11px] text-muted-foreground mt-2.5">
                      <span>5% (Simple Layout)</span>
                      <span>20% (Complex Pattern)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-foreground to-foreground/95 text-background rounded-2xl p-6 sm:p-8 flex flex-col shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-background/15 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-background/80" />
                  </div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider">Results</h3>
                </div>
                {calculations ? (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="bg-background/10 backdrop-blur-sm rounded-xl p-5 text-center border border-background/20">
                      <p className="text-xs text-background/70 uppercase tracking-wider mb-2 font-semibold">Tiles Required</p>
                      <p className="text-5xl font-black tracking-tight">{calculations.tilesNeeded}</p>
                      <p className="text-xs text-background/60 mt-1.5">pieces</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div className="bg-background/10 backdrop-blur-sm rounded-lg p-3.5 text-center border border-background/20">
                        <p className="text-xs text-background/70 font-semibold mb-1.5">Area</p>
                        <p className="text-xl font-bold">{calculations.roomArea}</p>
                        <p className="text-[10px] text-background/60 mt-1">m²</p>
                      </div>
                      <div className="bg-background/10 backdrop-blur-sm rounded-lg p-3.5 text-center border border-background/20">
                        <p className="text-xs text-background/70 font-semibold mb-1.5">Boxes</p>
                        <p className="text-xl font-bold">{calculations.boxesNeeded}</p>
                      </div>
                      <div className="bg-emerald-500/20 backdrop-blur-sm rounded-lg p-3.5 text-center border border-emerald-500/30">
                        <p className="text-xs text-emerald-100 font-semibold mb-1.5">Waste</p>
                        <p className="text-xl font-bold text-emerald-200">+{calculations.wastageCount}</p>
                      </div>
                      <div className="bg-background/10 backdrop-blur-sm rounded-lg p-3.5 text-center border border-background/20">
                        <p className="text-xs text-background/70 font-semibold mb-1.5">Coverage</p>
                        <p className="text-xl font-bold">{calculations.coverage}</p>
                        <p className="text-[10px] text-background/60 mt-1">m²</p>
                      </div>
                    </div>
                    <Link href="/products" className="flex items-center justify-center gap-2 w-full py-3 bg-background text-foreground rounded-xl font-semibold text-sm mt-auto hover:bg-background/95 transition-all shadow-md hover:shadow-lg"><LayoutGrid className="w-4 h-4" /> Browse Tiles</Link>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <div className="w-16 h-16 bg-background/10 rounded-xl flex items-center justify-center mb-4">
                      <Calculator className="w-8 h-8 text-background/40" />
                    </div>
                    <p className="text-sm text-background/70 font-medium">Enter dimensions to calculate</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compare Tool */}
          {activeTool === 'compare' && (
            <div>
              <div className="mb-8">
                <h2 className="text-lg font-medium text-foreground mb-2">Select Products to Compare</h2>
                <p className="text-sm text-muted-foreground">Choose up to 4 products</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {compareProducts.map((product) => (
                  <button key={product.id} onClick={() => toggleProduct(product.id)} className={`relative rounded-xl overflow-hidden border-2 transition-all ${selectedProducts.includes(product.id) ? 'border-foreground' : 'border-transparent hover:border-muted-foreground/50'}`}>
                    <div className="aspect-square">
                      <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-sm font-medium text-background">{product.name}</p>
                      <p className="text-xs text-background/70">Rs. {product.price.toLocaleString()}</p>
                    </div>
                    {selectedProducts.includes(product.id) && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-background" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {selectedCompareProducts.length >= 2 && (
                <div className="bg-muted/30 rounded-2xl overflow-hidden">
                  <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedCompareProducts.length}, 1fr)` }}>
                    <div className="p-4 font-medium text-foreground border-b border-border">Specification</div>
                    {selectedCompareProducts.map((product) => (
                      <div key={product.id} className="p-4 border-b border-l border-border text-center">
                        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-16 h-16 rounded-lg object-cover mx-auto mb-2" />
                        <p className="font-medium text-foreground text-sm">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Rs. {product.price.toLocaleString()}</p>
                      </div>
                    ))}
                    {Object.keys(specLabels).map((key) => (
                      <>
                        <div key={`label-${key}`} className="p-4 text-sm text-muted-foreground border-b border-border">{specLabels[key]}</div>
                        {selectedCompareProducts.map((product) => (
                          <div key={`${product.id}-${key}`} className="p-4 border-b border-l border-border text-center text-sm">
                            {typeof product.specs[key as keyof typeof product.specs] === 'boolean' ? (
                              product.specs[key as keyof typeof product.specs] ? <Check className="w-4 h-4 text-foreground mx-auto" /> : <Minus className="w-4 h-4 text-muted-foreground mx-auto" />
                            ) : (
                              <span className="text-foreground">{product.specs[key as keyof typeof product.specs]}</span>
                            )}
                          </div>
                        ))}
                      </>
                    ))}
                  </div>
                </div>
              )}

              {selectedCompareProducts.length < 2 && (
                <div className="text-center py-16 bg-muted/30 rounded-2xl">
                  <Scale className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select at least 2 products to compare</p>
                </div>
              )}
            </div>
          )}

          {/* Area Estimator */}
          {activeTool === 'area' && (
            <div className="text-center py-16 bg-muted/30 rounded-2xl">
              <Ruler className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">Area Estimator</h2>
              <p className="text-muted-foreground max-w-md mx-auto">Calculate material for L-shaped rooms, irregular spaces, and complex layouts. Coming soon.</p>
            </div>
          )}

          {/* Color Visualizer */}
          {activeTool === 'visualizer' && (
            <div className="text-center py-16 bg-muted/30 rounded-2xl">
              <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">Color Visualizer</h2>
              <p className="text-muted-foreground max-w-md mx-auto">Upload a photo of your space and preview how different tiles will look. Coming soon.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
