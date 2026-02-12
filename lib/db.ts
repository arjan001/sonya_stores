import { Pool } from 'pg'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    pool = new Pool({ connectionString })
  }
  return pool
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  const client = await getPool().connect()
  try {
    const result = await client.query(text, params)
    return {
      rows: result.rows,
      rowCount: result.rowCount || 0,
    }
  } finally {
    client.release()
  }
}

export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const result = await query<T>(text, params)
  return result.rows[0] || null
}

export async function close(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}
