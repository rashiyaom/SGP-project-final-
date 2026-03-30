// lib/env.ts
// Environment variable validation
// This file ensures all required environment variables are set before app starts

const requiredEnvVars = [
  'MONGODB_URI',
  'NEXTAUTH_SECRET',
]

const optionalEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_ENV',
]

export function validateEnv() {
  const missing: string[] = []

  // Check required vars
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  })

  if (missing.length > 0) {
    const errorMessage = `
❌ Missing required environment variables:
${missing.map((v) => `   - ${v}`).join('\n')}

Please add these to your .env.local file and restart the server.
    `.trim()

    console.error(errorMessage)
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  // Log optional vars
  const missingOptional = optionalEnvVars.filter((v) => !process.env[v])
  if (missingOptional.length > 0) {
    console.warn(
      `⚠️  Optional environment variables not set: ${missingOptional.join(', ')}`
    )
  }

  console.log('✅ Environment variables validated successfully')
}

// Validate on import
if (typeof window === 'undefined') {
  // Server-side only
  validateEnv()
}
