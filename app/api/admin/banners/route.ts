import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { getBanners, getBanner, createBanner, updateBanner, deleteBanner } from "@/lib/admin-db"

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
      const banner = await getBanner(id)
      return NextResponse.json(banner)
    }

    const banners = await getBanners()
    return NextResponse.json(banners)
  } catch (error) {
    console.error("[v0] Error fetching banners:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const data = await request.json()
    const id = await createBanner(data)

    return NextResponse.json({ id, message: "Banner created" })
  } catch (error) {
    console.error("[v0] Error creating banner:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id, ...data } = await request.json()
    await updateBanner(id, data)

    return NextResponse.json({ message: "Banner updated" })
  } catch (error) {
    console.error("[v0] Error updating banner:", error)
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

    await deleteBanner(id)
    return NextResponse.json({ message: "Banner deleted" })
  } catch (error) {
    console.error("[v0] Error deleting banner:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

