'use client'

import Link from 'next/link'
import { Sun, Moon, ShoppingCart, Heart, User, LogOut } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useCart } from '@/contexts/cart-context'
import { useDreams } from '@/contexts/dreams-context'
import { useAuth } from '@/contexts/auth-context'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { getTotalItems } = useCart()
  const { getTotalDreams } = useDreams()
  const { user, isAuthenticated, logout } = useAuth()
  const cartItemCount = getTotalItems()
  const dreamCount = getTotalDreams()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  // Close dropdown on route change
  useEffect(() => {
    setShowUserMenu(false)
  }, [pathname])

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products' },
    { label: 'Gallery', href: '/inspiration' },
    { label: 'Calculator', href: '/calculator' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-12 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 sm:gap-4">
          {/* Left - Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 bg-background/80 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1.5 sm:py-2 border border-border flex-shrink-0">
            <div className="w-6 sm:w-7 h-6 sm:h-7 bg-foreground rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-background font-bold text-[10px] sm:text-xs">O</span>
            </div>
            <span className="font-serif text-sm sm:text-base text-foreground hidden sm:block">Omkar</span>
          </Link>

          {/* Center - Pill Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-1 bg-background/80 backdrop-blur-sm border border-border rounded-full px-1 py-1 flex-shrink-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                  isActive(item.href)
                    ? 'bg-foreground text-background' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>          {/* Right - CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">            {/* Dreams Button */}
            <Link
              href="/dreams"
              className="relative p-2 sm:p-2.5 bg-background/80 backdrop-blur-sm border border-border hover:bg-muted rounded-full transition-all duration-200 flex-shrink-0"
              title="View saved dreams"
            >
              <Heart className="w-4 h-4 text-foreground" />
              {dreamCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs font-bold rounded-full flex items-center justify-center">
                  {dreamCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2 sm:p-2.5 bg-background/80 backdrop-blur-sm border border-border hover:bg-muted rounded-full transition-all duration-200 flex-shrink-0"
            >
              <ShoppingCart className="w-4 h-4 text-foreground" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark')
              }}
              className="p-2 sm:p-2.5 bg-background/80 backdrop-blur-sm border border-border hover:bg-muted rounded-full transition-all duration-200 flex-shrink-0"
              aria-label={mounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode` : 'Toggle theme'}
            >
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-foreground transition-transform duration-200 hover:rotate-12" />
                ) : (
                  <Moon className="w-4 h-4 text-foreground transition-transform duration-200 hover:-rotate-12" />
                )
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>

            {/* User Profile / Login Button */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 bg-background/80 backdrop-blur-sm border border-border hover:bg-muted rounded-full transition-all duration-200 flex-shrink-0"
                  aria-label="User menu"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-[#d4af37] to-[#8b7635] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs uppercase">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-foreground max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      href="/profile?tab=wishlist"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#d4af37] to-[#bfa14a] text-white text-sm font-semibold rounded-full hover:shadow-lg transition-all duration-200 flex-shrink-0"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

          </div>
        </div>
      </header>
      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-14 sm:h-20" />
    </>
  )
}
