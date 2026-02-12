import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyPassword } from '@/lib/password'
import { randomBytes } from 'crypto'
import { SignJWT } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-key")

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    console.log('[v0] Login attempt for:', email)

    if (!email || !password) {
      console.log('[v0] Missing email or password')
      return NextResponse.json(
        { message: 'Missing email or password' },
        { status: 400 }
      )
    }

    // Find admin
    console.log('[v0] Querying admins table...')
    const result = await query(
      'SELECT id, email, name, password_hash, role, is_active FROM admins WHERE email = $1',
      [email]
    )
    
    console.log('[v0] Query result rowCount:', result.rowCount)

    if (result.rowCount === 0) {
      console.log('[v0] Admin not found:', email)
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const admin = result.rows[0]
    console.log('[v0] Admin found:', admin.email, 'Active:', admin.is_active, 'Role:', admin.role)

    if (!admin.is_active) {
      console.log('[v0] Admin account inactive:', email)
      return NextResponse.json(
        { message: 'Admin account is inactive' },
        { status: 401 }
      )
    }

    // Verify password
    console.log('[v0] Verifying password...')
    const passwordMatch = await verifyPassword(password, admin.password_hash)
    console.log('[v0] Password verification result:', passwordMatch)

    if (!passwordMatch) {
      console.log('[v0] Password mismatch for:', email)
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    console.log('[v0] Generating JWT token...')
    const token = await new SignJWT({ sub: admin.id, email: admin.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret)

    console.log('[v0] Login successful for:', email)

    // Create session record
    console.log('[v0] Creating session record...')
    try {
      await query(
        `INSERT INTO admin_sessions (admin_id, token_hash, expires_at, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          admin.id,
          token.substring(0, 50),
          new Date(Date.now() + 24 * 60 * 60 * 1000),
          request.headers.get('x-forwarded-for') || 'unknown',
          request.headers.get('user-agent') || 'unknown',
        ]
      )
    } catch (sessionError) {
      console.error('[v0] Session record error (non-critical):', sessionError)
      // Don't fail login if session record fails
    }

    // Update last_login
    console.log('[v0] Updating last_login...')
    try {
      await query(
        'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [admin.id]
      )
    } catch (updateError) {
      console.error('[v0] Last login update error (non-critical):', updateError)
      // Don't fail login if update fails
    }

    // Create response with token in HTTP-only cookie
    const response = NextResponse.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    })

    // Set HTTP-only cookie with token
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    })

    console.log('[v0] Returning successful login response')
    return response
  } catch (error) {
    console.error('[v0] Admin login error:', error)
    console.error('[v0] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    })
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
