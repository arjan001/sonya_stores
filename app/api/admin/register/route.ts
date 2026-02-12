import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { hashPassword } from '@/lib/password'

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const existingAdmin = await query(
      'SELECT id FROM admins WHERE email = $1',
      [email]
    )

    if (existingAdmin.rowCount > 0) {
      return NextResponse.json(
        { message: 'Admin with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Determine role - first admin is super_admin
    const adminCount = await query('SELECT COUNT(*) as count FROM admins')
    const role = adminCount.rows[0]?.count === 0 ? 'super_admin' : 'admin'

    // Create admin
    const result = await query(
      `INSERT INTO admins (email, name, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, email, name, role`,
      [email, name, hashedPassword, role]
    )

    const admin = result.rows[0]

    return NextResponse.json(
      {
        message: 'Admin registered successfully',
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Admin registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
