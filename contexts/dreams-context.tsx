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

  // Load dreams from localStorage on mount
  useEffect(() => {
    const savedDreams = localStorage.getItem('dreams')
    if (savedDreams) {
      try {
        setDreams(JSON.parse(savedDreams))
      } catch (error) {
        console.error('Error loading dreams:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save dreams to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('dreams', JSON.stringify(dreams))
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
