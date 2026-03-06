'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  ShoppingBag,
  Layers,
  Image,
  Heart,
  MessageSquare,
} from 'lucide-react'
import { useDreams } from '@/contexts/dreams-context'

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/products', icon: ShoppingBag },
  { label: 'Collections', href: '/collections', icon: Layers },
  { label: 'Gallery', href: '/inspiration', icon: Image },
  { label: 'Dreams', href: '/dreams', icon: Heart },
  { label: 'Contact', href: '/contact', icon: MessageSquare },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { getTotalDreams } = useDreams()
  const dreamCount = getTotalDreams()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Hide on admin pages and auth pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
    return null
  }

  return (
    <>
      {/* Spacer */}
      <div className="h-[72px] lg:hidden" />

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        {/* Soft fade-up gradient so content fades behind the bar */}
        <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />

        <div className="mx-3 mb-3 rounded-[22px] border border-border/40 bg-background/75 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]">

          <div className="relative flex items-center justify-around px-1 h-[58px]">
            {navItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              const badge =
                item.href === '/dreams'
                  ? dreamCount
                  : 0

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center justify-center flex-1 h-full group"
                >
                  {/* Active indicator — tiny pill under icon, slides between items */}
                  {active && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute bottom-1.5 w-4 h-[3px] rounded-full bg-foreground/80 dark:bg-foreground/70"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 35,
                        mass: 0.5,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative">
                    <Icon
                      className={`w-[19px] h-[19px] transition-all duration-300 ease-out ${
                        active
                          ? 'text-foreground'
                          : 'text-muted-foreground/60 group-active:text-foreground/70'
                      }`}
                      strokeWidth={active ? 2.2 : 1.6}
                    />

                    {/* Badge */}
                    <AnimatePresence>
                      {badge > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                          className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-[3px] bg-foreground text-background text-[8px] font-bold rounded-full flex items-center justify-center"
                        >
                          {badge > 9 ? '9+' : badge}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[9px] mt-1 font-medium leading-none transition-all duration-300 ${
                      active
                        ? 'text-foreground opacity-100'
                        : 'text-muted-foreground/50 opacity-80'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
