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
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search")

    let sql = "SELECT * FROM newsletter_subscribers WHERE 1=1"
    const params: any[] = []

    if (search) {
      sql += ` AND (email ILIKE $${params.length + 1} OR name ILIKE $${params.length + 1})`
      params.push(`%${search}%`, `%${search}%`)
    }

    sql += ` ORDER BY subscribed_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await query(sql, params)
    const countResult = await query("SELECT COUNT(*) as count FROM newsletter_subscribers WHERE 1=1" + (search ? ` AND (email ILIKE $1 OR name ILIKE $1)` : ""), search ? [`%${search}%`] : [])

    return NextResponse.json({ subscribers: result.rows, total: parseInt(countResult.rows[0].count) })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { email, name } = await request.json()
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

    await query(
      "INSERT INTO newsletter_subscribers (email, name, subscribed_at, is_active) VALUES ($1, $2, CURRENT_TIMESTAMP, true)",
      [email, name || null]
    )

    return NextResponse.json({ message: "Subscriber added" }, { status: 201 })
  } catch (error: any) {
    if (error.message?.includes("duplicate")) {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 409 })
    }
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

    await query("DELETE FROM newsletter_subscribers WHERE id = $1", [id])
    return NextResponse.json({ message: "Subscriber removed" })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
