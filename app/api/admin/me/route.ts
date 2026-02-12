import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { getAdminById } from "@/lib/admin-db"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-key")

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const verified = await jwtVerify(token, secret)
    const adminId = verified.payload.sub as string

    const admin = await getAdminById(adminId)
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    })
  } catch (error) {
    console.error("[v0] Error fetching current user:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
