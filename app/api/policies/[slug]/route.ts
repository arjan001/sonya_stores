import { query } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const result = await query(
      "SELECT * FROM policies WHERE slug = $1",
      [slug]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("[v0] Error fetching policy:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await req.json()

    const result = await query(
      `UPDATE policies 
       SET title = $1, content = $2, meta_title = $3, meta_description = $4, 
           meta_keywords = $5, last_updated = CURRENT_TIMESTAMP, updated_by = $6
       WHERE slug = $7
       RETURNING *`,
      [
        body.title,
        body.content,
        body.meta_title || null,
        body.meta_description || null,
        body.meta_keywords || null,
        body.updated_by || "admin",
        slug
      ]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("[v0] Error updating policy:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
