'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter, usePathname } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = false }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', pathname)
      router.push('/auth/login')
    }
  }, [isAuthenticated, requireAuth, pathname, router])

  if (requireAuth && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}
