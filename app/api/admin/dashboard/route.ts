import { query } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-key")

async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value
    if (!token) return null
    await jwtVerify(token, secret)
    return true
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const [productsRes, categoriesRes, ordersRes, offersRes] = await Promise.all([
      query("SELECT id, name, price, original_price, is_on_offer, offer_percentage FROM products ORDER BY created_at DESC"),
      query("SELECT COUNT(*) as count FROM categories WHERE is_active = true"),
      query("SELECT id, order_number, customer_name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 10"),
      query("SELECT COUNT(*) as count FROM offers WHERE is_active = true"),
    ])

    const products = productsRes.rows || []
    const orders = ordersRes.rows || []
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
    const offerProducts = products.filter((p) => p.is_on_offer)

    return NextResponse.json({
      stats: {
        totalProducts: products.length,
        totalCategories: parseInt(categoriesRes.rows[0]?.count || 0),
        activeOffers: parseInt(offersRes.rows[0]?.count || 0),
        totalOrders: orders.length,
        totalRevenue: totalRevenue.toFixed(2),
        offerProductsCount: offerProducts.length,
      },
      recentOrders: orders.slice(0, 5),
    })
  } catch (error) {
    console.error("[v0] Dashboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
