import { createClient } from "@/lib/supabase/server"
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

  const supabase = await createClient()

  let query = supabase
    .from("orders")
    .select("*, delivery_locations(name)")
    .order("created_at", { ascending: false })

  if (orderNumber) {
    query = query.eq("order_number", orderNumber)
  } else if (phone) {
    // Sanitize phone to prevent wildcard injection
    const cleanPhone = sanitizePhoneSearch(phone).replace(/^(\+?254|0)/, "")
    if (cleanPhone.length < 6) {
      return NextResponse.json({ error: "Phone number too short" }, { status: 400 })
    }
    query = query.or(`customer_phone.ilike.%${cleanPhone}%`)
  }

  const { data: orders, error } = await query.limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!orders || orders.length === 0) {
    return NextResponse.json({ error: "No orders found" }, { status: 404 })
  }

  // Fetch items for all found orders
  const orderIds = orders.map((o) => o.id)
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds)

  const itemsByOrder: Record<string, typeof items> = {}
  for (const item of items || []) {
    if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = []
    itemsByOrder[item.order_id].push(item)
  }

  const result = orders.map((o) => ({
    id: o.id,
    orderNumber: o.order_number,
    customer: o.customer_name,
    phone: o.customer_phone,
    items: (itemsByOrder[o.id] || []).map((item) => ({
      name: item.product_name,
      qty: item.quantity,
      price: Number(item.unit_price),
      variation: item.variation || undefined,
      image: item.product_image || undefined,
    })),
    subtotal: Number(o.subtotal),
    deliveryFee: Number(o.delivery_fee),
    total: Number(o.total),
    location: o.delivery_locations?.name || o.delivery_address || "",
    address: o.delivery_address || "",
    status: o.status,
    createdAt: o.created_at,
  }))

  return NextResponse.json(result)
}
