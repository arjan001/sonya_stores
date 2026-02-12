import { query } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { UAParser } from "ua-parser-js"
import { rateLimit, rateLimitResponse, sanitize } from "@/lib/security"

export async function POST(request: NextRequest) {
  // Rate limit: max 60 page views per minute per IP (generous for normal browsing)
  const rl = rateLimit(request, { limit: 60, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()

  try {
    const body = await request.json()
    const userAgent = request.headers.get("user-agent") || ""

    // Block obvious bots/scanners
    const botPatterns = /bot|crawl|spider|scraper|curl|wget|python|java|go-http|headless/i
    if (botPatterns.test(userAgent)) {
      return NextResponse.json({ success: true }) // silent drop
    }

    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser().name || "Unknown"
    const deviceType = parser.getDevice().type || "desktop"

    const country = request.headers.get("x-vercel-ip-country") || ""
    const city = request.headers.get("x-vercel-ip-city") || ""

    await query(
      `INSERT INTO page_views (page_path, referrer, user_agent, country, city, device_type, browser, session_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
      [
        sanitize(body.path || "/", 500),
        sanitize(body.referrer || "", 2000),
        userAgent.slice(0, 500),
        country,
        city,
        deviceType,
        browser,
        sanitize(body.sessionId || "", 100),
      ]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Failed to track view:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
