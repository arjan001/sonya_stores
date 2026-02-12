import { query } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get total orders
    const ordersResult = await query(
      `SELECT COUNT(*) as total, SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
       FROM orders`
    )
    const totalOrders = parseInt(ordersResult.rows[0]?.total || 0)
    const pendingOrders = parseInt(ordersResult.rows[0]?.pending || 0)

    // Get total revenue (completed orders only)
    const revenueResult = await query(
      `SELECT SUM(total_amount) as total FROM orders WHERE status = 'completed'`
    )
    const totalRevenue = Math.floor(revenueResult.rows[0]?.total || 0)

    // Get total products
    const productsResult = await query(
      `SELECT COUNT(*) as total FROM products WHERE is_active = true`
    )
    const totalProducts = parseInt(productsResult.rows[0]?.total || 0)

    // Get page views (last 30 days)
    const viewsResult = await query(
      `SELECT SUM(views) as total FROM page_views 
       WHERE visited_at >= NOW() - INTERVAL '30 days'`
    )
    const pageViews = parseInt(viewsResult.rows[0]?.total || 0)

    // Get unique visitors (last 30 days)
    const visitorsResult = await query(
      `SELECT COUNT(DISTINCT user_id) as total FROM page_views 
       WHERE visited_at >= NOW() - INTERVAL '30 days'`
    )
    const uniqueVisitors = parseInt(visitorsResult.rows[0]?.total || 0)

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalProducts,
      pageViews,
      uniqueVisitors,
    })
  } catch (error) {
    console.error("[v0] Error fetching dashboard stats:", error)
    return NextResponse.json({
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      pageViews: 0,
      uniqueVisitors: 0,
    })
  }
}
