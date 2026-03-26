import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

/**
 * POST /api/admin/debug-login
 * Debug endpoint to test login with detailed output
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Find user (including password) - password field has select:false so we need to explicitly include it
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Debug output
    const debug = {
      email,
      passwordProvided: password,
      storedPassword: user.password,
      storedPasswordType: user.password ? (user.password.startsWith('$2') ? 'bcrypt_hash' : 'plain_text') : 'undefined',
      passwordExists: !!user.password,
      comparisonMethod: '',
      comparisonResult: false,
      comparisonError: '',
    }

    // Try comparison
    let isPasswordValid = false
    try {
      if (user.password && user.password.startsWith('$2')) {
        isPasswordValid = await bcrypt.compare(password, user.password)
        debug.comparisonMethod = 'bcrypt'
        debug.comparisonResult = isPasswordValid
      } else if (user.password) {
        isPasswordValid = password === user.password
        debug.comparisonMethod = 'plain_text'
        debug.comparisonResult = isPasswordValid
      }
    } catch (err: any) {
      debug.comparisonError = err.message
    }

    return NextResponse.json({
      success: isPasswordValid,
      debug
    })
  } catch (error: any) {
    console.error('Debug login error:', error)
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    )
  }
}
