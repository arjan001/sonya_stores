import { query } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { jwtVerify } from "jose"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

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

export async function POST(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Check if current user is super admin
    const currentAdminResult = await query(
      "SELECT role FROM admins WHERE id = $1",
      [adminId]
    )
    
    if (currentAdminResult.rows.length === 0 || currentAdminResult.rows[0].role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can add users" }, { status: 403 })
    }

    const { email, name, password, role } = await request.json()

    if (!email || !name || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    const existingResult = await query(
      "SELECT id FROM admins WHERE email = $1",
      [email]
    )

    if (existingResult.rows.length > 0) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 })
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    
    const result = await query(
      `INSERT INTO admins (email, name, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, email, name, role, is_active, created_at`,
      [email, name, passwordHash, role]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
