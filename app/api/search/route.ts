import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q") || ""
    const categoryId = searchParams.get("categoryId")
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 1000)
    const offset = parseInt(searchParams.get("offset") || "0")

    if (q.length < 2) {
      return NextResponse.json({ products: [], total: 0 })
    }

    const searchTerm = `%${q}%`
    let sql = `
      SELECT p.id, p.name, p.slug, p.description, p.price, p.discount_price, p.stock_quantity,
             p.is_featured, p.is_new, p.is_on_sale, p.image_url, p.images, p.tags, p.status,
             p.created_at, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active'
      AND (p.name ILIKE $1 OR p.description ILIKE $1 OR p.tags::text ILIKE $1)
    `
    const params: any[] = [searchTerm]

    if (categoryId) {
      sql += ` AND p.category_id = $${params.length + 1}`
      params.push(categoryId)
    }

    sql += ` ORDER BY p.is_featured DESC, p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await query(sql, params)

    // Count total matches
    let countSql = `
      SELECT COUNT(*) as count
      FROM products p
      WHERE p.status = 'active'
      AND (p.name ILIKE $1 OR p.description ILIKE $1 OR p.tags::text ILIKE $1)
    `
    const countParams: any[] = [searchTerm]

    if (categoryId) {
      countSql += ` AND p.category_id = $${countParams.length + 1}`
      countParams.push(categoryId)
    }

    const countResult = await query(countSql, countParams)
    const total = parseInt(countResult.rows[0].count || "0")

    return NextResponse.json({
      products: result.rows,
      total,
      query: q,
      count: result.rows.length
    })
  } catch (error) {
    console.error("[v0] Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
