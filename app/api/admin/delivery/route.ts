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

    const result = await query("SELECT * FROM delivery_settings ORDER BY delivery_time_days ASC")
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

    const { name, description, delivery_time_days, cost, is_active } = await request.json()
    
    const res = await query(
      "INSERT INTO delivery_settings (name, description, delivery_time_days, cost, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description || null, delivery_time_days, cost, is_active ?? true]
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

    const { id, name, description, delivery_time_days, cost, is_active } = await request.json()
    
    const res = await query(
      "UPDATE delivery_settings SET name = $1, description = $2, delivery_time_days = $3, cost = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
      [name, description || null, delivery_time_days, cost, is_active, id]
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

    await query("DELETE FROM delivery_settings WHERE id = $1", [id])
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
