'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@omkar.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Authenticate with email and password
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isAdmin: true })
      })
      
      const data = await response.json()

      if (data.success && data.data.isAdmin) {
        // Store credentials
        sessionStorage.setItem('isAuthenticated', 'true')
        sessionStorage.setItem('userEmail', email)
        sessionStorage.setItem('userName', data.data.name)
        sessionStorage.setItem('userId', data.data._id)

        // Redirect to admin page
        router.push('/admin')
      } else if (data.success && !data.data.isAdmin) {
        setError('This account is not an admin account')
      } else {
        setError(data.message || 'Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#8b7635] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Secure login required</p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {/* Email Input */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              disabled={loading}
              className="w-full h-12 px-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all disabled:opacity-50"
              autoFocus
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full h-12 px-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all disabled:opacity-50"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-[#d4af37] to-[#bfa14a] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Accessing...' : 'Access Admin Panel'}
          </button>
        </motion.form>

        {/* Info Text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          This is a restricted admin area. Unauthorized access is prohibited.
        </p>
      </motion.div>
    </div>
  )
}
