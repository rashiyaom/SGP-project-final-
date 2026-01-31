'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState } from 'react'
import { Calculator, Scale, Ruler, Palette, Check, Minus, ArrowRight } from 'lucide-react'
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-5 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-5">Room Dimensions</h2>
                
                <div className="flex justify-end mb-3">
                  <div className="flex bg-muted rounded-lg p-0.5 border border-border">
                    <button onClick={() => setUnit('cm')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${unit === 'cm' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>cm</button>
                    <button onClick={() => setUnit('m')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${unit === 'm' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>m</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">Length ({unit})</label>
                    <input type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder={unit === 'cm' ? '300' : '3'} className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-base font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground" />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">Width ({unit})</label>
                    <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder={unit === 'cm' ? '400' : '4'} className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-base font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground" />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-xs text-muted-foreground mb-3">Tile Size</label>
                  <div className="flex flex-wrap gap-2">
                    {tileSizeOptions.map((option) => (
                      <button key={option.value} onClick={() => setTileSize(option.value)} className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${tileSize === option.value ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-muted-foreground text-foreground'}`}>{option.label}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-muted-foreground">Wastage Allowance</label>
                    <span className="text-sm font-semibold text-foreground">{wastage}%</span>
                  </div>
                  <input type="range" min="5" max="20" value={wastage} onChange={(e) => setWastage(parseInt(e.target.value))} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground" />
                </div>
              </div>

              <div className="bg-foreground text-background rounded-xl p-5 sm:p-6 flex flex-col">
                <h2 className="text-lg font-medium mb-6">Results</h2>
                {calculations ? (
                  <div className="flex-1 flex flex-col">
                    <div className="text-center py-8 border-b border-background/20 mb-6">
                      <p className="text-xs text-background/60 uppercase tracking-wider mb-2">Tiles Required</p>
                      <p className="text-7xl font-bold">{calculations.tilesNeeded}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center mb-8">
                      <div><p className="text-2xl font-semibold">{calculations.roomArea}</p><p className="text-xs text-background/60">sq.m area</p></div>
                      <div><p className="text-2xl font-semibold">{calculations.boxesNeeded}</p><p className="text-xs text-background/60">boxes</p></div>
                      <div><p className="text-2xl font-semibold">+{calculations.wastageCount}</p><p className="text-xs text-background/60">wastage</p></div>
                    </div>
                    <Link href="/products" className="flex items-center justify-center gap-2 w-full py-3 bg-background text-foreground rounded-lg font-medium text-sm mt-auto">Browse Tiles <ArrowRight className="w-4 h-4" /></Link>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <Calculator className="w-12 h-12 text-background/30 mx-auto mb-4" />
                      <p className="text-sm text-background/60">Enter dimensions to calculate</p>
                    </div>
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
