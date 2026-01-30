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
    <section className="py-12 sm:py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-2">Quick Tools</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
                Tile Calculator
              </h2>
            </div>
            <Link 
              href="/tools" 
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
            >
              All tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Compact Calculator Form */}
          <AnimatedSection animation="slide-right" className="lg:col-span-2">
            <div className="bg-muted/40 rounded-xl p-5 sm:p-6 border border-border/50">
              {/* Dimensions Row */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    Room Size
                  </label>
                  <div className="flex gap-1.5 bg-background rounded-lg p-1">
                    <button 
                      onClick={() => setUnit('m')} 
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${unit === 'm' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      m
                    </button>
                    <button 
                      onClick={() => setUnit('cm')} 
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${unit === 'cm' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      cm
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number" 
                    value={length} 
                    onChange={(e) => setLength(e.target.value)} 
                    placeholder="Length" 
                    className="px-3.5 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20" 
                  />
                  <input 
                    type="number" 
                    value={width} 
                    onChange={(e) => setWidth(e.target.value)} 
                    placeholder="Width" 
                    className="px-3.5 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20" 
                  />
                </div>
              </div>

              {/* Tile Size Selection */}
              <div className="mb-5">
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
                  <Grid3X3 className="w-4 h-4 text-muted-foreground" />
                  Tile Size (cm)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {tileSizeOptions.map((option) => (
                    <button 
                      key={option.value} 
                      onClick={() => setTileSize(option.value)} 
                      className={`py-2.5 px-1.5 rounded-lg border transition-all text-xs font-medium ${
                        tileSize === option.value 
                          ? 'border-foreground bg-foreground text-background' 
                          : 'border-border bg-background text-foreground hover:border-muted-foreground'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wastage Slider */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Percent className="w-4 h-4 text-muted-foreground" />
                    Wastage
                  </label>
                  <span className="text-sm font-semibold text-foreground">{wastagePercent}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="20" 
                  value={wastagePercent} 
                  onChange={(e) => setWastagePercent(parseInt(e.target.value))} 
                  className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm" 
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Compact Results Panel */}
          <AnimatedSection animation="slide-left" delay={150} className="lg:col-span-1">
            <div className="bg-foreground text-background rounded-xl p-5 sm:p-6 flex flex-col min-h-full">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Results</span>
              </div>

              {calculations ? (
                <div className="flex-1 flex flex-col gap-3">
                  {/* Main Result */}
                  <div className="bg-background/10 rounded-lg p-3.5 text-center">
                    <p className="text-xs text-background/60 uppercase tracking-wider mb-1 font-medium">Tiles</p>
                    <p className="text-4xl font-bold">{calculations.tilesNeeded}</p>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-2.5 flex-1">
                    <div className="bg-background/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-background/60 font-medium mb-1">Area</p>
                      <p className="text-lg font-semibold">{calculations.roomArea}</p>
                      <p className="text-[10px] text-background/50">m²</p>
                    </div>
                    <div className="bg-background/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-background/60 font-medium mb-1">Boxes</p>
                      <p className="text-lg font-semibold">{calculations.boxesNeeded}</p>
                    </div>
                    <div className="bg-background/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-background/60 font-medium mb-1">Waste</p>
                      <p className="text-lg font-semibold text-green-300">+{calculations.wastageCount}</p>
                    </div>
                    <div className="bg-background/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-background/60 font-medium mb-1">Coverage</p>
                      <p className="text-lg font-semibold">{calculations.coverage}</p>
                      <p className="text-[10px] text-background/50">m²</p>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href="/products"
                    className="w-full py-2.5 bg-background text-foreground rounded-lg font-medium text-xs hover:bg-background/90 transition-colors mt-auto text-center"
                  >
                    Browse Tiles
                  </Link>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-background/10 rounded-lg flex items-center justify-center mb-3">
                    <Calculator className="w-6 h-6 text-background/30" />
                  </div>
                  <p className="text-xs text-background/60 leading-relaxed">
                    Enter dimensions
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
