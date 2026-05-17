import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { addCorsHeaders, handleCorsOptions } from '@/lib/middleware/cors'
import { logger } from '@/lib/logger'
import { clearSessionCookie, setSessionCookie } from '@/lib/auth/session'
import { requireAuth } from '@/lib/middleware/auth'

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

    const query = User.findOne({ email }).select(password ? '+password' : '-password')
    const user = await query

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (password) {
      const isPasswordValid = user.password && user.password.startsWith('$2')
        ? await bcrypt.compare(password, user.password)
        : Boolean(user.password && password === user.password)

      if (!isPasswordValid) {
        logger.error('Invalid password attempt', { email }, undefined, email)
        let response = NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        )
        response = addCorsHeaders(response)
        return response
      }

      await User.findOneAndUpdate(
        { email },
        {
          session: {
            isActive: true,
            lastActivity: new Date(),
            loginTime: new Date(),
            redirectAfterLogin: null,
          },
        },
        { new: true, runValidators: true }
      )

      const userObj = user.toObject()
      delete userObj.password

      let response: NextResponse = NextResponse.json({ success: true, data: userObj }, { status: 200 })
      response = setSessionCookie(response, {
        email: userObj.email,
        role: userObj.isAdmin ? 'admin' : 'user',
        issuedAt: Date.now(),
      })
      response = addCorsHeaders(response)
      return response
    }

    const auth = await requireAuth(req)
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      )
    }

    if (auth.user?.role !== 'admin' && auth.user?.email !== email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only access your own account' },
        { status: 403 }
      )
    }

    const userObj = user.toObject()
    delete userObj.password

    let response = NextResponse.json({ success: true, data: userObj }, { status: 200 })
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

    const hashedPassword = await bcrypt.hash(password, 10)

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
        contactMessages: [],
      },
      isAdmin: false,
      session: {
        isActive: true,
        lastActivity: new Date(),
        loginTime: new Date(),
        redirectAfterLogin: null,
      },
    })

    const userWithoutPassword = user.toObject()
    delete userWithoutPassword.password

    let response: NextResponse = NextResponse.json({ success: true, data: userWithoutPassword }, { status: 201 })
    response = setSessionCookie(response, { email: userWithoutPassword.email, role: 'user', issuedAt: Date.now() })
    response = addCorsHeaders(response)
    logger.info('User created successfully', { email })
    return response
  } catch (error: any) {
    logger.error('Failed to create user', { error: error.message }, error as Error)
    logger.debug('Error details:', {
      message: error?.message,
      code: error?.code,
      name: error?.name,
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
    const auth = await requireAuth(req)
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      )
    }

    await dbConnect()

    const body = await req.json()
    const { email, updates } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    if (auth.user?.role !== 'admin' && auth.user?.email !== email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only update your own account' },
        { status: 403 }
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
    const auth = await requireAuth(req)
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      )
    }

    await dbConnect()

    const body = await req.json()
    const { email, session, profile } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    if (auth.user?.role !== 'admin' && auth.user?.email !== email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only update your own session' },
        { status: 403 }
      )
    }

    const updateData: any = {}
    if (session !== undefined) updateData.session = session
    if (profile !== undefined) updateData.profile = profile

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

    let response: NextResponse = NextResponse.json({ success: true, data: user }, { status: 200 })
    if (session?.isActive === false) {
      response = clearSessionCookie(response)
    }
    return response
  } catch (error) {
    console.error('Update session error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}