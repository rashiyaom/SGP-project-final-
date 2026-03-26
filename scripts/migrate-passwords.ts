// scripts/migrate-passwords.ts
/**
 * Migration script to hash all plain text passwords in the database.
 * Run this ONCE after deploying the bcrypt changes.
 * 
 * Usage: npx ts-node scripts/migrate-passwords.ts
 */

import dbConnect from '@/lib/db/connect'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'

async function migratePasswords() {
  try {
    await dbConnect()
    console.log('Connected to database...')

    // Find all users with plain text passwords (not starting with $2a or $2b, which indicates bcrypt hash)
    const users = await User.find({})
    
    let updatedCount = 0
    let skippedCount = 0

    for (const user of users) {
      // Check if password is already hashed
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
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migratePasswords()
