'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Calculator, Ruler, Grid3X3, Box, Percent, LayoutGrid } from 'lucide-react'
import { AnimatedSection } from './animated-section'

const tileSizeOptions = [
  { value: '30x30', label: '30x30 cm', area: 0.09 },
  { value: '60x60', label: '60x60 cm', area: 0.36 },
  { value: '60x120', label: '60x120 cm', area: 0.72 },
  { value: '80x80', label: '80x80 cm', area: 0.64 },
  { value: '120x120', label: '120x120 cm', area: 1.44 },
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
    <section className="py-16 sm:py-24 lg:py-32 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="mb-10 sm:mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">Planning Tools</p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground">
                Tile <span className="italic">Calculator</span>
              </h2>
            </div>
            <Link 
              href="/tools" 
              className="inline-flex items-center gap-2 text-sm text-foreground hover:text-foreground/70 transition-colors group"
            >
              More tools
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Calculator Form */}
          <AnimatedSection animation="slide-right" className="lg:col-span-3">
            <div className="bg-background rounded-2xl border border-border p-5 sm:p-8">
              {/* Room Dimensions */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Ruler className="w-4 h-4 text-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Room Dimensions</span>
                  </div>
                  <div className="flex bg-muted rounded-full p-1">
                    <button 
                      onClick={() => setUnit('m')} 
                      className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${unit === 'm' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Meters
                    </button>
                    <button 
                      onClick={() => setUnit('cm')} 
                      className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${unit === 'cm' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      CM
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2 font-medium">Length ({unit})</label>
                    <input 
                      type="number" 
                      value={length} 
                      onChange={(e) => setLength(e.target.value)} 
                      placeholder={unit === 'cm' ? '300' : '3'} 
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground text-lg font-semibold placeholder:text-muted-foreground/40 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2 font-medium">Width ({unit})</label>
                    <input 
                      type="number" 
                      value={width} 
                      onChange={(e) => setWidth(e.target.value)} 
                      placeholder={unit === 'cm' ? '400' : '4'} 
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground text-lg font-semibold placeholder:text-muted-foreground/40 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Tile Size Selection */}
              <div className="mb-8">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Grid3X3 className="w-4 h-4 text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Tile Size</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {tileSizeOptions.map((option) => (
                    <button 
                      key={option.value} 
                      onClick={() => setTileSize(option.value)} 
                      className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all ${
                        tileSize === option.value 
                          ? 'border-foreground bg-foreground text-background' 
                          : 'border-border bg-background text-foreground hover:border-muted-foreground'
                      }`}
                    >
                      <span className="text-sm font-semibold">{option.value.split('x')[0]}</span>
                      <span className="text-[10px] opacity-70">x{option.value.split('x')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wastage Slider */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Percent className="w-4 h-4 text-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Wastage Allowance</span>
                  </div>
                  <span className="text-lg font-bold text-foreground tabular-nums">{wastagePercent}%</span>
                </div>
                <div className="relative">
                  <input 
                    type="range" 
                    min="5" 
                    max="20" 
                    value={wastagePercent} 
                    onChange={(e) => setWastagePercent(parseInt(e.target.value))} 
                    className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer" 
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                    <span>5% (Simple Layout)</span>
                    <span>20% (Complex Pattern)</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Results Panel */}
          <AnimatedSection animation="slide-left" delay={200} className="lg:col-span-2">
            <div className="bg-foreground text-background rounded-2xl p-5 sm:p-8 h-full flex flex-col min-h-[400px]">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-background" />
                </div>
                <span className="text-sm font-medium">Calculation Results</span>
              </div>

              {calculations ? (
                <div className="flex-1 flex flex-col">
                  {/* Main Result */}
                  <div className="text-center py-8 mb-6 bg-background/5 rounded-2xl">
                    <p className="text-xs text-background/50 uppercase tracking-wider mb-1">Tiles Required</p>
                    <p className="text-7xl font-bold tracking-tight">{calculations.tilesNeeded}</p>
                    <p className="text-sm text-background/50 mt-1">pieces total</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
                    <div className="bg-background/5 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold">{calculations.roomArea}</p>
                      <p className="text-[10px] text-background/50 uppercase tracking-wider mt-1">sq.m area</p>
                    </div>
                    <div className="bg-background/5 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold">{calculations.boxesNeeded}</p>
                      <p className="text-[10px] text-background/50 uppercase tracking-wider mt-1">boxes</p>
                    </div>
                    <div className="bg-background/5 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-400">+{calculations.wastageCount}</p>
                      <p className="text-[10px] text-background/50 uppercase tracking-wider mt-1">wastage</p>
                    </div>
                    <div className="bg-background/5 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold">{calculations.coverage}</p>
                      <p className="text-[10px] text-background/50 uppercase tracking-wider mt-1">coverage</p>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href="/products"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-background text-foreground rounded-xl font-medium text-sm hover:bg-background/90 transition-colors mt-auto"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Browse Matching Tiles
                  </Link>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="w-20 h-20 bg-background/10 rounded-2xl flex items-center justify-center mb-5">
                    <Calculator className="w-10 h-10 text-background/30" />
                  </div>
                  <p className="text-background/50 text-sm max-w-[180px] leading-relaxed">
                    Enter your room dimensions to calculate tiles needed
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
