'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  ShoppingBag,
  Layers,
  Image,
  Calculator,
  Phone,
  Heart,
  ShoppingCart,
} from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useDreams } from '@/contexts/dreams-context'

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/products', icon: ShoppingBag },
  { label: 'Collections', href: '/collections', icon: Layers },
  { label: 'Gallery', href: '/inspiration', icon: Image },
  { label: 'Dreams', href: '/dreams', icon: Heart },
  { label: 'Cart', href: '/cart', icon: ShoppingCart },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const { getTotalDreams } = useDreams()
  const cartItemCount = getTotalItems()
  const dreamCount = getTotalDreams()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const activeIndex = navItems.findIndex((item) => isActive(item.href))

  // Hide on admin pages and auth pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
    return null
  }

  return (
    <>
      {/* Spacer so page content doesn't hide behind the nav */}
      <div className="h-20 lg:hidden" />

      {/* Bottom Nav - only visible on mobile/tablet */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        {/* Frosted glass background */}
        <div className="mx-2 mb-2 rounded-2xl border border-border/60 bg-background/70 backdrop-blur-xl shadow-[0_-4px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.3)]">
          {/* Subtle top shine line */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

          <div className="relative flex items-center justify-around px-1 py-1.5">
            {navItems.map((item, index) => {
              const active = isActive(item.href)
              const Icon = item.icon
              const badge =
                item.href === '/cart'
                  ? cartItemCount
                  : item.href === '/dreams'
                  ? dreamCount
                  : 0

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center justify-center w-full py-1 group"
                >
                  {/* Active pill background with layout animation */}
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        layoutId="bottomNavActiveIndicator"
                        className="absolute inset-0 mx-1 rounded-xl bg-foreground/[0.07] dark:bg-foreground/[0.12]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                          mass: 0.8,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon container */}
                  <div className="relative">
                    <motion.div
                      animate={{
                        y: active ? -2 : 0,
                        scale: active ? 1.15 : 1,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 22,
                      }}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] transition-colors duration-200 ${
                          active
                            ? 'text-foreground'
                            : 'text-muted-foreground group-hover:text-foreground/70'
                        }`}
                        strokeWidth={active ? 2.4 : 1.8}
                      />
                    </motion.div>

                    {/* Badge */}
                    <AnimatePresence>
                      {badge > 0 && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 25,
                          }}
                          className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-gradient-to-br from-[#d4af37] to-[#b8962e] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm"
                        >
                          {badge > 9 ? '9+' : badge}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Label */}
                  <motion.span
                    animate={{
                      opacity: active ? 1 : 0.5,
                      y: active ? 0 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`text-[9px] mt-0.5 font-medium leading-tight ${
                      active ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </motion.span>


                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
