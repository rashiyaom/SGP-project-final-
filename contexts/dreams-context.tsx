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
  addDream: (dream: Omit<DreamItem, 'savedAt'>) => Promise<void>
  removeDream: (id: string) => Promise<void>
  isDreamSaved: (id: string) => boolean
  getTotalDreams: () => number
  isLoading: boolean
  error: string | null
}

const DreamsContext = createContext<DreamsContextType | undefined>(undefined)

export function DreamsProvider({ children }: { children: React.ReactNode }) {
  const [dreams, setDreams] = useState<DreamItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Load dreams from MongoDB on mount
  useEffect(() => {
    const email = sessionStorage.getItem('userEmail')
    setUserEmail(email)
    if (email) {
      loadDreams(email)
    }
  }, [])

  const loadDreams = async (email: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/users/dreams?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        setDreams(data.data || [])
      }
      setError(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load dreams'
      console.error('Error loading dreams:', err)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const saveDreams = async (dreamItems: DreamItem[]) => {
    if (!userEmail) return

    try {
      await fetch('/api/users/dreams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          dreams: dreamItems
        })
      })
      setError(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save dreams'
      console.error('Error saving dreams:', err)
      setError(errorMsg)
    }
  }

  const addDream = async (dream: Omit<DreamItem, 'savedAt'>) => {
    setDreams((prevDreams) => {
      const existingDream = prevDreams.find((d) => d.id === dream.id)
      let newDreams: DreamItem[]
      
      if (existingDream) {
        newDreams = prevDreams
      } else {
        newDreams = [...prevDreams, { ...dream, savedAt: Date.now() }]
      }
      
      saveDreams(newDreams)
      return newDreams
    })
  }

  const removeDream = async (id: string) => {
    setDreams((prevDreams) => {
      const newDreams = prevDreams.filter((dream) => dream.id !== id)
      saveDreams(newDreams)
      return newDreams
    })
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
        isLoading,
        error
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
