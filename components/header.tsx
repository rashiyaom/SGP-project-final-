'use client'

import Link from 'next/link'
import { Menu, X, Sun, Moon, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useCart } from '@/contexts/cart-context'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { getTotalItems } = useCart()
  const cartItemCount = getTotalItems()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products' },
    { label: 'Collections', href: '/collections' },
    { label: 'Gallery', href: '/inspiration' },
    { label: 'Calculator', href: '/tools' },
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
          </nav>

          {/* Right - CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
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
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
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

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-1.5 sm:p-2 bg-background/80 backdrop-blur-sm border border-border hover:bg-muted rounded-full flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-3 bg-background border border-border rounded-2xl p-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm transition-colors ${
                  isActive(item.href)
                    ? 'bg-foreground text-background'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-14 sm:h-20" />
    </>
  )
}
