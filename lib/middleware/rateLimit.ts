// lib/middleware/rateLimit.ts
// Rate limiting middleware to prevent brute force attacks

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitRecord {
  count: number
  resetTime: number
}

// Store rate limit records in memory
// In production, use Redis for distributed rate limiting
const rateLimitStore = new Map<string, RateLimitRecord>()

// Configuration for different endpoints
export const RATE_LIMIT_CONFIG = {
  login: { max: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  register: { max: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  api: { max: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  general: { max: 30, windowMs: 60 * 1000 }, // 30 requests per minute
}

export interface RateLimitResult {
  rateLimited: boolean
  remaining?: number
  resetTime?: number
  message?: string
}

/**
 * Rate limit middleware for Next.js
 * @param req - NextRequest object
 * @param type - Type of rate limit (login, register, api, general)
 * @returns RateLimitResult with status and remaining attempts
 */
export function rateLimit(
  req: NextRequest,
  type: keyof typeof RATE_LIMIT_CONFIG = 'api'
): RateLimitResult {
  // Get client IP from request headers
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-client-ip') ||
    'unknown'

  const key = `${type}:${ip}`
  const config = RATE_LIMIT_CONFIG[type]
  const now = Date.now()

  // Get existing record
  let record = rateLimitStore.get(key)

  // Reset if window has passed
  if (!record || record.resetTime < now) {
    record = {
      count: 0,
      resetTime: now + config.windowMs,
    }
  }

  // Increment count
  record.count++
  rateLimitStore.set(key, record)

  // Check if rate limited
  const rateLimited = record.count > config.max
  const remaining = Math.max(0, config.max - record.count)
  const resetTime = record.resetTime

  if (rateLimited) {
    const secondsRemaining = Math.ceil((resetTime - now) / 1000)
    return {
      rateLimited: true,
      message: `Too many ${type} attempts. Please try again in ${secondsRemaining} seconds.`,
      remaining: 0,
      resetTime,
    }
  }

  return {
    rateLimited: false,
    remaining,
    resetTime,
  }
}

/**
 * Cleanup expired records from memory (run periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now()
  let cleaned = 0

  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetTime < now) {
      rateLimitStore.delete(key)
      cleaned++
    }
  }

  if (cleaned > 0) {
    console.log(`🧹 Rate limit cleanup: removed ${cleaned} expired records`)
  }
}

// Clean up every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    cleanupRateLimitStore()
  }, 5 * 60 * 1000)
}

/**
 * Helper to create a rate limited error response
 */
export function rateLimitResponse(result: RateLimitResult) {
  const response = NextResponse.json(
    { error: result.message || 'Rate limit exceeded' },
    { status: 429 }
  )

  // Add rate limit headers
  response.headers.set('Retry-After', String(Math.ceil((result.resetTime || 0) / 1000)))
  response.headers.set('X-RateLimit-Remaining', String(result.remaining || 0))
  response.headers.set('X-RateLimit-Reset', String(result.resetTime || 0))

  return response
}
