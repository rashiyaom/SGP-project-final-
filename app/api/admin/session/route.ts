import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import { clearSessionCookie, setSessionCookie } from '@/lib/auth/session'
import { requireAdmin } from '@/lib/middleware/auth'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const ADMIN_EMAIL = 'admin@omkar.com'
const DEFAULT_ADMIN_PASSWORD = 'admin@omkar123'

async function getOrCreateAdmin() {
  let adminUser = await User.findOne({ email: ADMIN_EMAIL }).select('+password')

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10)
    adminUser = await User.create({
      email: ADMIN_EMAIL,
      name: 'Omkar Admin',
      password: hashedPassword,
      isAdmin: true,
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
      session: {
        isActive: false,
        lastActivity: null,
        loginTime: null,
        redirectAfterLogin: null,
      },
    })
  }

  return adminUser
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req)
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      )
    }

    return NextResponse.json({ success: true, data: auth.user }, { status: 200 })
  } catch (error) {
    console.error('Admin session check error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const password = body.password as string | undefined

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 })
    }

    const adminUser = await getOrCreateAdmin()
    const passwordMatches = await bcrypt.compare(password, adminUser.password)

    if (!passwordMatches) {
      return NextResponse.json({ success: false, error: 'Invalid admin password' }, { status: 401 })
    }

    adminUser.session = {
      isActive: true,
      lastActivity: new Date(),
      loginTime: new Date(),
      redirectAfterLogin: null,
    }
    await adminUser.save()

    const adminObject = adminUser.toObject()
    delete adminObject.password

    let response: NextResponse = NextResponse.json({ success: true, data: { ...adminObject, role: 'admin' } }, { status: 200 })
    response = setSessionCookie(response, { email: adminUser.email, role: 'admin', issuedAt: Date.now() }, 60 * 60 * 12)
    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin(req)
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      )
    }

    await dbConnect()

    await User.findOneAndUpdate(
      { email: auth.user?.email || ADMIN_EMAIL },
      {
        session: {
          isActive: false,
          lastActivity: null,
          loginTime: null,
          redirectAfterLogin: null,
        },
      },
      { new: true, runValidators: true }
    )

    const response = NextResponse.json({ success: true }, { status: 200 })
    return clearSessionCookie(response)
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}