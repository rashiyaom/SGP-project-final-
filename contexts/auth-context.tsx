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
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string, name?: string) => void
  logout: () => void
  requireAuth: (callback: () => void) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(30 * 60 * 1000) // 30 minutes default
  const router = useRouter()
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Check authentication status on mount - sync with MongoDB
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const email = sessionStorage.getItem('userEmail')
        if (!email) {
          setLoading(false);
          return
        }

        // Fetch user from MongoDB to validate session
        const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`)
        if (!response.ok) {
          handleSessionExpiry()
          return
        }

        const userData = await response.json()

        // Check for admin role
        if (userData.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

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

        setUser({ name: userData.name, email: userData.email, _id: userData._id })
        setIsAuthenticated(true)
        resetSessionTimer()
      } catch (error) {
        console.error('Auth check failed:', error)
        handleSessionExpiry()
      } finally {
        setLoading(false);
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

  const resetSessionTimer = useCallback(() => {
    startSessionTimer();
  }, [startSessionTimer]);

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
    const email = sessionStorage.getItem('userEmail')
    if (!isAuthenticated || !email) return
    
    try {
      // Update MongoDB session last activity
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
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
  }, [isAuthenticated, startSessionTimer])

  const login = useCallback(
    async (email: string, password: string, name?: string) => {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        })

        const data = await response.json()

        if (response.ok) {
          setUser({ name: data.name, email: data.email, _id: data._id })
          setIsAuthenticated(true)
          sessionStorage.setItem('userEmail', data.email)
          
          if (data.role === 'admin') {
            setIsAdmin(true);
          }

          // Update session in MongoDB
          await fetch('/api/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: data.email,
              session: { isActive: true, lastActivity: new Date() }
            })
          })
        } else {
          console.error('Login failed:', data.message)
        }
      } catch (error) {
        console.error('Error during login:', error)
      }
    },
    []
  )

  const logout = useCallback(async () => {
    const email = sessionStorage.getItem('userEmail')
    if (email) {
      try {
        // Clear session in MongoDB
        await fetch(
          '/api/users',
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, session: { isActive: false } })
          }
        )
      } catch (error) {
        console.error('Failed to update session on logout:', error)
      }
    }

    setUser(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    sessionStorage.removeItem('userEmail')
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current)
    }
    router.push('/')
  }, [])

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

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
    requireAuth
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
