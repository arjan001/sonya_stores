import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Missing email or password' },
        { status: 400 }
      )
    }

    // Find admin
    const result = await query(
      'SELECT id, email, name, password_hash, role, is_active FROM admins WHERE email = $1',
      [email]
    )

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const admin = result.rows[0]

    if (!admin.is_active) {
      return NextResponse.json(
        { message: 'Admin account is inactive' },
        { status: 401 }
      )
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password_hash)

    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create session
    await query(
      `INSERT INTO admin_sessions (admin_id, token_hash, expires_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        admin.id,
        token,
        expiresAt,
        request.headers.get('x-forwarded-for') || 'unknown',
        request.headers.get('user-agent') || 'unknown',
      ]
    )

    // Update last_login
    await query(
      'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [admin.id]
    )

    return NextResponse.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error('[v0] Admin login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
