'use client'

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  name: string
  email: string
  _id?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, name?: string) => void
  logout: () => void
  requireAuth: (callback: () => void) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(30 * 60 * 1000) // 30 minutes default
  const router = useRouter()
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Check authentication status on mount - sync with MongoDB
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const email = sessionStorage.getItem('userEmail')
        if (!email) return

        // Fetch user from MongoDB to validate session
        const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`)
        if (!response.ok) {
          handleSessionExpiry()
          return
        }

        const userData = await response.json()
        const lastActivity = userData.session?.lastActivity ? new Date(userData.session.lastActivity).getTime() : Date.now()
        
        // Check if session has expired (30 minutes of inactivity)
        const timeSinceLastActivity = Date.now() - lastActivity
        if (timeSinceLastActivity > sessionTimeout) {
          // Session expired - update MongoDB
          await fetch('/api/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email,
              session: { isActive: false, lastActivity: null, loginTime: null }
            })
          })
          handleSessionExpiry()
          return
        }

        setUser({
          name: userData.name,
          email: userData.email,
          _id: userData._id
        })
        setIsAuthenticated(true)
        startSessionTimer()
      } catch (error) {
        console.error('Error checking auth status:', error)
        handleSessionExpiry()
      }
    }

    checkAuthStatus()
  }, [sessionTimeout])

  const startSessionTimer = useCallback(() => {
    // Clear existing timer
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current)
    }

    // Set new timer
    sessionTimerRef.current = setTimeout(() => {
      handleSessionExpiry()
    }, sessionTimeout)
  }, [sessionTimeout])

  const handleSessionExpiry = () => {
    setUser(null)
    setIsAuthenticated(false)
    // Clear sessionStorage
    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('userName')
    sessionStorage.removeItem('lastActivity')
    sessionStorage.removeItem('userId')
    router.push('/auth/login')
    console.warn('Session expired due to inactivity')
  }

  const updateLastActivity = useCallback(async () => {
    if (!isAuthenticated || !user?.email) return
    
    try {
      // Update MongoDB session last activity
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          session: { 
            isActive: true,
            lastActivity: new Date()
          }
        })
      })
      startSessionTimer()
    } catch (error) {
      console.error('Error updating last activity:', error)
    }
  }, [isAuthenticated, user?.email, startSessionTimer])

  const login = (email: string, password: string, name?: string) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('Invalid email format')
      return
    }

    // Frontend-only login - actual auth handled by login page
    const userData = {
      name: name || email.split('@')[0],
      email: email
    }
    
    setUser(userData)
    setIsAuthenticated(true)
    
    // Store minimal data in sessionStorage (cleared on browser close)
    // Real auth state stored in MongoDB
    sessionStorage.setItem('isAuthenticated', 'true')
    sessionStorage.setItem('userEmail', email)
    sessionStorage.setItem('userName', userData.name)
    
    startSessionTimer()
  }

  const logout = async () => {
    // Clear session timer
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current)
    }

    try {
      // Clear session in MongoDB
      if (user?.email) {
        await fetch('/api/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            session: { isActive: false, lastActivity: null, loginTime: null, redirectAfterLogin: null }
          })
        })
      }
    } catch (error) {
      console.error('Error clearing session:', error)
    }

    setUser(null)
    setIsAuthenticated(false)
    
    // Clear sessionStorage
    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('userName')
    sessionStorage.removeItem('lastActivity')
    sessionStorage.removeItem('userId')
    sessionStorage.removeItem('redirectAfterLogin')
    
    router.push('/')
  }

  // Function to check if user is authenticated before performing action
  const requireAuth = async (callback: () => void) => {
    if (!isAuthenticated) {
      // Store redirect intent in MongoDB for persistence
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/booking'
      try {
        // Temporarily store redirect without email (will be saved on next auth attempt)
        sessionStorage.setItem('redirectAfterLogin', currentPath)
      } catch (error) {
        console.error('Error storing redirect:', error)
      }
      router.push('/auth/login')
    } else {
      callback()
      updateLastActivity()
    }
  }

  // Update activity on user interaction
  useEffect(() => {
    if (!isAuthenticated) return

    const handleUserActivity = () => {
      updateLastActivity()
    }

    window.addEventListener('click', handleUserActivity)
    window.addEventListener('keypress', handleUserActivity)

    return () => {
      window.removeEventListener('click', handleUserActivity)
      window.removeEventListener('keypress', handleUserActivity)
    }
  }, [isAuthenticated, updateLastActivity])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current)
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
