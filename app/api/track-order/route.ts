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
        `SELECT o.id, o.order_number as "orderNumber", o.customer_id, o.shipping_address as address,
                o.shipping_amount as "deliveryFee", o.total_amount as total, o.subtotal,
                o.status, o.created_at as "createdAt", o.notes,
                c.first_name as customer, c.phone as phone,
                json_agg(json_build_object(
                  'name', oi.product_id,
                  'qty', oi.quantity,
                  'price', oi.unit_price
                )) FILTER (WHERE oi.id IS NOT NULL) as items
         FROM orders o
         LEFT JOIN customers c ON o.customer_id = c.id
         LEFT JOIN order_items oi ON o.id = oi.order_id
         WHERE o.order_number = $1
         GROUP BY o.id, o.order_number, o.customer_id, o.shipping_address,
                  o.shipping_amount, o.total_amount, o.subtotal, o.status,
                  o.created_at, o.notes, c.first_name, c.phone
         ORDER BY o.created_at DESC`,
        [orderNumber]
      )
      
      if (result.rows.length > 0) {
        orders = result.rows.map(row => ({
          id: row.id,
          orderNumber: row.orderNumber,
          customer: row.customer || 'Customer',
          phone: row.phone || '',
          items: row.items || [],
          subtotal: row.subtotal || 0,
          deliveryFee: row.deliveryFee || 0,
          total: row.total || 0,
          location: '',
          address: row.address || '',
          status: row.status || 'pending',
          createdAt: row.createdAt,
        }))
      }
    } else if (phone) {
      // Sanitize phone to prevent injection
      const cleanPhone = sanitizePhoneSearch(phone).replace(/^(\+?254|0)/, "")
      if (cleanPhone.length < 6) {
        return NextResponse.json({ error: "Phone number too short" }, { status: 400 })
      }

      const result = await query(
        `SELECT o.id, o.order_number as "orderNumber", o.customer_id, o.shipping_address as address,
                o.shipping_amount as "deliveryFee", o.total_amount as total, o.subtotal,
                o.status, o.created_at as "createdAt", o.notes,
                c.first_name as customer, c.phone as phone,
                json_agg(json_build_object(
                  'name', oi.product_id,
                  'qty', oi.quantity,
                  'price', oi.unit_price
                )) FILTER (WHERE oi.id IS NOT NULL) as items
         FROM orders o
         LEFT JOIN customers c ON o.customer_id = c.id
         LEFT JOIN order_items oi ON o.id = oi.order_id
         WHERE c.phone LIKE $1
         GROUP BY o.id, o.order_number, o.customer_id, o.shipping_address,
                  o.shipping_amount, o.total_amount, o.subtotal, o.status,
                  o.created_at, o.notes, c.first_name, c.phone
         ORDER BY o.created_at DESC
         LIMIT 5`,
        [`%${cleanPhone}%`]
      )
      
      if (result.rows.length > 0) {
        orders = result.rows.map(row => ({
          id: row.id,
          orderNumber: row.orderNumber,
          customer: row.customer || 'Customer',
          phone: row.phone || '',
          items: row.items || [],
          subtotal: row.subtotal || 0,
          deliveryFee: row.deliveryFee || 0,
          total: row.total || 0,
          location: '',
          address: row.address || '',
          status: row.status || 'pending',
          createdAt: row.createdAt,
        }))
      }
    }

    // Return empty array if no orders found
    return NextResponse.json(orders.length > 0 ? orders : [])
  } catch (error) {
    console.error("[v0] Error tracking order:", error)
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 })
  }
}
