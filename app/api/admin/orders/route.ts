import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { getOrders, getOrdersCount, getOrder, updateOrderStatus } from "@/lib/admin-db"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-key")

async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value
    if (!token) return null
    const verified = await jwtVerify(token, secret)
    return verified.payload.sub as string
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const status = searchParams.get("status")
    const id = searchParams.get("id")

    if (id) {
      const order = await getOrder(id)
      return NextResponse.json(order)
    }

    const orders = await getOrders(limit, offset, status || undefined)
    const count = await getOrdersCount(status || undefined)

    return NextResponse.json({ orders, count })
  } catch (error) {
    console.error("[v0] Error fetching orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id, status } = await request.json()
    if (!id || !status) return NextResponse.json({ error: "Missing id or status" }, { status: 400 })

    await updateOrderStatus(id, status)
    return NextResponse.json({ message: "Order updated" })
  } catch (error) {
    console.error("[v0] Error updating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
