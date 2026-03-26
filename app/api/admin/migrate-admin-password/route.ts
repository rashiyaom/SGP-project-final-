import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

/**
 * POST /api/admin/migrate-admin-password
 * Updates the admin password to use bcrypt hashing
 * This is needed if the admin user was created before password hashing was implemented
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const adminEmail = 'admin@omkar.com'
    const plainPassword = 'admin@omkar123'

    // Find admin user
    const adminUser = await User.findOne({ email: adminEmail })

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found' },
        { status: 404 }
      )
    }

    // Always hash and update the password to ensure it's secure
    const hashedPassword = await bcrypt.hash(plainPassword, 10)

    // Update admin user with hashed password
    const updatedUser = await User.findOneAndUpdate(
      { email: adminEmail },
      { 
        password: hashedPassword,
        updatedAt: new Date()
      },
      { new: true, runValidators: false }
    )

    console.log('✅ Admin password migrated successfully')
    console.log(`   Email: ${updatedUser?.email}`)
    console.log(`   Password hash created: ${hashedPassword.substring(0, 20)}...`)

    return NextResponse.json({
      success: true,
      message: 'Admin password set to bcrypt hashing',
      admin: {
        email: updatedUser?.email,
        name: updatedUser?.name
      }
    })
  } catch (error: any) {
    console.error('Error migrating admin password:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to migrate admin password' },
      { status: 500 }
    )
  }
}
