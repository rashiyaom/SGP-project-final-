// lib/middleware/cors.ts
// CORS (Cross-Origin Resource Sharing) middleware

import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  process.env.NEXT_PUBLIC_APP_URL || '',
  // Add your production domain here:
  // 'https://yourdomain.com',
]

export interface CorsOptions {
  origin?: string | string[]
  methods?: string[]
  allowedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
}

const DEFAULT_CORS_OPTIONS: CorsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-email', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders<T>(
  response: NextResponse<T>,
  origin?: string,
  options: CorsOptions = {}
): NextResponse<T> {
  const corsOptions = { ...DEFAULT_CORS_OPTIONS, ...options }

  // Check if origin is allowed
  const isAllowedOrigin =
    !origin ||
    ALLOWED_ORIGINS.includes(origin) ||
    (process.env.NEXT_PUBLIC_ENV !== 'production' && origin?.includes('localhost'))

  if (isAllowedOrigin && origin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else if (!origin) {
    // If no origin header, allow from config
    response.headers.set(
      'Access-Control-Allow-Origin',
      corsOptions.origin as string
    )
  }

  response.headers.set('Access-Control-Allow-Credentials', String(corsOptions.credentials))
  response.headers.set(
    'Access-Control-Allow-Methods',
    corsOptions.methods?.join(', ') || 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    corsOptions.allowedHeaders?.join(', ') || 'Content-Type, x-user-email, Authorization'
  )
  response.headers.set('Access-Control-Max-Age', String(corsOptions.maxAge || 86400))

  return response
}

/**
 * Handle CORS preflight requests (OPTIONS method)
 */
export function handleCorsOptions(
  req: NextRequest,
  options: CorsOptions = {}
): NextResponse {
  // Check origin
  const origin = req.headers.get('origin')
  const corsOptions = { ...DEFAULT_CORS_OPTIONS, ...options }

  const isAllowedOrigin =
    !origin ||
    ALLOWED_ORIGINS.includes(origin) ||
    (process.env.NEXT_PUBLIC_ENV !== 'production' && origin?.includes('localhost'))

  if (!isAllowedOrigin && origin) {
    return new NextResponse('CORS not allowed', { status: 403 })
  }

  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response, origin || undefined, corsOptions)
}

/**
 * Middleware wrapper for automatic CORS handling
 */
export function withCors(
  handler: (req: NextRequest) => Promise<Response>,
  options: CorsOptions = {}
) {
  return async (req: NextRequest) => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return handleCorsOptions(req, options)
    }

    // Call the actual handler
    let response = await handler(req)

    // Ensure response is a NextResponse
    if (!(response instanceof NextResponse)) {
      response = NextResponse.json(response)
    }

    // Add CORS headers
    const origin = req.headers.get('origin')
    return addCorsHeaders(response as NextResponse, origin || undefined, options)
  }
}
