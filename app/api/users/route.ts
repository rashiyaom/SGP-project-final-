import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const password = searchParams.get('password')

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Include password only if password param provided (login attempt)
    let query = User.findOne({ email })
    if (!password) {
      query = query.select('-password') // Hide password for non-login requests
    }

    const user = await query

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // If password provided, verify it
    if (password) {
      if (user.password !== password) {
        return NextResponse.json(
          { success: false, error: 'Invalid password' },
          { status: 401 }
        )
      }
      // Return user without password
      const userObj = user.toObject()
      delete userObj.password
      return NextResponse.json({ success: true, data: userObj }, { status: 200 })
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const { email, name, password } = body

    if (!email || !name || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const user = await User.create({
      email,
      name,
      password,
      cart: [],
      dreams: [],
      wishlist: [],
      profile: {},
      adminData: {
        products: [],
        gallery: [],
        filters: [],
        contactMessages: []
      },
      isAdmin: false
    })

    const userWithoutPassword = user.toObject()
    delete userWithoutPassword.password

    return NextResponse.json({ success: true, data: userWithoutPassword }, { status: 201 })
  } catch (error: any) {
    console.error('Create user error:', error)
    // Log detailed error info for debugging
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      name: error?.name
    })
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const { email, updates } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await User.findOneAndUpdate(
      { email },
      updates,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
