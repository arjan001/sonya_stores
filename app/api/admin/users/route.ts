import { query } from "@/lib/db"
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

export async function GET(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const result = await query(
      "SELECT id, email, name, role, is_active, last_login, created_at FROM admins ORDER BY created_at DESC"
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Check if current user is super admin
    const currentAdminResult = await query(
      "SELECT role FROM admins WHERE id = $1",
      [adminId]
    )
    
    if (currentAdminResult.rows.length === 0 || currentAdminResult.rows[0].role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can modify users" }, { status: 403 })
    }

    const body = await request.json()
    const { id, role, is_active, name } = body

    const result = await query(
      `UPDATE admins 
       SET role = COALESCE($1, role), is_active = COALESCE($2, is_active), name = COALESCE($3, name)
       WHERE id = $4
       RETURNING id, email, name, role, is_active, created_at`,
      [role || null, is_active !== undefined ? is_active : null, name || null, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("[v0] Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Check if current user is super admin
    const currentAdminResult = await query(
      "SELECT role FROM admins WHERE id = $1",
      [adminId]
    )
    
    if (currentAdminResult.rows.length === 0 || currentAdminResult.rows[0].role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can delete users" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 })

    // Prevent self-deletion
    if (id === adminId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    await query("DELETE FROM admins WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
