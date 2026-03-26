'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Login via API
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
      const data = await response.json()

      if (data.success) {
        // Store credentials
        sessionStorage.setItem('isAuthenticated', 'true')
        sessionStorage.setItem('userEmail', email)
        sessionStorage.setItem('userName', data.data.name)
        sessionStorage.setItem('userId', data.data._id)

        // Redirect to admin dashboard
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Login failed')
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
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
          <p className="text-muted-foreground text-sm">Login to manage products and settings</p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* Email Input */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@omkar.com"
              disabled={loading}
              className="w-full h-12 px-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all disabled:opacity-50"
              autoFocus
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
              placeholder="Enter password"
              disabled={loading}
              className="w-full h-12 px-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all disabled:opacity-50"
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-[#d4af37] to-[#bfa14a] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
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
