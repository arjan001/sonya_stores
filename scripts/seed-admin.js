import { Pool } from 'pg'
import crypto from 'crypto'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Simple PBKDF2 password hashing
function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256')
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

async function seedAdmin() {
  try {
    console.log('[v0] Seeding default admin...')

    const email = 'admin@sonyastores.com'
    const name = 'Admin'
    const password = 'Admin123!' // Default password - CHANGE THIS!

    // Check if admin exists
    const existingResult = await pool.query(
      'SELECT id FROM admins WHERE email = $1',
      [email]
    )

    if (existingResult.rows.length > 0) {
      console.log('[v0] Admin already exists')
      process.exit(0)
    }

    // Hash password
    const passwordHash = hashPassword(password)

    // Insert admin
    const result = await pool.query(
      `INSERT INTO admins (id, email, name, password_hash, role, is_active, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, true, CURRENT_TIMESTAMP)
       RETURNING id, email, name, role`,
      [email, name, passwordHash, 'super_admin']
    )

    console.log('[v0] Admin created successfully!')
    console.log('Email:', result.rows[0].email)
    console.log('Name:', result.rows[0].name)
    console.log('Role:', result.rows[0].role)
    console.log('\nDefault credentials:')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log('\n⚠️  IMPORTANT: Change this password immediately after first login!')

    process.exit(0)
  } catch (error) {
    console.error('[v0] Error seeding admin:', error)
    process.exit(1)
  }
}

seedAdmin()
