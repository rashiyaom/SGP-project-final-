import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connect'

/**
 * Health Check Endpoint
 * Purpose: Uptime monitoring and status checks
 * Integrates with: UptimeRobot, Datadog, New Relic, etc.
 */
export async function GET() {
  try {
    await dbConnect()

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NEXT_PUBLIC_ENV || 'production',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
