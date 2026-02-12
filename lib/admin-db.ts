import { query } from "./db"

// ============ PRODUCTS ============
export async function getProducts(limit = 100, offset = 0, search?: string, categoryId?: string) {
  let sql = `SELECT id, name, slug, price, discount_price, stock_quantity, status, is_featured, 
                    is_new, is_on_sale, image_url, created_at 
             FROM products WHERE status != 'archived'`
  const params: any[] = []

  if (search) {
    sql += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`
    params.push(`%${search}%`)
  }

  if (categoryId) {
    sql += ` AND category_id = $${params.length + 1}`
    params.push(categoryId)
  }

  sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
  params.push(limit, offset)

  const result = await query(sql, params)
  return result.rows
}

export async function getProductsCount(search?: string, categoryId?: string) {
  let sql = 'SELECT COUNT(*) as count FROM products WHERE status != $1'
  const params: any[] = ['archived']

  if (search) {
    sql += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`
    params.push(`%${search}%`)
  }

  if (categoryId) {
    sql += ` AND category_id = $${params.length + 1}`
    params.push(categoryId)
  }

  const result = await query(sql, params)
  return parseInt(result.rows[0].count, 10)
}

export async function getProduct(id: string) {
  const result = await query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  )
  return result.rows[0] || null
}

export async function createProduct(data: any) {
  const result = await query(
    `INSERT INTO products (
      name, slug, description, category_id, price, discount_price, cost_price, 
      sku, stock_quantity, status, is_featured, is_new, is_on_sale, image_url, images, tags
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
     RETURNING id, name, slug, price, status, created_at`,
    [
      data.name,
      data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      data.description || '',
      data.categoryId,
      data.price,
      data.discountPrice || null,
      data.costPrice || null,
      data.sku || null,
      data.stockQuantity || 0,
      data.status || 'active',
      data.isFeatured || false,
      data.isNew || false,
      data.isOnSale || false,
      data.imageUrl || null,
      JSON.stringify(data.images || []),
      JSON.stringify(data.tags || [])
    ]
  )
  return result.rows[0]
}

export async function updateProduct(id: string, data: any) {
  const result = await query(
    `UPDATE products 
     SET name = $1, slug = $2, description = $3, category_id = $4, 
         price = $5, discount_price = $6, cost_price = $7, sku = $8,
         stock_quantity = $9, status = $10, is_featured = $11, 
         is_new = $12, is_on_sale = $13, image_url = $14, images = $15, tags = $16, updated_at = CURRENT_TIMESTAMP
     WHERE id = $17
     RETURNING id, name, slug, price, status, updated_at`,
    [
      data.name,
      data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      data.description || '',
      data.categoryId,
      data.price,
      data.discountPrice || null,
      data.costPrice || null,
      data.sku || null,
      data.stockQuantity || 0,
      data.status || 'active',
      data.isFeatured || false,
      data.isNew || false,
      data.isOnSale || false,
      data.imageUrl || null,
      JSON.stringify(data.images || []),
      JSON.stringify(data.tags || []),
      id
    ]
  )
  return result.rows[0]
}

export async function deleteProduct(id: string) {
  await query('UPDATE products SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['archived', id])
}

export async function bulkDeleteProducts(ids: string[]) {
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(',')
  await query(`UPDATE products SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`, ids)
}

// ============ CATEGORIES ============
export async function getCategories() {
  const result = await query(
    'SELECT id, name, slug, description, image_url, is_active, sort_order, created_at FROM categories WHERE is_active = true ORDER BY sort_order ASC'
  )
  return result.rows
}

export async function getAllCategories() {
  const result = await query(
    'SELECT id, name, slug, description, image_url, is_active, sort_order FROM categories ORDER BY sort_order ASC'
  )
  return result.rows
}

export async function getCategory(id: string) {
  const result = await query('SELECT * FROM categories WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function createCategory(data: any) {
  const result = await query(
    `INSERT INTO categories (name, slug, description, image_url, is_active, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, slug, created_at`,
    [
      data.name,
      data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      data.description || null,
      data.imageUrl || null,
      data.isActive ?? true,
      data.sortOrder || 0
    ]
  )
  return result.rows[0]
}

export async function updateCategory(id: string, data: any) {
  const result = await query(
    `UPDATE categories 
     SET name = $1, slug = $2, description = $3, image_url = $4, 
         is_active = $5, sort_order = $6, updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING id, name, slug, updated_at`,
    [
      data.name,
      data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      data.description || null,
      data.imageUrl || null,
      data.isActive ?? true,
      data.sortOrder || 0,
      id
    ]
  )
  return result.rows[0]
}

export async function deleteCategory(id: string) {
  await query('DELETE FROM categories WHERE id = $1', [id])
}

// ============ ORDERS ============
export async function getOrders(limit = 50, offset = 0, status?: string, search?: string) {
  let sql = `SELECT id, order_number, total_amount, status, payment_status, 
                    created_at, shipping_address FROM orders WHERE 1=1`
  const params: any[] = []

  if (status) {
    sql += ` AND status = $${params.length + 1}`
    params.push(status)
  }

  if (search) {
    sql += ` AND (order_number ILIKE $${params.length + 1} OR shipping_address ILIKE $${params.length + 1})`
    params.push(`%${search}%`)
  }

  sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
  params.push(limit, offset)

  const result = await query(sql, params)
  return result.rows
}

export async function getOrdersCount(status?: string, search?: string) {
  let sql = 'SELECT COUNT(*) as count FROM orders WHERE 1=1'
  const params: any[] = []

  if (status) {
    sql += ` AND status = $${params.length + 1}`
    params.push(status)
  }

  if (search) {
    sql += ` AND (order_number ILIKE $${params.length + 1} OR shipping_address ILIKE $${params.length + 1})`
    params.push(`%${search}%`)
  }

  const result = await query(sql, params)
  return parseInt(result.rows[0].count, 10)
}

export async function getOrder(id: string) {
  const result = await query(
    `SELECT * FROM orders WHERE id = $1`,
    [id]
  )
  if (result.rowCount === 0) return null

  const order = result.rows[0]

  // Get order items
  const itemsResult = await query(
    'SELECT * FROM order_items WHERE order_id = $1',
    [id]
  )

  return { ...order, items: itemsResult.rows }
}

export async function updateOrderStatus(id: string, status: string) {
  const result = await query(
    `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2
     RETURNING id, status, updated_at`,
    [status, id]
  )
  return result.rows[0]
}

// ============ BANNERS ============
export async function getBanners() {
  const result = await query(
    'SELECT id, title, image_url, link_url, is_active, created_at FROM banners ORDER BY created_at DESC'
  )
  return result.rows
}

export async function getBanner(id: string) {
  const result = await query('SELECT * FROM banners WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function createBanner(data: any) {
  const result = await query(
    `INSERT INTO banners (title, image_url, link_url, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, created_at`,
    [data.title, data.imageUrl || null, data.linkUrl || '/', data.isActive ?? true]
  )
  return result.rows[0]
}

export async function updateBanner(id: string, data: any) {
  const result = await query(
    `UPDATE banners 
     SET title = $1, image_url = $2, link_url = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING id, title, updated_at`,
    [data.title, data.imageUrl || null, data.linkUrl || '/', data.isActive, id]
  )
  return result.rows[0]
}

export async function deleteBanner(id: string) {
  await query('DELETE FROM banners WHERE id = $1', [id])
}

// ============ ANALYTICS ============
export async function getAnalytics() {
  const [totalOrders, pendingOrders, totalRevenue, totalProducts, activeProducts] = await Promise.all([
    query('SELECT COUNT(*) as count FROM orders'),
    query('SELECT COUNT(*) as count FROM orders WHERE status = $1', ['pending']),
    query('SELECT SUM(total_amount) as total FROM orders WHERE status != $1', ['cancelled']),
    query('SELECT COUNT(*) as count FROM products WHERE status != $1', ['archived']),
    query('SELECT COUNT(*) as count FROM products WHERE status = $1', ['active'])
  ])

  return {
    totalOrders: parseInt(totalOrders.rows[0].count || 0, 10),
    pendingOrders: parseInt(pendingOrders.rows[0].count || 0, 10),
    totalRevenue: parseFloat(totalRevenue.rows[0].total || 0),
    totalProducts: parseInt(totalProducts.rows[0].count || 0, 10),
    activeProducts: parseInt(activeProducts.rows[0].count || 0, 10)
  }
}

// ============ SETTINGS ============
export async function getSetting(key: string) {
  const result = await query(
    'SELECT key, value FROM settings WHERE key = $1',
    [key]
  )
  return result.rows[0] ? JSON.parse(result.rows[0].value) : null
}

export async function getAllSettings() {
  const result = await query('SELECT key, value FROM settings ORDER BY category, key')
  const settings: Record<string, any> = {}
  result.rows.forEach((row: any) => {
    settings[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value
  })
  return settings
}

export async function updateSetting(key: string, value: any) {
  await query(
    'UPDATE settings SET value = $1, updated_at = CURRENT_TIMESTAMP WHERE key = $2',
    [JSON.stringify(value), key]
  )
}

// ============ ADMIN ============
export async function getAdminById(id: string) {
  const result = await query(
    'SELECT id, email, name, role, created_at FROM admins WHERE id = $1',
    [id]
  )
  return result.rows[0] || null
}

export async function getAllAdmins() {
  const result = await query(
    'SELECT id, email, name, role, is_active, created_at, updated_at FROM admins ORDER BY created_at DESC'
  )
  return result.rows
}

export async function getAdminByEmail(email: string) {
  const result = await query(
    'SELECT id, email, name, role, password_hash, is_active, created_at FROM admins WHERE email = $1',
    [email]
  )
  return result.rows[0] || null
}

