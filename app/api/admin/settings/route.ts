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

    const result = await query(
      'SELECT key, value FROM settings ORDER BY category, key'
    )

    const settings: Record<string, any> = {}
    result.rows.forEach((row: any) => {
      settings[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('[v0] Error fetching settings:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const settingsData = await request.json()
    const updates: Promise<any>[] = []

    for (const [key, value] of Object.entries(settingsData)) {
      updates.push(
        query(
          `UPDATE settings SET value = $1, updated_at = CURRENT_TIMESTAMP
           WHERE key = $2`,
          [JSON.stringify(value), key]
        )
      )
    }

    await Promise.all(updates)
    return NextResponse.json({ message: "Settings updated successfully" })
  } catch (error) {
    console.error('[v0] Error updating settings:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
