// lib/logger.ts
// Centralized error and activity logging system

export interface LogEntry {
  timestamp: string
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  context?: Record<string, any>
  stack?: string
  userEmail?: string
  endpoint?: string
}

// Store logs in memory for the session (in production, use external service)
const logBuffer: LogEntry[] = []
const MAX_LOGS = 1000

/**
 * Internal function to add log to buffer
 */
function addToBuffer(entry: LogEntry) {
  logBuffer.push(entry)

  // Keep buffer size under control
  if (logBuffer.length > MAX_LOGS) {
    logBuffer.shift()
  }

  // Log to console in development
  if (process.env.NEXT_PUBLIC_ENV !== 'production') {
    const color =
      entry.level === 'error'
        ? '\x1b[31m'
        : entry.level === 'warn'
          ? '\x1b[33m'
          : entry.level === 'info'
            ? '\x1b[32m'
            : '\x1b[36m'

    const reset = '\x1b[0m'
    console.log(
      `${color}[${entry.level.toUpperCase()}]${reset} ${entry.timestamp} - ${entry.message}`,
      entry.context ? entry.context : ''
    )
  }
}

/**
 * Send logs to external service (optional)
 * Replace this with Sentry, LogRocket, or your preferred service
 */
async function sendToExternalService(entry: LogEntry) {
  // Only send errors in production
  if (process.env.NEXT_PUBLIC_ENV !== 'production' || entry.level !== 'error') {
    return
  }

  try {
    // Example: Send to Sentry
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      await fetch(process.env.NEXT_PUBLIC_SENTRY_DSN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      }).catch(() => {}) // Fail silently
    }

    // Example: Send to your own logging endpoint
    if (process.env.NEXT_PUBLIC_LOG_ENDPOINT) {
      await fetch(process.env.NEXT_PUBLIC_LOG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      }).catch(() => {}) // Fail silently
    }
  } catch (e) {
    // Don't throw errors from logging
    console.error('Failed to send logs to external service:', e)
  }
}

/**
 * Main logger object with methods for different log levels
 */
export const logger = {
  /**
   * Log an error
   */
  error: (
    message: string,
    context?: Record<string, any>,
    error?: Error,
    userEmail?: string
  ) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      context,
      stack: error?.stack,
      userEmail,
      endpoint: context?.endpoint,
    }

    addToBuffer(entry)
    sendToExternalService(entry)
  },

  /**
   * Log a warning
   */
  warn: (message: string, context?: Record<string, any>, userEmail?: string) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      context,
      userEmail,
    }

    addToBuffer(entry)
  },

  /**
   * Log info message
   */
  info: (message: string, context?: Record<string, any>, userEmail?: string) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
      userEmail,
    }

    addToBuffer(entry)
  },

  /**
   * Log debug message (only in development)
   */
  debug: (message: string, context?: Record<string, any>) => {
    if (process.env.NEXT_PUBLIC_ENV !== 'production') {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
        context,
      }

      addToBuffer(entry)
    }
  },

  /**
   * Get all logs (for debugging)
   */
  getLogs: () => {
    return [...logBuffer]
  },

  /**
   * Get logs filtered by level
   */
  getLogsByLevel: (level: LogEntry['level']) => {
    return logBuffer.filter((log) => log.level === level)
  },

  /**
   * Get recent errors (for monitoring)
   */
  getRecentErrors: (count = 10) => {
    return logBuffer
      .filter((log) => log.level === 'error')
      .slice(-count)
      .reverse()
  },

  /**
   * Clear all logs
   */
  clear: () => {
    logBuffer.length = 0
  },
}

/**
 * API Route logger helper
 * Use this in API routes for consistent logging
 */
export function createApiLogger(endpoint: string, userEmail?: string) {
  return {
    error: (message: string, context?: Record<string, any>, error?: Error) => {
      logger.error(
        `[${endpoint}] ${message}`,
        { ...context, endpoint },
        error,
        userEmail
      )
    },
    warn: (message: string, context?: Record<string, any>) => {
      logger.warn(`[${endpoint}] ${message}`, { ...context, endpoint }, userEmail)
    },
    info: (message: string, context?: Record<string, any>) => {
      logger.info(`[${endpoint}] ${message}`, { ...context, endpoint }, userEmail)
    },
    debug: (message: string, context?: Record<string, any>) => {
      logger.debug(`[${endpoint}] ${message}`, { ...context, endpoint })
    },
  }
}

// Export types for use in other files
export type Logger = typeof logger
export type ApiLogger = ReturnType<typeof createApiLogger>
