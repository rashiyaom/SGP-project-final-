'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Calculator, Ruler, Grid3X3, Percent } from 'lucide-react'
import { AnimatedSection } from './animated-section'

const tileSizeOptions = [
  { value: '30x30', label: '30x30', area: 0.09 },
  { value: '60x60', label: '60x60', area: 0.36 },
  { value: '60x120', label: '60x120', area: 0.72 },
  { value: '80x80', label: '80x80', area: 0.64 },
  { value: '120x120', label: '120x120', area: 1.44 },
]

export function CalculatorSection() {
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [tileSize, setTileSize] = useState('60x60')
  const [wastagePercent, setWastagePercent] = useState(10)
  const [unit, setUnit] = useState<'cm' | 'm'>('m')

  const calculations = useMemo(() => {
    if (!length || !width) return null
    
    let l = parseFloat(length)
    let w = parseFloat(width)
    
    if (unit === 'cm') {
      l = l / 100
      w = w / 100
    }
    
    const roomArea = l * w
    const selectedTile = tileSizeOptions.find(t => t.value === tileSize)
    if (!selectedTile) return null
    
    const tileArea = selectedTile.area
    const tilesWithoutWastage = roomArea / tileArea
    const tilesWithWastage = Math.ceil(tilesWithoutWastage * (1 + wastagePercent / 100))
    const wastageCount = tilesWithWastage - Math.ceil(tilesWithoutWastage)
    const boxesNeeded = Math.ceil(tilesWithWastage / 4)

    return {
      roomArea: roomArea.toFixed(2),
      tilesExact: tilesWithoutWastage.toFixed(1),
      tilesNeeded: tilesWithWastage,
      wastageCount,
      boxesNeeded,
      coverage: (tilesWithWastage * tileArea).toFixed(2)
    }
  }, [length, width, tileSize, wastagePercent, unit])

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-background via-background to-muted/20 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">Planning Tools</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Calculate Your Tile Needs
              </h2>
              <p className="text-sm text-muted-foreground mt-2">Get precise estimates for your project</p>
            </div>
            <Link 
              href="/tools" 
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg font-medium text-sm hover:bg-foreground/90 transition-colors whitespace-nowrap"
            >
              All tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Calculator Form */}
          <AnimatedSection animation="slide-right" className="lg:col-span-2">
            <div className="bg-white/50 dark:bg-muted/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-6">
                {/* Room Dimensions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2.5">
                      <Ruler className="w-4 h-4 text-foreground/60" />
                      Room Dimensions
                    </label>
                    <div className="inline-flex gap-1 bg-muted rounded-full p-1 border border-border">
                      <button 
                        onClick={() => setUnit('m')} 
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${unit === 'm' ? 'bg-foreground text-background shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}
                      >
                        Meters
                      </button>
                      <button 
                        onClick={() => setUnit('cm')} 
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${unit === 'cm' ? 'bg-foreground text-background shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}
                      >
                        CM
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted-foreground font-medium mb-1.5">Length ({unit})</label>
                      <input 
                        type="number" 
                        value={length} 
                        onChange={(e) => setLength(e.target.value)} 
                        placeholder={unit === 'cm' ? '300' : '3'} 
                        className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground font-medium mb-1.5">Width ({unit})</label>
                      <input 
                        type="number" 
                        value={width} 
                        onChange={(e) => setWidth(e.target.value)} 
                        placeholder={unit === 'cm' ? '400' : '4'} 
                        className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all" 
                      />
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
                      <button 
                        key={option.value} 
                        onClick={() => setTileSize(option.value)} 
                        className={`py-3 px-2 rounded-lg border-2 transition-all text-xs font-semibold ${
                          tileSize === option.value 
                            ? 'border-foreground bg-foreground text-background' 
                            : 'border-border bg-background text-foreground hover:border-foreground/50'
                        }`}
                      >
                        {option.label}
                      </button>
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
                    <span className="text-lg font-bold text-foreground bg-muted/40 px-3 py-1 rounded-full">{wastagePercent}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="20" 
                    value={wastagePercent} 
                    onChange={(e) => setWastagePercent(parseInt(e.target.value))} 
                    className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all" 
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-2.5">
                    <span>5% (Simple)</span>
                    <span>20% (Complex)</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Results Panel */}
          <AnimatedSection animation="slide-left" delay={150} className="lg:col-span-1">
            <div className="bg-gradient-to-br from-foreground to-foreground/95 text-background rounded-2xl p-6 sm:p-8 flex flex-col min-h-full shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-background/15 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-background/80" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Results</span>
              </div>

              {calculations ? (
                <div className="flex-1 flex flex-col gap-4">
                  {/* Main Result */}
                  <div className="bg-background/10 backdrop-blur-sm rounded-xl p-5 text-center border border-background/20">
                    <p className="text-xs text-background/70 uppercase tracking-wider mb-2 font-semibold">Tiles Required</p>
                    <p className="text-5xl font-black tracking-tight">{calculations.tilesNeeded}</p>
                    <p className="text-xs text-background/60 mt-1.5">pieces total</p>
                  </div>

                  {/* Quick Stats Grid */}
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

                  {/* Action Button */}
                  <Link
                    href="/products"
                    className="w-full py-3 bg-background text-foreground rounded-xl font-semibold text-sm hover:bg-background/95 transition-all shadow-md hover:shadow-lg mt-auto"
                  >
                    Browse Matching Tiles
                  </Link>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="w-16 h-16 bg-background/10 rounded-xl flex items-center justify-center mb-4">
                    <Calculator className="w-8 h-8 text-background/40" />
                  </div>
                  <p className="text-sm text-background/70 font-medium leading-relaxed">
                    Enter room dimensions to calculate tiles needed
                  </p>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
