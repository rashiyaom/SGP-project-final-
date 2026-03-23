'use client'

import { Check, Minus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ComparisonProduct {
  id: string
  name: string
  price: number
  image: string
  features: Record<string, string | boolean>
}

const comparisonProducts: ComparisonProduct[] = []

const comparisonFeatures = [
  { key: 'material', label: 'Material' },
  { key: 'finish', label: 'Finish' },
  { key: 'size', label: 'Size' },
  { key: 'waterAbsorption', label: 'Water Absorption' },
  { key: 'slipResistant', label: 'Slip Resistant' },
  { key: 'floorSuitable', label: 'Floor Use' },
  { key: 'wallSuitable', label: 'Wall Use' },
  { key: 'warranty', label: 'Warranty' },
]

export function ProductComparison({ productId }: { productId: string }) {
  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <div className="inline-flex gap-4 min-w-full pb-4">
        {comparisonProducts.map((product) => (
          <div 
            key={product.id} 
            className={`flex-shrink-0 w-72 border rounded-lg overflow-hidden ${
              product.id === productId ? 'border-foreground' : 'border-border'
            }`}
          >
            {/* Product Header */}
            <div className="relative">
              <div className="aspect-[4/3] bg-muted/20">
                <img 
                  src={product.image || "/placeholder.svg"} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.id === productId && (
                <span className="absolute top-3 left-3 px-2 py-1 bg-foreground text-background text-[10px] uppercase tracking-wider font-medium rounded">
                  Current
                </span>
              )}
            </div>
            
            {/* Product Info */}
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-foreground text-sm">{product.name}</h3>
              <p className="text-lg font-semibold text-foreground mt-1">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            {/* Features */}
            <div className="divide-y divide-border">
              {comparisonFeatures.map((feature) => (
                <div key={feature.key} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">{feature.label}</span>
                  <span className="text-xs font-medium text-foreground">
                    {typeof product.features[feature.key] === 'boolean' ? (
                      product.features[feature.key] ? (
                        <Check className="w-3.5 h-3.5 text-foreground" />
                      ) : (
                        <Minus className="w-3.5 h-3.5 text-muted-foreground/50" />
                      )
                    ) : (
                      product.features[feature.key]
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Action */}
            <div className="p-4">
              <Link 
                href={`/products/${product.id}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium border border-border rounded hover:bg-muted/50 transition-colors text-foreground"
              >
                View Details
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
