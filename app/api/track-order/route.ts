import { query } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { rateLimit, rateLimitResponse, sanitizePhoneSearch } from "@/lib/security"

export async function GET(request: NextRequest) {
  // Rate limit: max 15 searches per minute per IP
  const rl = rateLimit(request, { limit: 15, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()

  const { searchParams } = new URL(request.url)
  const orderNumber = searchParams.get("order_number")?.trim().replace(/[^a-zA-Z0-9\-]/g, "").slice(0, 30)
  const phone = searchParams.get("phone")?.trim()

  if (!orderNumber && !phone) {
    return NextResponse.json({ error: "Provide order number or phone number" }, { status: 400 })
  }

  try {
    let orders = []

    if (orderNumber) {
      const result = await query(
        `SELECT o.*, json_agg(json_build_object('product_name', oi.product_name, 'quantity', oi.quantity, 'unit_price', oi.unit_price)) as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         WHERE o.order_number = $1
         GROUP BY o.id
         ORDER BY o.created_at DESC`,
        [orderNumber]
      )
      orders = result.rows
    } else if (phone) {
      // Sanitize phone to prevent injection
      const cleanPhone = sanitizePhoneSearch(phone).replace(/^(\+?254|0)/, "")
      if (cleanPhone.length < 6) {
        return NextResponse.json({ error: "Phone number too short" }, { status: 400 })
      }

      const result = await query(
        `SELECT o.*, json_agg(json_build_object('product_name', oi.product_name, 'quantity', oi.quantity, 'unit_price', oi.unit_price)) as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         WHERE o.customer_phone LIKE $1
         GROUP BY o.id
         ORDER BY o.created_at DESC
         LIMIT 5`,
        [`%${cleanPhone}%`]
      )
      orders = result.rows
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("[v0] Error tracking order:", error)
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 })
  }
}
