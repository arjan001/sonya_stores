import { query } from "./db"

// ============ ADMIN USERS ============
export async function getAdminByEmail(email: string) {
  const result = await query(
    'SELECT id, email, name, role, password_hash, created_at FROM admins WHERE email = $1',
    [email]
  )
  return result.rows[0] || null
}

export async function getAdminById(id: string) {
  const result = await query(
    'SELECT id, email, name, role, created_at FROM admins WHERE id = $1',
    [id]
  )
  return result.rows[0] || null
}

export async function getAllAdmins() {
  const result = await query(
    'SELECT id, email, name, role, created_at, updated_at FROM admins ORDER BY created_at DESC'
  )
  return result.rows
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

// ============ PRODUCTS ============
export async function getProducts(limit = 100, offset = 0) {
  const result = await query(
    `SELECT id, name, slug, price, original_price, category_id, is_new, is_on_offer, offer_percentage, in_stock, created_at 
     FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  )
  return result.rows
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
    `INSERT INTO products (name, slug, price, original_price, category_id, description, is_new, is_on_offer, offer_percentage, in_stock)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id`,
    [data.name, data.slug, data.price, data.originalPrice, data.categoryId, data.description, data.isNew, data.isOnOffer, data.offerPercentage, data.inStock]
  )
  return result.rows[0].id
}

export async function updateProduct(id: string, data: any) {
  await query(
    `UPDATE products 
     SET name = $1, price = $2, original_price = $3, category_id = $4, description = $5, 
         is_new = $6, is_on_offer = $7, offer_percentage = $8, in_stock = $9, updated_at = CURRENT_TIMESTAMP
     WHERE id = $10`,
    [data.name, data.price, data.originalPrice, data.categoryId, data.description, data.isNew, data.isOnOffer, data.offerPercentage, data.inStock, id]
  )
}

export async function deleteProduct(id: string) {
  await query('DELETE FROM products WHERE id = $1', [id])
}

// ============ CATEGORIES ============
export async function getCategories() {
  const result = await query('SELECT id, name, slug, is_active FROM categories ORDER BY name')
  return result.rows
}

export async function getCategory(id: string) {
  const result = await query('SELECT * FROM categories WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function createCategory(data: any) {
  const result = await query(
    'INSERT INTO categories (name, slug, is_active) VALUES ($1, $2, $3) RETURNING id',
    [data.name, data.slug, data.isActive ?? true]
  )
  return result.rows[0].id
}

export async function updateCategory(id: string, data: any) {
  await query(
    'UPDATE categories SET name = $1, slug = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
    [data.name, data.slug, data.isActive, id]
  )
}

export async function deleteCategory(id: string) {
  await query('DELETE FROM categories WHERE id = $1', [id])
}

// ============ ORDERS ============
export async function getOrders(limit = 100, offset = 0, status?: string) {
  let sql = 'SELECT id, order_number, customer_name, customer_email, total, status, created_at FROM orders'
  const params: any[] = []
  
  if (status) {
    sql += ' WHERE status = $1'
    params.push(status)
    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
  } else {
    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
  }
  
  params.push(limit, offset)
  const result = await query(sql, params)
  return result.rows
}

export async function getOrdersCount(status?: string) {
  let sql = 'SELECT COUNT(*) as count FROM orders'
  const params: any[] = []
  
  if (status) {
    sql += ' WHERE status = $1'
    params.push(status)
  }
  
  const result = await query(sql, params)
  return parseInt(result.rows[0].count, 10)
}

export async function getOrder(id: string) {
  const result = await query('SELECT * FROM orders WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function updateOrderStatus(id: string, status: string) {
  await query(
    'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [status, id]
  )
}

// ============ BANNERS ============
export async function getBanners() {
  const result = await query('SELECT id, title, image_url, link_url, is_active, created_at FROM banners ORDER BY created_at DESC')
  return result.rows
}

export async function getBanner(id: string) {
  const result = await query('SELECT * FROM banners WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function createBanner(data: any) {
  const result = await query(
    'INSERT INTO banners (title, image_url, link_url, is_active) VALUES ($1, $2, $3, $4) RETURNING id',
    [data.title, data.imageUrl, data.linkUrl, data.isActive ?? true]
  )
  return result.rows[0].id
}

export async function updateBanner(id: string, data: any) {
  await query(
    'UPDATE banners SET title = $1, image_url = $2, link_url = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
    [data.title, data.imageUrl, data.linkUrl, data.isActive, id]
  )
}

export async function deleteBanner(id: string) {
  await query('DELETE FROM banners WHERE id = $1', [id])
}

// ============ ANALYTICS ============
export async function getAnalytics() {
  const [totalOrders, pendingOrders, totalRevenue, topCategories] = await Promise.all([
    query('SELECT COUNT(*) as count FROM orders'),
    query('SELECT COUNT(*) as count FROM orders WHERE status = $1', ['pending']),
    query('SELECT SUM(total) as total FROM orders WHERE status = $1', ['completed']),
    query(`SELECT c.name, COUNT(p.id) as count FROM categories c 
           LEFT JOIN products p ON c.id = p.category_id 
           GROUP BY c.id, c.name ORDER BY count DESC LIMIT 5`)
  ])

  return {
    totalOrders: parseInt(totalOrders.rows[0].count, 10),
    pendingOrders: parseInt(pendingOrders.rows[0].count, 10),
    totalRevenue: parseFloat(totalRevenue.rows[0].total || 0),
    topCategories: topCategories.rows
  }
}

// ============ CUSTOMERS ============
export async function getCustomers(limit = 100, offset = 0) {
  const result = await query(
    'SELECT DISTINCT customer_name, customer_email, customer_phone, COUNT(*) as order_count FROM orders GROUP BY customer_email, customer_name, customer_phone LIMIT $1 OFFSET $2',
    [limit, offset]
  )
  return result.rows
}

export async function getCustomersCount() {
  const result = await query('SELECT COUNT(DISTINCT customer_email) as count FROM orders')
  return parseInt(result.rows[0].count, 10)
}
