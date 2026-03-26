'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, Mail, Lock, User as UserIcon, Chrome, Apple } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// --- Configuration: Material Themes ---

const THEMES = [
  {
    id: 'statuario',
    name: 'Statuario White',
    type: 'light',
    bgImage: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2000&auto=format&fit=crop",
    accentColor: "bg-stone-900",
    textColor: "text-stone-900",
    subTextColor: "text-stone-600",
    // Ultra-premium glass: Multi-layer frosted effect with enhanced blur
    glassClass: "bg-gradient-to-br from-white/95 via-white/85 to-white/70 backdrop-blur-[60px] backdrop-saturate-[180%]",
    borderClass: "border-white/80 border-t-white/90 border-l-white/90",
    shadowClass: "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.8)_inset]",
    glowClass: "shadow-[0_0_80px_rgba(255,255,255,0.4)]",
    dotColor: "bg-stone-900" 
  },
  {
    id: 'armani',
    name: 'Armani Bronze',
    type: 'warm',
    bgImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    accentColor: "bg-amber-900",
    textColor: "text-amber-950",
    subTextColor: "text-amber-900",
    // Warm frosted glass with bronze tint
    glassClass: "bg-gradient-to-br from-[#f5ede3]/95 via-[#eaddcf]/85 to-[#e8d4c0]/70 backdrop-blur-[60px] backdrop-saturate-[180%]",
    borderClass: "border-[#f5ede3]/70 border-t-[#f5ede3]/90 border-l-[#f5ede3]/90",
    shadowClass: "shadow-[0_20px_60px_-15px_rgba(139,69,19,0.2),0_0_0_1px_rgba(245,237,227,0.8)_inset]",
    glowClass: "shadow-[0_0_80px_rgba(212,175,55,0.3)]",
    dotColor: "bg-amber-900"
  },
  {
    id: 'nero',
    name: 'Nero Marquina',
    type: 'dark',
    bgImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop",
    accentColor: "bg-white",
    textColor: "text-white",
    subTextColor: "text-stone-300",
    // Dark smoked glass with enhanced depth
    glassClass: "bg-gradient-to-br from-black/90 via-black/75 to-black/60 backdrop-blur-[60px] backdrop-saturate-[180%]",
    borderClass: "border-white/20 border-t-white/30 border-l-white/30",
    shadowClass: "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.15)_inset]",
    glowClass: "shadow-[0_0_80px_rgba(255,255,255,0.15)]",
    dotColor: "bg-white"
  }
]

// --- Components ---

const InputField = ({ label, type = "text", theme, id, value, onChange, error }: { 
  label: string, 
  type?: string, 
  theme: any, 
  id: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  error?: string
}) => (
  <div className="relative group mb-6">
    <input 
      type={type} 
      id={id}
      required
      value={value}
      onChange={onChange}
      className={`peer w-full bg-transparent border-b ${error ? 'border-red-500' : theme.type === 'dark' ? 'border-white/20' : 'border-stone-900/15'} py-2.5 ${theme.textColor} focus:outline-none transition-all duration-500 placeholder-transparent font-sans text-sm tracking-wide`}
      placeholder={label}
    />
    <label 
      htmlFor={id}
      className={`absolute left-0 -top-2.5 text-[9px] uppercase tracking-[0.2em] ${error ? 'text-red-500' : theme.subTextColor} transition-all duration-300 
      peer-placeholder-shown:text-xs peer-placeholder-shown:top-2.5 peer-placeholder-shown:tracking-wide peer-placeholder-shown:opacity-60
      peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:tracking-[0.2em] peer-focus:opacity-100 cursor-text font-semibold`}
    >
      {label}
    </label>
    {/* Animated Bottom Border */}
    <div className={`absolute bottom-0 left-0 w-0 h-[1.5px] ${error ? 'bg-red-500' : theme.accentColor} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:w-full`}></div>
    {error && (
      <p className="text-red-500 text-[9px] mt-1.5 tracking-wide">{error}</p>
    )}
  </div>
)

export default function AuthPage() {
  const router = useRouter()
  const [activeThemeIdx, setActiveThemeIdx] = useState(0)
  const [isLogin, setIsLogin] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  
  // Validation errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  })
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  const currentTheme = THEMES[activeThemeIdx]

  useEffect(() => {
    const interval = setInterval(() => {
      handleThemeChange((activeThemeIdx + 1) % THEMES.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [activeThemeIdx])

  const handleThemeChange = (index: number) => {
    if (index === activeThemeIdx) return
    setIsAnimating(true)
    setActiveThemeIdx(index)
    setTimeout(() => setIsAnimating(false), 800)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value
    })
    
    // Clear error when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors({
        ...errors,
        [id]: ''
      })
    }
  }
  
  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: ''
    }
    
    let isValid = true
    
    // Name validation (only for signup)
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required'
      isValid = false
    } else if (!isLogin && formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
      isValid = false
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
      isValid = false
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters for signup'
      isValid = false
    }
    
    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    // MongoDB-based authentication
    if (isLogin) {
      // Login: Verify user in MongoDB with password
      fetch('/api/users?email=' + encodeURIComponent(formData.email) + '&password=' + encodeURIComponent(formData.password))
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Store user info in sessionStorage (cleared on browser close)
            sessionStorage.setItem('isAuthenticated', 'true')
            sessionStorage.setItem('userEmail', formData.email)
            sessionStorage.setItem('userName', data.data.name)
            sessionStorage.setItem('userId', data.data._id)
            
            // Get redirect path from sessionStorage (set by requireAuth)
            const redirectPath = sessionStorage.getItem('redirectAfterLogin')
            
            // Update MongoDB with redirect path for persistence
            const updateData: any = {
              session: {
                isActive: true,
                lastActivity: new Date(),
                loginTime: new Date()
              }
            }
            
            if (redirectPath) {
              updateData.session.redirectAfterLogin = redirectPath
            }
            
            // Update session in MongoDB
            fetch('/api/users', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: formData.email,
                ...updateData
              })
            }).catch(err => console.error('Error updating session:', err))
            
            // Clear redirect from sessionStorage and navigate
            if (redirectPath) {
              sessionStorage.removeItem('redirectAfterLogin')
              router.push(redirectPath)
            } else {
              router.push('/')
            }
          } else if (data.error === 'Invalid password') {
            setErrors({ ...errors, password: 'Incorrect password' })
          } else if (data.error === 'User not found') {
            setErrors({ ...errors, email: 'User not found' })
          } else {
            setErrors({ ...errors, email: data.error || 'Login failed' })
          }
          setIsLoading(false)
        })
        .catch(err => {
          console.error('Login error:', err)
          setErrors({ ...errors, email: 'Login failed' })
          setIsLoading(false)
        })
    } else {
      // Signup: Create new user in MongoDB
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Store user info in sessionStorage
            sessionStorage.setItem('isAuthenticated', 'true')
            sessionStorage.setItem('userEmail', formData.email)
            sessionStorage.setItem('userName', formData.name)
            sessionStorage.setItem('userId', data.data._id)
            
            // Get redirect path from sessionStorage
            const redirectPath = sessionStorage.getItem('redirectAfterLogin')
            
            // Update MongoDB with initial session data
            const updateData: any = {
              session: {
                isActive: true,
                lastActivity: new Date(),
                loginTime: new Date()
              }
            }
            
            if (redirectPath) {
              updateData.session.redirectAfterLogin = redirectPath
            }
            
            // Update session in MongoDB
            fetch('/api/users', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: formData.email,
                ...updateData
              })
            }).catch(err => console.error('Error updating session:', err))
            
            // Clear redirect and navigate
            if (redirectPath) {
              sessionStorage.removeItem('redirectAfterLogin')
              router.push(redirectPath)
            } else {
              router.push('/')
            }
          } else if (data.error === 'User already exists') {
            setErrors({ ...errors, email: 'Email already registered' })
          } else {
            setErrors({ ...errors, email: data.error || 'Signup failed' })
          }
          setIsLoading(false)
        })
        .catch(err => {
          console.error('Signup error:', err)
          setErrors({ ...errors, email: 'Signup failed' })
          setIsLoading(false)
        })
    }
  }
  
  const handleSocialLogin = (provider: 'google' | 'apple') => {
    setIsLoading(true)
    
    // Simulate social login with MongoDB
    const email = `${Math.random().toString(36).substring(7)}@${provider}.com`
    const name = provider === 'google' ? 'Google User' : 'Apple User'
    
    // Try to create or find user
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        password: Math.random().toString(36).substring(2, 15) // Random password for social login
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success || data.error === 'User already exists') {
          sessionStorage.setItem('isAuthenticated', 'true')
          sessionStorage.setItem('userName', name)
          sessionStorage.setItem('userEmail', email)
          
          const redirectPath = sessionStorage.getItem('redirectAfterLogin')
          if (redirectPath) {
            sessionStorage.removeItem('redirectAfterLogin')
            router.push(redirectPath)
          } else {
            router.push('/')
          }
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Social login error:', err)
        setIsLoading(false)
      })
  }

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans bg-stone-900 selection:bg-white/20">
      
      {/* Background Layer with Transitions */}
      {THEMES.map((theme, index) => (
        <div 
          key={theme.id}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === activeThemeIdx ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'}`}
        >
          <img 
            src={theme.bgImage} 
            alt={theme.name}
            className={`w-full h-full object-cover transition-transform duration-[12000ms] ease-linear ${index === activeThemeIdx ? 'scale-110' : 'scale-100'}`}
          />
          <div className={`absolute inset-0 ${theme.type === 'dark' ? 'bg-black/50' : 'bg-black/20'}`}></div>
        </div>
      ))}

      {/* Main Content Layout */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
        
        {/* Left Side: Brand & Atmosphere */}
        <div className="w-full md:w-1/2 p-8 md:p-20 flex flex-col justify-between items-start">
          
          {/* Minimal Logo with Link */}
          <Link href="/" className="py-2.5 rounded-sm hover:opacity-80 transition-opacity">
            <span className={`text-[12px] tracking-[0.4em] font-bold uppercase text-white drop-shadow-md`}>
              Omkar
            </span>
          </Link>

          <div className="hidden md:block max-w-lg pl-2">
             <div className="overflow-hidden mb-6">
                <h1 className={`text-6xl lg:text-8xl font-serif text-white leading-[0.9] drop-shadow-2xl transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isAnimating ? 'translate-y-[120%] opacity-0' : 'translate-y-0 opacity-100'}`}>
                  {currentTheme.name.split(' ')[0]}
                </h1>
             </div>
             <div className={`h-px w-16 bg-white/50 mb-6 transition-all duration-1000 ${isAnimating ? 'w-0' : 'w-16'}`}></div>
             <p className="text-white/90 text-base mb-8 leading-relaxed">
               Experience the finest collection of premium tiles and surfaces. Transform your space with timeless elegance.
             </p>
             
             {/* Feature List */}
             <div className="space-y-4 mb-8">
               <div className="flex items-start gap-3">
                 <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                   <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="text-white font-medium text-sm mb-1">Curated Collections</h3>
                   <p className="text-white/60 text-xs">Handpicked premium materials from around the world</p>
                 </div>
               </div>
               
               <div className="flex items-start gap-3">
                 <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                   <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="text-white font-medium text-sm mb-1">Expert Consultation</h3>
                   <p className="text-white/60 text-xs">Get personalized design advice from professionals</p>
                 </div>
               </div>
               
               <div className="flex items-start gap-3">
                 <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                   <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="text-white font-medium text-sm mb-1">Seamless Experience</h3>
                   <p className="text-white/60 text-xs">From selection to installation, we've got you covered</p>
                 </div>
               </div>
             </div>
             
             <p className="text-white/80 text-[10px] tracking-[0.3em] uppercase font-medium">
               Premium Surfaces
             </p>
          </div>

          {/* Minimal Navigation Dots */}
          <div className="flex gap-4 items-center">
            {THEMES.map((theme, idx) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(idx)}
                className="group relative p-2 focus:outline-none"
                aria-label={`Switch to ${theme.name}`}
              >
                 <div className={`
                    w-2 h-2 rounded-full transition-all duration-500
                    ${idx === activeThemeIdx ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/80'}
                 `}></div>
                 {/* Active Ring */}
                 <div className={`
                    absolute inset-0 border border-white/30 rounded-full transition-all duration-500
                    ${idx === activeThemeIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                 `}></div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Floating Glass Card */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          
          {/* The Premium Glass Card */}
          <div className={`
            relative w-full max-w-[380px] 
            ${currentTheme.glassClass} 
            ${currentTheme.glowClass}
            border ${currentTheme.borderClass}
            ${currentTheme.shadowClass}
            p-8 md:p-10 
            transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
            rounded-2xl overflow-hidden
            hover:scale-[1.01] hover:shadow-[0_25px_70px_-20px_rgba(0,0,0,0.25)]
          `}>
             
             {/* Multi-layer Glass Effect */}
             {/* Layer 1: Reflective Sheen (Top-Left Light Source) */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none rounded-3xl"></div>
             
             {/* Layer 2: Bottom Highlight (Depth) */}
             <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent pointer-events-none rounded-3xl"></div>
             
             {/* Layer 3: Edge Glow (Premium Frosted Border) */}
             <div className={`absolute inset-0 rounded-3xl pointer-events-none ${currentTheme.type === 'dark' ? 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]' : 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]'}`}></div>

             {/* Layer 4: Subtle Grain Texture for Realism */}
             <div 
               className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay rounded-3xl"
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
             ></div>
             
             {/* Layer 5: Radial Glow from Center (Ambient Light) */}
             <div className={`absolute inset-0 pointer-events-none rounded-3xl ${currentTheme.type === 'dark' ? 'bg-gradient-radial from-white/5 via-transparent to-transparent' : 'bg-gradient-radial from-white/10 via-transparent to-transparent'}`}></div>
             
             {/* Content */}
             <div className="relative z-10">
                <div className="mb-6 text-center md:text-left">
                    <h2 className={`text-2xl font-serif mb-1 ${currentTheme.textColor} tracking-tight`}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className={`text-xs ${currentTheme.subTextColor} mb-3`}>
                        {isLogin ? 'Sign in to continue' : 'Join our community'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <InputField 
                          label="Full Name" 
                          theme={currentTheme} 
                          id="name" 
                          value={formData.name}
                          onChange={handleInputChange}
                          error={errors.name}
                        />
                    )}
                    
                    <InputField 
                      label="Email Address" 
                      type="email" 
                      theme={currentTheme} 
                      id="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                    />
                    <InputField 
                      label="Password" 
                      type="password" 
                      theme={currentTheme} 
                      id="password" 
                      value={formData.password}
                      onChange={handleInputChange}
                      error={errors.password}
                    />

                    {isLogin && (
                      <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center gap-1.5 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className={`w-3.5 h-3.5 rounded border ${currentTheme.type === 'dark' ? 'border-white/30' : 'border-stone-900/30'} transition-all`}
                          />
                          <span className={`text-[10px] ${currentTheme.subTextColor} group-hover:opacity-100 opacity-70 transition-opacity`}>
                            Remember me
                          </span>
                        </label>
                      </div>
                    )}

                    {!isLogin && (
                      <div className={`mb-4 p-2.5 rounded-lg ${currentTheme.type === 'dark' ? 'bg-white/5' : 'bg-stone-900/5'}`}>
                        <p className={`text-[9px] ${currentTheme.subTextColor} leading-relaxed`}>
                          By signing up, you agree to our Terms & Privacy Policy
                        </p>
                      </div>
                    )}

                    <div className="pt-2">
                        <button 
                          type="submit"
                          disabled={isLoading}
                          className={`w-full group relative overflow-hidden py-3 ${currentTheme.accentColor} transition-all duration-500 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.4)] rounded-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${currentTheme.type === 'dark' ? 'from-white/0 via-white/20 to-white/0' : 'from-white/0 via-white/30 to-white/0'} translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                            <span className={`relative flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase ${currentTheme.type === 'dark' ? 'text-stone-900' : 'text-white'}`}>
                                {isLoading ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                  </div>
                                ) : (
                                  <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                                  </>
                                )}
                            </span>
                        </button>
                    </div>
                </form>

                <div className="mt-6 flex justify-between items-center border-t border-opacity-10 pt-4" style={{ borderColor: currentTheme.type === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                    <button 
                        onClick={() => {
                          setIsLogin(!isLogin)
                          setFormData({ name: '', email: '', password: '' })
                          setErrors({ name: '', email: '', password: '' })
                        }}
                        className={`text-[9px] font-bold uppercase tracking-[0.2em] ${currentTheme.textColor} hover:opacity-60 transition-all duration-300`}
                    >
                        {isLogin ? 'Create Account' : 'Back to Login'}
                    </button>
                    
                    {isLogin && (
                        <Link 
                          href="/auth/reset-password" 
                          className={`text-[9px] uppercase tracking-[0.2em] ${currentTheme.subTextColor} hover:opacity-100 opacity-60 transition-all duration-300 font-medium`}
                        >
                            Forgot?
                        </Link>
                    )}
                </div>

                {/* Minimal Social Login at Bottom */}
                <div className="mt-4 pt-4 border-t border-opacity-10" style={{ borderColor: currentTheme.type === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                    <p className={`text-[8px] uppercase tracking-widest text-center mb-3 ${currentTheme.subTextColor} opacity-50`}>
                      Or continue with
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin('google')}
                        disabled={isLoading}
                        className={`group flex items-center justify-center w-10 h-10 rounded-full border ${currentTheme.type === 'dark' ? 'border-white/10 hover:border-white/30' : 'border-stone-900/10 hover:border-stone-900/30'} transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
                        title="Continue with Google"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleSocialLogin('apple')}
                        disabled={isLoading}
                        className={`group flex items-center justify-center w-10 h-10 rounded-full border ${currentTheme.type === 'dark' ? 'border-white/10 hover:border-white/30' : 'border-stone-900/10 hover:border-stone-900/30'} transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
                        title="Continue with Apple"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path className={currentTheme.textColor} d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                      </button>
                    </div>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  )
}
