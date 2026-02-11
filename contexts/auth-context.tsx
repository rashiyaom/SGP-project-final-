'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
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
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated')
    const userEmail = localStorage.getItem('userEmail')
    const userName = localStorage.getItem('userName')

    if (authStatus === 'true' && userEmail) {
      setUser({
        name: userName || 'User',
        email: userEmail
      })
      setIsAuthenticated(true)
    }
  }, [])

  const login = (email: string, password: string, name?: string) => {
    // Frontend-only login
    const userData = {
      name: name || email.split('@')[0],
      email: email
    }
    
    setUser(userData)
    setIsAuthenticated(true)
    
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userEmail', email)
    localStorage.setItem('userName', userData.name)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    
    router.push('/')
  }

  // Function to check if user is authenticated before performing action
  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      // Store the intended action in sessionStorage to execute after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      router.push('/auth/login')
    } else {
      callback()
    }
  }

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
