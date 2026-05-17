import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth/session'

/**
 * Auth Middleware - Protects API routes that require authentication
 * Verifies that the user making the request is authenticated
 */
export async function requireAuth(req: NextRequest) {
  try {
    const session = verifySessionToken(req.cookies.get(SESSION_COOKIE_NAME)?.value)

    if (!session) {
      return {
        authorized: false,
        error: 'Unauthorized: Invalid or missing session',
        status: 401,
      }
    }

    await dbConnect()

    // Verify user exists and session is active in MongoDB
    const user = await User.findOne({ email: session.email }).select('-password')

    if (!user) {
      return {
        authorized: false,
        error: 'Unauthorized: User not found',
        status: 401,
      }
    }

    // Check if session is active
    if (!user.session?.isActive) {
      return {
        authorized: false,
        error: 'Unauthorized: Session expired or not active',
        status: 401,
      }
    }

    if (session.role === 'admin' && !user.isAdmin) {
      return {
        authorized: false,
        error: 'Forbidden: Admin access required',
        status: 403,
      }
    }

    // Check for admin access if needed
    return {
      authorized: true,
      user: {
        ...user.toObject(),
        role: user.isAdmin ? 'admin' : 'user',
      },
      error: null,
      status: 200,
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return {
      authorized: false,
      error: 'Internal server error',
      status: 500,
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
      status: 403,
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
