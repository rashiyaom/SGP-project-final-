import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Auth Middleware - Protects API routes that require authentication
 * Verifies that the user making the request is authenticated
 */
export async function requireAuth(req: NextRequest) {
  try {
    await dbConnect()

    // Get user email from request headers or cookies
    const userEmail = req.headers.get('x-user-email') || 
                     req.cookies.get('userEmail')?.value

    if (!userEmail) {
      return {
        authorized: false,
        error: 'Unauthorized: No email provided',
        status: 401
      }
    }

    // Verify user exists and session is active in MongoDB
    const user = await User.findOne({ email: userEmail })

    if (!user) {
      return {
        authorized: false,
        error: 'Unauthorized: User not found',
        status: 401
      }
    }

    // Check if session is active
    if (!user.session?.isActive) {
      return {
        authorized: false,
        error: 'Unauthorized: Session expired or not active',
        status: 401
      }
    }

    // Check for admin access if needed
    return {
      authorized: true,
      user,
      error: null,
      status: 200
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return {
      authorized: false,
      error: 'Internal server error',
      status: 500
    }
  }
}

/**
 * Admin Auth Middleware - Only allows admin users
 */
export async function requireAdmin(req: NextRequest) {
  const auth = await requireAuth(req)

  if (!auth.authorized) {
    return auth
  }

  // Check if user is admin
  if (auth.user?.role !== 'admin') {
    return {
      authorized: false,
      error: 'Forbidden: Admin access required',
      status: 403
    }
  }

  return auth
}

/**
 * Helper to create unauthorized response
 */
export function unauthorizedResponse(message: string, status: number = 401) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  )
}
