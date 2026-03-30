import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware/auth'

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

    // ✅ SECURITY: Users can only see their own cart (unless admin)
    if (auth.user?.role !== 'admin' && auth.user?.email !== email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only view your own cart' },
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

    return NextResponse.json({ success: true, data: user.cart || [] }, { status: 200 })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
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
    const { email, cart } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // ✅ SECURITY: Users can only update their own cart
    if (auth.user?.role !== 'admin' && auth.user?.email !== email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only update your own cart' },
        { status: 403 }
      )
    }

    const user = await User.findOneAndUpdate(
      { email },
      { cart },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: user.cart }, { status: 200 })
  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
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

    // ✅ SECURITY: Users can only clear their own cart
    if (auth.user?.role !== 'admin' && auth.user?.email !== email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only clear your own cart' },
        { status: 403 }
      )
    }

    const user = await User.findOneAndUpdate(
      { email },
      { cart: [] },
      { new: true }
    )

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: [] }, { status: 200 })
  } catch (error) {
    console.error('Clear cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
