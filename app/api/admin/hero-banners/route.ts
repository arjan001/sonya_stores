import { query } from "@/lib/db"
import { NextResponse, type NextRequest } from "next/server"
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

export async function GET() {
  try {
    const result = await query(
      "SELECT * FROM banners ORDER BY sort_order ASC"
    )
    return NextResponse.json(result.rows || [])
  } catch (error) {
    console.error("[v0] Banners fetch error:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(req)
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()

    const result = await query(
      `INSERT INTO banners (title, description, category, image_url, link_url, cta_text, is_active, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        body.title,
        body.subtitle || null,
        body.collection,
        body.bannerImage || null,
        body.linkUrl || `/shop/${body.collection}`,
        body.buttonText || "Shop Now",
        body.isActive ?? true,
        body.sortOrder ?? 0,
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Banner create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()

  const { error } = await supabase
    .from("hero_banners")
    .update({
      title: body.title,
      subtitle: body.subtitle || null,
      collection: body.collection,
      banner_image: body.bannerImage || null,
      link_url: body.linkUrl || `/shop/${body.collection}`,
      button_text: body.buttonText || "Shop Now",
      is_active: body.isActive ?? true,
      sort_order: body.sortOrder ?? 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const { error } = await supabase.from("hero_banners").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
