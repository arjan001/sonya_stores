import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await query("SELECT * FROM policies ORDER BY title ASC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[v0] Error fetching policies:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
