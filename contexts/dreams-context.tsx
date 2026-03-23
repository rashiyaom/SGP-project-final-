'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface DreamItem {
  id: string
  title: string
  category: string
  description: string
  image: string
  style: string
  colorPalette: string
  tileSize: string
  savedAt: number
  // Product-specific optional fields
  type?: 'inspiration' | 'product'
  price?: number
  originalPrice?: number
  rating?: number
  inStock?: boolean
}

interface DreamsContextType {
  dreams: DreamItem[]
  addDream: (dream: Omit<DreamItem, 'savedAt'>) => void
  removeDream: (id: string) => void
  isDreamSaved: (id: string) => boolean
  getTotalDreams: () => number
}

const DreamsContext = createContext<DreamsContextType | undefined>(undefined)

export function DreamsProvider({ children }: { children: React.ReactNode }) {
  const [dreams, setDreams] = useState<DreamItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Load dreams from localStorage on mount
  useEffect(() => {
    try {
      const savedDreams = localStorage.getItem('dreams')
      if (savedDreams) {
        setDreams(JSON.parse(savedDreams))
      }
      setLoadError(null)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load dreams'
      console.error('Error loading dreams:', error)
      setLoadError(errorMsg)
      setDreams([])
    }
    setIsLoaded(true)
  }, [])

  // Save dreams to localStorage whenever they change (with size limit)
  useEffect(() => {
    if (isLoaded) {
      try {
        const dreamsJson = JSON.stringify(dreams)
        // Check localStorage size limit (~5MB = 5242880 bytes)
        if (dreamsJson.length > 4500000) {
          console.warn('Dreams data exceeds 4.5MB limit. Clearing old items.')
          // Keep only newest 100 dreams
          const recentDreams = dreams.slice(-100)
          localStorage.setItem('dreams', JSON.stringify(recentDreams))
        } else {
          localStorage.setItem('dreams', JSON.stringify(dreams))
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded. Keeping only last 50 dreams.')
          const recentDreams = dreams.slice(-50)
          localStorage.setItem('dreams', JSON.stringify(recentDreams))
        } else {
          console.error('Error saving dreams:', error)
        }
      }
    }
  }, [dreams, isLoaded])

  const addDream = (dream: Omit<DreamItem, 'savedAt'>) => {
    setDreams((prevDreams) => {
      const existingDream = prevDreams.find((d) => d.id === dream.id)
      if (existingDream) {
        return prevDreams
      }
      return [...prevDreams, { ...dream, savedAt: Date.now() }]
    })
  }

  const removeDream = (id: string) => {
    setDreams((prevDreams) => prevDreams.filter((dream) => dream.id !== id))
  }

  const isDreamSaved = (id: string) => {
    return dreams.some((dream) => dream.id === id)
  }

  const getTotalDreams = () => {
    return dreams.length
  }

  return (
    <DreamsContext.Provider
      value={{
        dreams,
        addDream,
        removeDream,
        isDreamSaved,
        getTotalDreams,
      }}
    >
      {children}
    </DreamsContext.Provider>
  )
}

export function useDreams() {
  const context = useContext(DreamsContext)
  if (context === undefined) {
    throw new Error('useDreams must be used within a DreamsProvider')
  }
  return context
}
