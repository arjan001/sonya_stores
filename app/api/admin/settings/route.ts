import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const result = await query(
      'SELECT key, value FROM settings ORDER BY category, key'
    )

    const settings: Record<string, any> = {}
    result.rows.forEach((row: any) => {
      settings[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('[v0] Error fetching settings:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') || 
                  request.headers.get('X-Admin-Token')

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const settingsData = await request.json()
    const updates: Promise<any>[] = []

    for (const [key, value] of Object.entries(settingsData)) {
      updates.push(
        query(
          `UPDATE settings SET value = $1, updated_at = CURRENT_TIMESTAMP
           WHERE key = $2`,
          [JSON.stringify(value), key]
        )
      )
    }

    await Promise.all(updates)

    return NextResponse.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('[v0] Error updating settings:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
