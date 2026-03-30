import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware/auth'
import { addCorsHeaders, handleCorsOptions } from '@/lib/middleware/cors'
import { logger } from '@/lib/logger'

// Handle CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req)
}

export async function GET(req: NextRequest) {
  try {
    // ✅ SECURITY: Require authentication
    const auth = await requireAuth(req)
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      )
    }

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // ✅ SECURITY: Users can only see their own dreams
    if (auth.user?.role !== 'admin' && auth.user?.email !== email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only view your own dreams' },
        { status: 403 }
      )
    }

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: user.dreams || [] }, { status: 200 })
  } catch (error: any) {
    logger.error('Failed to fetch dreams', { error: error.message }, error as Error, 
      req.headers.get('x-user-email') || undefined)
    let response = NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
    response = addCorsHeaders(response)
    return response
  }
}

export async function PUT(req: NextRequest) {
  try {
    // ✅ SECURITY: Require authentication
    const auth = await requireAuth(req)
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      )
    }

    await dbConnect()

    const body = await req.json()
    const { email, dreams } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // ✅ SECURITY: Users can only update their own dreams
    if (auth.user?.role !== 'admin' && auth.user?.email !== email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only update your own dreams' },
        { status: 403 }
      )
    }

    const user = await User.findOneAndUpdate(
      { email },
      { dreams },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: user.dreams }, { status: 200 })
  } catch (error: any) {
    logger.error('Failed to update dreams', { error: error.message }, error as Error, 
      req.headers.get('x-user-email') || undefined)
    let response = NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
    response = addCorsHeaders(response)
    return response
  }
}
