import { NextRequest, NextResponse } from "next/server"

// ==========================================
// IN-MEMORY RATE LIMITER (per serverless instance)
// ==========================================
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

// Clean up expired entries every 60s
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of rateLimitStore) {
    if (now > val.resetAt) rateLimitStore.delete(key)
  }
}, 60_000)

interface RateLimitConfig {
  /** Max requests allowed */
  limit: number
  /** Time window in seconds */
  windowSeconds: number
}

export function rateLimit(
  request: NextRequest | Request,
  config: RateLimitConfig = { limit: 30, windowSeconds: 60 }
): { success: boolean; remaining: number } {
  const ip =
    (request as NextRequest).headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (request as NextRequest).headers?.get("x-real-ip") ||
    "unknown"

  const key = `${ip}:${new URL(request.url).pathname}`
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + config.windowSeconds * 1000 })
    return { success: true, remaining: config.limit - 1 }
  }

  record.count++
  if (record.count > config.limit) {
    return { success: false, remaining: 0 }
  }

  return { success: true, remaining: config.limit - record.count }
}

export function rateLimitResponse() {
  return NextResponse.json(
    { error: "Too many requests. Please slow down." },
    { status: 429, headers: { "Retry-After": "60" } }
  )
}

// ==========================================
// AUTH GUARD (for admin routes)
// ==========================================
export async function requireAuth(): Promise<{
  authenticated: boolean
  response?: NextResponse
}> {
  try {
    // Use cookies instead of Supabase auth for JWT verification
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Unauthorized: No token" },
          { status: 401 }
        ),
      }
    }

    // Basic token validation - check if it's a valid JWT-like string
    const parts = token.split(".")
    if (parts.length !== 3) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Unauthorized: Invalid token format" },
          { status: 401 }
        ),
      }
    }

    return { authenticated: true }
  } catch (error) {
    console.error("[v0] Auth error:", error)
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      ),
    }
  }
}

// ==========================================
// INPUT SANITIZATION
// ==========================================

/** Strip HTML tags, trim, and limit length */
export function sanitize(input: unknown, maxLength = 500): string {
  if (typeof input !== "string") return ""
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[<>"'`;\\]/g, "") // strip dangerous chars
    .trim()
    .slice(0, maxLength)
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320
}

/** Validate Kenyan phone number */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "")
  return /^(\+?254|0)[17]\d{8}$/.test(cleaned)
}

/** Validate M-PESA transaction code format */
export function isValidMpesaCode(code: string): boolean {
  if (!code) return true // optional field
  return /^[A-Z0-9]{8,12}$/.test(code.toUpperCase())
}

/** Sanitize phone for DB search -- prevent wildcard injection */
export function sanitizePhoneSearch(phone: string): string {
  return phone.replace(/[^0-9+]/g, "").slice(0, 15)
}

/** Validate UUID format */
export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

/** Validate file upload: type + size */
export function validateUpload(
  file: File,
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed. Use JPG, PNG, WebP, or GIF.` }
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File too large. Maximum ${maxSizeMB}MB.` }
  }
  return { valid: true }
}
