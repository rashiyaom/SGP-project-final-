import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

/**
 * POST /api/admin/init
 * Creates or updates the admin user account for storing admin data
 * This ensures there's always a place to store admin products, gallery, etc.
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const adminEmail = 'admin@omkar.com'

    // Check if admin user exists
    let adminUser = await User.findOne({ email: adminEmail })

    if (!adminUser) {
      // Hash admin password before storing
      const hashedPassword = await bcrypt.hash('admin@omkar123', 10)

      // Create admin user if it doesn't exist
      adminUser = await User.create({
        email: adminEmail,
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
          contactMessages: []
        }
      })

      console.log('✅ Admin user created:', adminEmail)
      return NextResponse.json({ success: true, message: 'Admin user created', data: adminUser }, { status: 201 })
    } else {
      console.log('✅ Admin user already exists:', adminEmail)
      return NextResponse.json({ success: true, message: 'Admin user already exists', data: adminUser }, { status: 200 })
    }
  } catch (error: any) {
    console.error('Error initializing admin user:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to initialize admin user' },
      { status: 500 }
    )
  }
}
