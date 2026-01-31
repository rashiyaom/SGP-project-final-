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
    <section className="relative py-8 sm:py-12 lg:py-16 bg-muted/20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="mb-6 sm:mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
          {/* Calculator Form */}
          <AnimatedSection animation="slide-right" className="lg:col-span-3">
            <div className="bg-background rounded-xl border border-border p-4 sm:p-6">
              {/* Room Dimensions */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                      <Ruler className="w-3.5 h-3.5 text-foreground" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground">Room Dimensions</span>
                  </div>
                  <div className="flex bg-muted rounded-full p-0.5">
                    <button 
                      onClick={() => setUnit('m')} 
                      className={`px-3 py-1 text-[10px] sm:text-xs font-medium rounded-full transition-all ${unit === 'm' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      m
                    </button>
                    <button 
                      onClick={() => setUnit('cm')} 
                      className={`px-3 py-1 text-[10px] sm:text-xs font-medium rounded-full transition-all ${unit === 'cm' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      cm
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] sm:text-xs text-muted-foreground mb-1.5 font-medium">Length ({unit})</label>
                    <input 
                      type="number" 
                      value={length} 
                      onChange={(e) => setLength(e.target.value)} 
                      placeholder={unit === 'cm' ? '300' : '3'} 
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-base sm:text-lg font-semibold placeholder:text-muted-foreground/40 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-muted-foreground mb-1.5 font-medium">Width ({unit})</label>
                    <input 
                      type="number" 
                      value={width} 
                      onChange={(e) => setWidth(e.target.value)} 
                      placeholder={unit === 'cm' ? '400' : '4'} 
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-base sm:text-lg font-semibold placeholder:text-muted-foreground/40 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Tile Size Selection */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                    <Grid3X3 className="w-3.5 h-3.5 text-foreground" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">Tile Size</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {tileSizeOptions.map((option) => (
                    <button 
                      key={option.value} 
                      onClick={() => setTileSize(option.value)} 
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border-2 transition-all ${
                        tileSize === option.value 
                          ? 'border-foreground bg-foreground text-background' 
                          : 'border-border bg-background text-foreground hover:border-muted-foreground'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-semibold">{option.value.split('x')[0]}</span>
                      <span className="text-[9px] sm:text-[10px] opacity-70">×{option.value.split('x')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wastage Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                      <Percent className="w-3.5 h-3.5 text-foreground" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground">Wastage</span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-foreground tabular-nums">{wastagePercent}%</span>
                </div>
                <div className="relative">
                  <input 
                    type="range" 
                    min="5" 
                    max="20" 
                    value={wastagePercent} 
                    onChange={(e) => setWastagePercent(parseInt(e.target.value))} 
                    className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer" 
                  />
                  <div className="flex justify-between text-[9px] sm:text-[10px] text-muted-foreground mt-1.5">
                    <span>5%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Results Panel */}
          <AnimatedSection animation="slide-left" delay={200} className="lg:col-span-2">
            <div className="bg-foreground text-background rounded-xl p-4 sm:p-6 h-full flex flex-col min-h-[350px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-background/10 flex items-center justify-center">
                  <Calculator className="w-3.5 h-3.5 text-background" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Results</span>
              </div>

              {calculations ? (
                <div className="flex-1 flex flex-col">
                  {/* Main Result */}
                  <div className="text-center py-6 mb-4 bg-background/5 rounded-xl">
                    <p className="text-[10px] text-background/50 uppercase tracking-wider mb-0.5">Tiles Required</p>
                    <p className="text-5xl sm:text-6xl font-bold tracking-tight">{calculations.tilesNeeded}</p>
                    <p className="text-xs text-background/50 mt-0.5">pieces</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4 flex-1">
                    <div className="bg-background/5 rounded-lg p-3 text-center">
                      <p className="text-lg sm:text-xl font-bold">{calculations.roomArea}</p>
                      <p className="text-[9px] text-background/50 uppercase tracking-wider mt-0.5">sq.m</p>
                    </div>
                    <div className="bg-background/5 rounded-lg p-3 text-center">
                      <p className="text-lg sm:text-xl font-bold">{calculations.boxesNeeded}</p>
                      <p className="text-[9px] text-background/50 uppercase tracking-wider mt-0.5">boxes</p>
                    </div>
                    <div className="bg-background/5 rounded-lg p-3 text-center">
                      <p className="text-lg sm:text-xl font-bold text-emerald-400">+{calculations.wastageCount}</p>
                      <p className="text-[9px] text-background/50 uppercase tracking-wider mt-0.5">extra</p>
                    </div>
                    <div className="bg-background/5 rounded-lg p-3 text-center">
                      <p className="text-lg sm:text-xl font-bold">{calculations.coverage}</p>
                      <p className="text-[9px] text-background/50 uppercase tracking-wider mt-0.5">coverage</p>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href="/products"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-background text-foreground rounded-lg font-medium text-xs sm:text-sm hover:bg-background/90 transition-colors mt-auto"
                  >
                    Browse Tiles
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                  <div className="w-16 h-16 bg-background/10 rounded-xl flex items-center justify-center mb-3">
                    <Calculator className="w-8 h-8 text-background/30" />
                  </div>
                  <p className="text-background/50 text-xs max-w-[160px] leading-relaxed">
                    Enter dimensions to calculate
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
