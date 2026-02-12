import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await query(
      "SELECT COUNT(*) as count FROM admins WHERE role = 'super_admin'"
    )
    const count = parseInt(result.rows[0]?.count || 0)
    return NextResponse.json({ hasAdmin: count > 0 })
  } catch (error) {
    console.error("[v0] Error checking setup:", error)
    return NextResponse.json({ hasAdmin: false })
  }
}
