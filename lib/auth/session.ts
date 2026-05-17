import crypto from 'node:crypto'
import { NextResponse } from 'next/server'

export const SESSION_COOKIE_NAME = 'sgp_session'

type SessionRole = 'user' | 'admin'

export interface SessionPayload {
  email: string
  role: SessionRole
  issuedAt: number
}

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET || process.env.NEXTAUTH_SECRET

  if (!secret) {
    throw new Error('Please define AUTH_SESSION_SECRET or NEXTAUTH_SECRET in your environment')
  }

  return secret
}

function sign(value: string) {
  return crypto.createHmac('sha256', getSessionSecret()).update(value).digest('base64url')
}

function encode(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

function decode(value: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as Partial<SessionPayload>
    if (!parsed.email || !parsed.role || typeof parsed.issuedAt !== 'number') {
      return null
    }
    return parsed as SessionPayload
  } catch {
    return null
  }
}

export function createSessionToken(payload: SessionPayload) {
  const encoded = encode(payload)
  return `${encoded}.${sign(encoded)}`
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null

  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null

  const expected = sign(encoded)
  if (expected.length !== signature.length) return null

  const providedBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) return null

  return decode(encoded)
}

export function setSessionCookie(
  response: NextResponse,
  payload: SessionPayload,
  maxAgeSeconds = 60 * 60 * 24 * 7
) {
  response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(payload), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAgeSeconds,
  })

  return response
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}