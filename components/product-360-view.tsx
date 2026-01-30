'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Product360View({ productId }: { productId: string }) {
  const [rotation, setRotation] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isAutoRotating, setIsAutoRotating] = useState(false)

  const handleRotate = (direction: 'left' | 'right') => {
    setRotation((prev) => {
      const newRotation = direction === 'right' ? prev + 15 : prev - 15
      return newRotation >= 360 ? 0 : newRotation < 0 ? 360 + newRotation : newRotation
    })
  }

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating)
  }

  return (
    <div className="space-y-4">
      {/* Main 360 View Container */}
      <div className="relative bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden aspect-square flex items-center justify-center group">
        {/* Product Display */}
        <div
          className="text-9xl transition-transform duration-300"
          style={{
            transform: `rotateY(${rotation}deg) scale(${zoomLevel / 100})`,
          }}
        >
          🪨
        </div>

        {/* Rotation Info */}
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-2 rounded text-xs font-semibold">
          {rotation}°
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => handleRotate('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <button
          onClick={() => handleRotate('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Rotation Slider */}
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-2 block">
            Rotate: {rotation}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>

        {/* Zoom Slider */}
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-2 block">
            Zoom: {zoomLevel}%
          </label>
          <input
            type="range"
            min="50"
            max="200"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => handleRotate('left')}
            className="border-border hover:bg-muted"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Rotate Left
          </Button>
          <Button
            variant="outline"
            onClick={toggleAutoRotate}
            className={`border-border ${
              isAutoRotating
                ? 'bg-accent text-foreground hover:bg-accent/90'
                : 'hover:bg-muted'
            }`}
          >
            <RotateCw className={`w-4 h-4 mr-2 ${isAutoRotating ? 'animate-spin' : ''}`} />
            Auto
          </Button>
          <Button
            variant="outline"
            onClick={() => handleRotate('right')}
            className="border-border hover:bg-muted"
          >
            Rotate Right
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={() => {
            setRotation(0)
            setZoomLevel(100)
            setIsAutoRotating(false)
          }}
          className="w-full border-border hover:bg-muted"
        >
          Reset View
        </Button>
      </div>

      {/* Info */}
      <div className="bg-muted/20 rounded-lg p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground mb-2">360° Product View</p>
        <p>
          Use the controls above to rotate and zoom the product. Get a complete view of the tile texture, finish, and details from every angle.
        </p>
      </div>
    </div>
  )
}
