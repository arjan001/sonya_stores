import { query } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { rateLimit, rateLimitResponse, sanitize, isValidEmail } from "@/lib/security"

export async function POST(request: NextRequest) {
  // Rate limit: max 3 subscribes per minute per IP
  const rl = rateLimit(request, { limit: 3, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()

  try {
    const { email } = await request.json()
    const cleanEmail = sanitize(email, 320).toLowerCase()

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 })
    }

    await query(
      `INSERT INTO newsletter_subscribers (email, subscribed_at, is_active)
       VALUES ($1, CURRENT_TIMESTAMP, true)
       ON CONFLICT (email) DO UPDATE SET is_active = true`,
      [cleanEmail]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error subscribing to newsletter:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
