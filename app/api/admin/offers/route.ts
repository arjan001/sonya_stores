import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { query } from "@/lib/db"

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

    const result = await query("SELECT * FROM offers WHERE is_active = true ORDER BY start_date DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { title, description, discount_percentage, discount_amount, applies_to, product_id, category_id, start_date, end_date, is_active } = await request.json()
    
    const res = await query(
      `INSERT INTO offers (title, description, discount_percentage, discount_amount, applies_to, product_id, category_id, start_date, end_date, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [title, description || null, discount_percentage || null, discount_amount || null, applies_to, product_id || null, category_id || null, start_date, end_date, is_active ?? true]
    )
    
    return NextResponse.json(res.rows[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id, title, description, discount_percentage, discount_amount, applies_to, product_id, category_id, start_date, end_date, is_active } = await request.json()
    
    const res = await query(
      `UPDATE offers SET title = $1, description = $2, discount_percentage = $3, discount_amount = $4, applies_to = $5, product_id = $6, category_id = $7, start_date = $8, end_date = $9, is_active = $10, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $11 RETURNING *`,
      [title, description || null, discount_percentage || null, discount_amount || null, applies_to, product_id || null, category_id || null, start_date, end_date, is_active, id]
    )
    
    return NextResponse.json(res.rows[0])
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    await query("DELETE FROM offers WHERE id = $1", [id])
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
