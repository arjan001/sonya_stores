import { query } from '../lib/db.js'
import crypto from 'crypto'

// Password hashing using PBKDF2
function hashPassword(password) {
  const saltBuffer = crypto.randomBytes(16)
  const hash = crypto.pbkdf2Sync(password, saltBuffer, 100000, 64, 'sha256')
  return `${saltBuffer.toString('hex')}:${hash.toString('hex')}`
}

async function seedAdmin() {
  try {
    const defaultEmail = 'admin@sonyastores.com'
    const defaultPassword = 'Admin@123456' // Change this!

    console.log('[v0] Seeding default admin user...')

    // Check if admin already exists
    const existing = await query(
      'SELECT id FROM admins WHERE email = $1',
      [defaultEmail]
    )

    if (existing.rows.length > 0) {
      console.log('[v0] Admin already exists:', defaultEmail)
      return
    }

    // Hash password
    const passwordHash = hashPassword(defaultPassword)

    // Insert admin
    const result = await query(
      `INSERT INTO admins (email, name, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, email, name, role`,
      [defaultEmail, 'Super Admin', passwordHash, 'super_admin']
    )

    console.log('[v0] Admin created successfully!')
    console.log('[v0] Email:', result.rows[0].email)
    console.log('[v0] Name:', result.rows[0].name)
    console.log('[v0] Role:', result.rows[0].role)
    console.log('[v0] Default password:', defaultPassword)
    console.log('[v0] ⚠️  IMPORTANT: Change this password immediately after first login!')

    process.exit(0)
  } catch (error) {
    console.error('[v0] Error seeding admin:', error.message)
    process.exit(1)
  }
}

seedAdmin()
