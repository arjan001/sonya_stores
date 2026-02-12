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

    const result = await query("SELECT * FROM seo_pages ORDER BY page_path")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[v0] SEO fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()

    const result = await query(
      `INSERT INTO seo_pages (page_path, meta_title, meta_description, meta_keywords)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (page_path) DO UPDATE SET meta_title = $2, meta_description = $3, meta_keywords = $4
       RETURNING *`,
      [body.page_path, body.meta_title, body.meta_description, body.meta_keywords]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("[v0] SEO update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await request.json()

    await query("DELETE FROM seo_pages WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] SEO delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
