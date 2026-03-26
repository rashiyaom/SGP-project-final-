// /app/api/admin/migrate-passwords/route.ts
import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

/**
 * ADMIN ONLY: Endpoint to migrate plain text passwords to bcrypt hashes.
 * This should only be called ONCE after the bcrypt changes are deployed.
 * 
 * Query param: ?adminSecret=YOUR_SECRET_KEY
 * 
 * This endpoint should be protected in production with proper admin authentication.
 */

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    // Simple protection (replace with proper admin auth in production)
    const { searchParams } = new URL(req.url)
    const adminSecret = searchParams.get('adminSecret')
    
    if (adminSecret !== process.env.ADMIN_MIGRATION_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    console.log('Starting password migration...')

    // Find all users
    const users = await User.find({})
    
    let updatedCount = 0
    let skippedCount = 0

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a or $2b)
      if (user.password && (user.password.startsWith('$2a') || user.password.startsWith('$2b'))) {
        console.log(`⏭️  Skipping ${user.email} - already hashed`)
        skippedCount++
        continue
      }

      if (!user.password) {
        console.log(`⏭️  Skipping ${user.email} - no password`)
        skippedCount++
        continue
      }

      // Hash the plain text password
      const hashedPassword = await bcrypt.hash(user.password, 10)
      user.password = hashedPassword
      await user.save()
      
      console.log(`✅ Updated ${user.email}`)
      updatedCount++
    }

    console.log(`\n✨ Migration complete!`)
    console.log(`📊 Updated: ${updatedCount}, Skipped: ${skippedCount}`)

    return NextResponse.json({
      success: true,
      message: 'Password migration completed',
      data: {
        updated: updatedCount,
        skipped: skippedCount,
        total: users.length
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { success: false, error: 'Migration failed' },
      { status: 500 }
    )
  }
}
