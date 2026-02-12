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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      const result = await query("SELECT * FROM policies WHERE id = $1", [id])
      return NextResponse.json(result.rows[0])
    }

    const result = await query("SELECT * FROM policies ORDER BY created_at DESC")
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

    const { type, title, slug, content, is_published } = await request.json()
    
    const res = await query(
      "INSERT INTO policies (type, title, slug, content, is_published) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [type, title, slug || title.toLowerCase().replace(/\s+/g, '-'), content, is_published ?? true]
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

    const { id, type, title, slug, content, is_published } = await request.json()
    
    const res = await query(
      "UPDATE policies SET type = $1, title = $2, slug = $3, content = $4, is_published = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
      [type, title, slug || title.toLowerCase().replace(/\s+/g, '-'), content, is_published, id]
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

    await query("DELETE FROM policies WHERE id = $1", [id])
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
