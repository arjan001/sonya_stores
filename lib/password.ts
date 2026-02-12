import crypto from 'crypto'

// Simple fallback password hashing using native crypto instead of bcrypt
// bcrypt is a native module that fails during build, so we use PBKDF2 instead
export async function hashPassword(password: string, salt?: Buffer): Promise<string> {
  const saltBuffer = salt || crypto.randomBytes(16)
  const hash = crypto.pbkdf2Sync(password, saltBuffer, 100000, 64, 'sha256')
  return `${saltBuffer.toString('hex')}:${hash.toString('hex')}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const [saltHex, hashHex] = hash.split(':')
    const saltBuffer = Buffer.from(saltHex, 'hex')
    const computedHash = crypto.pbkdf2Sync(password, saltBuffer, 100000, 64, 'sha256')
    return computedHash.toString('hex') === hashHex
  } catch {
    return false
  }
}
