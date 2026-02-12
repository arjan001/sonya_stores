import { createOrder } from "@/lib/supabase-data"
import { NextRequest, NextResponse } from "next/server"
import { rateLimit, rateLimitResponse, sanitize, isValidPhone, isValidEmail } from "@/lib/security"
import { sendOrderConfirmationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  // Rate limit: max 5 orders per minute per IP
  const rl = rateLimit(request, { limit: 5, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()

  try {
    const body = await request.json()

    // Sanitize all string inputs
    const customerName = sanitize(body.customerName, 100)
    const customerEmail = body.customerEmail ? sanitize(body.customerEmail, 320) : ""
    const customerPhone = sanitize(body.customerPhone, 20)
    const deliveryAddress = sanitize(body.deliveryAddress, 500)
    const notes = sanitize(body.notes, 1000)
    const mpesaCode = sanitize(body.mpesaCode, 12)
    const mpesaPhone = sanitize(body.mpesaPhone, 20)
    const mpesaMessage = sanitize(body.mpesaMessage, 2000)

    // Validate required fields
    if (!customerName || !customerPhone || !deliveryAddress || !body.items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate phone format
    if (!isValidPhone(customerPhone)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    // Validate email if provided
    if (customerEmail && !isValidEmail(customerEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Validate items array
    if (!Array.isArray(body.items) || body.items.length > 50) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 })
    }

    // Validate payment method
    const validPaymentMethods = ["cod", "mpesa", "whatsapp"]
    const paymentMethod = validPaymentMethods.includes(body.paymentMethod) ? body.paymentMethod : "cod"

    // Validate numeric fields
    const subtotal = Math.max(0, Number(body.subtotal) || 0)
    const deliveryFee = Math.max(0, Number(body.deliveryFee) || 0)
    const total = Math.max(0, Number(body.total) || 0)

    // Sanitize items
    const sanitizedItems = body.items.map((item: { productId: string; name: string; price: number; quantity: number; variation?: string; image?: string }) => ({
      productId: sanitize(item.productId, 50),
      name: sanitize(item.name, 200),
      price: Math.max(0, Number(item.price) || 0),
      quantity: Math.min(100, Math.max(1, Math.floor(Number(item.quantity) || 1))),
      variation: item.variation ? sanitize(item.variation, 100) : undefined,
      image: item.image ? sanitize(item.image, 500) : undefined,
    }))

    const result = await createOrder({
      customerName,
      customerEmail,
      customerPhone,
      deliveryLocationId: body.deliveryLocationId,
      deliveryAddress,
      deliveryFee,
      subtotal,
      total,
      notes,
      orderedVia: body.orderedVia === "whatsapp" ? "whatsapp" : "website",
      paymentMethod,
      mpesaCode,
      mpesaPhone,
      mpesaMessage,
      items: sanitizedItems,
    })

    // Fire-and-forget: send order confirmation email (don't block response)
    if (customerEmail) {
      sendOrderConfirmationEmail({
        orderNumber: result.orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        items: sanitizedItems.map((item: { name: string; quantity: number; price: number; variation?: string }) => ({
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          variation: item.variation,
        })),
        subtotal,
        deliveryFee,
        total,
        deliveryAddress,
        paymentMethod,
        mpesaCode,
      }).catch(() => {})
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
