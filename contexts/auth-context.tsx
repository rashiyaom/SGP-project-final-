'use client'

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  name: string
  email: string
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

  // Check authentication status on mount
  useEffect(() => {
    // Read from sessionStorage (not localStorage)
    // sessionStorage is cleared when browser closes (more secure)
    const authStatus = sessionStorage.getItem('isAuthenticated')
    const userEmail = sessionStorage.getItem('userEmail')
    const userName = sessionStorage.getItem('userName')
    const lastActivity = sessionStorage.getItem('lastActivity')

    // Check if session has expired (30 minutes of inactivity)
    if (lastActivity && authStatus === 'true') {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity)
      if (timeSinceLastActivity > sessionTimeout) {
        // Session expired
        handleSessionExpiry()
        return
      }
    }

    if (authStatus === 'true' && userEmail) {
      setUser({
        name: userName || 'User',
        email: userEmail
      })
      setIsAuthenticated(true)
      startSessionTimer()
    }
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
    // Clear sessionStorage (not localStorage)
    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('userName')
    sessionStorage.removeItem('lastActivity')
    sessionStorage.removeItem('userId')
    router.push('/auth/login')
    console.warn('Session expired due to inactivity')
  }

  const updateLastActivity = useCallback(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('lastActivity', Date.now().toString())
      startSessionTimer()
    }
  }, [isAuthenticated, startSessionTimer])

  const login = (email: string, password: string, name?: string) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('Invalid email format')
      return
    }

    // Frontend-only login
    const userData = {
      name: name || email.split('@')[0],
      email: email
    }
    
    setUser(userData)
    setIsAuthenticated(true)
    
    // Store in sessionStorage (cleared on browser close)
    // Real authentication handled by login page using MongoDB
    sessionStorage.setItem('isAuthenticated', 'true')
    sessionStorage.setItem('userEmail', email)
    sessionStorage.setItem('userName', userData.name)
    sessionStorage.setItem('lastActivity', Date.now().toString())
    
    startSessionTimer()
  }

  const logout = () => {
    // Clear session timer
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current)
    }

    setUser(null)
    setIsAuthenticated(false)
    
    // Clear sessionStorage (not localStorage)
    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('userName')
    sessionStorage.removeItem('lastActivity')
    sessionStorage.removeItem('userId')
    
    router.push('/')
  }

  // Function to check if user is authenticated before performing action
  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      // Store the intended action in sessionStorage to execute after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
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
