import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { addCorsHeaders, handleCorsOptions } from '@/lib/middleware/cors'
import { logger } from '@/lib/logger'

// Handle CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req)
}

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

    // Always select password field when it might be needed for login verification
    let query = User.findOne({ email })
    if (password) {
      // Login attempt - need password for verification
      query = query.select('+password')
    } else {
      // Non-login request - hide password
      query = query.select('-password')
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
      let isPasswordValid = false
      
      // Check if password is a bcrypt hash (starts with $2a$, $2b$, or $2y$)
      if (user.password && user.password.startsWith('$2')) {
        // Password is hashed, use bcrypt comparison
        isPasswordValid = await bcrypt.compare(password, user.password)
      } else if (user.password) {
        // Fallback for plain text passwords (legacy support)
        isPasswordValid = password === user.password
      }
      
      if (!isPasswordValid) {
        logger.error('Invalid password attempt', { email }, undefined, email)
        let response = NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        )
        response = addCorsHeaders(response)
        return response
      }
      // Return user without password
      const userObj = user.toObject()
      delete userObj.password
      let response = NextResponse.json({ success: true, data: userObj }, { status: 200 })
      response = addCorsHeaders(response)
      return response
    }

    let response = NextResponse.json({ success: true, data: user }, { status: 200 })
    response = addCorsHeaders(response)
    return response
  } catch (error: any) {
    logger.error('Failed to fetch user', { error: error.message }, error as Error)
    let response = NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
    response = addCorsHeaders(response)
    return response
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const { email, name, password } = body

    if (!email || !name || !password) {
      let response = NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
      response = addCorsHeaders(response)
      return response
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      logger.warn('User already exists', { email })
      let response = NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      )
      response = addCorsHeaders(response)
      return response
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
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
      isAdmin: false,
      session: {
        isActive: true,
        lastActivity: new Date(),
        loginTime: new Date(),
        redirectAfterLogin: null
      }
    })

    const userWithoutPassword = user.toObject()
    delete userWithoutPassword.password

    logger.info('User created successfully', { email })
    let response = NextResponse.json({ success: true, data: userWithoutPassword }, { status: 201 })
    response = addCorsHeaders(response)
    return response
  } catch (error: any) {
    logger.error('Failed to create user', { error: error.message }, error as Error)
    // Log detailed error info for debugging
    logger.debug('Error details:', {
      message: error?.message,
      code: error?.code,
      name: error?.name
    })
    let response = NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    )
    response = addCorsHeaders(response)
    return response
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

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const { email, session, profile } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Build update object
    const updateData: any = {}
    
    if (session !== undefined) {
      updateData.session = session
    }
    
    if (profile !== undefined) {
      updateData.profile = profile
    }

    // Update user
    const user = await User.findOneAndUpdate(
      { email },
      updateData,
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
    console.error('Update session error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
