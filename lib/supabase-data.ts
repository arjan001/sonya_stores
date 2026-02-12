import { query } from "@/lib/db"
import type { Product, Category, DeliveryLocation, Offer, HeroBanner } from "./types"

export function formatPrice(price: number): string {
  return `KSh ${price.toLocaleString()}`
}

function mapProduct(row: Record<string, unknown>): Product {
  let images: string[] = ["/placeholder.svg?height=800&width=600"]
  if (row.images) {
    try {
      const parsed = typeof row.images === "string" ? JSON.parse(row.images) : row.images
      if (Array.isArray(parsed) && parsed.length > 0) images = parsed
    } catch { /* fallback */ }
  } else if (row.image_url) {
    images = [row.image_url as string]
  }

  let tags: string[] = []
  if (row.tags) {
    try {
      tags = typeof row.tags === "string" ? JSON.parse(row.tags) : (row.tags as string[])
    } catch { /* fallback */ }
  }

  const salePrice = row.discount_price ? Number(row.discount_price) : null
  const basePrice = Number(row.price)

  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    price: salePrice || basePrice,
    originalPrice: salePrice ? basePrice : undefined,
    images,
    category: (row.category_name as string) || "",
    categorySlug: (row.category_slug as string) || "",
    description: (row.description as string) || "",
    tags,
    isNew: (row.is_new as boolean) || false,
    isOnOffer: (row.is_on_sale as boolean) || false,
    offerPercentage: salePrice ? Math.round((1 - salePrice / basePrice) * 100) : undefined,
    inStock: Number(row.stock_quantity ?? 0) > 0,
    createdAt: (row.created_at as string) || "",
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'active'
       ORDER BY p.is_featured DESC NULLS LAST, p.created_at DESC`
    )
    return result.rows.map(mapProduct)
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1`,
      [slug]
    )
    return result.rows.length > 0 ? mapProduct(result.rows[0]) : null
  } catch (error) {
    console.error("[v0] Error fetching product by slug:", error)
    return null
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE c.slug = $1 AND p.status = 'active'
       ORDER BY p.created_at DESC`,
      [categorySlug]
    )
    return result.rows.map(mapProduct)
  } catch (error) {
    console.error("[v0] Error fetching products by category:", error)
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const result = await query(
      `SELECT c.id, c.name, c.slug, c.image_url, c.sort_order,
              (SELECT COUNT(*) FROM products WHERE category_id = c.id AND status = 'active') as product_count
       FROM categories c
       WHERE c.is_active = true
       ORDER BY c.sort_order ASC`
    )
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      image: row.image_url || "/placeholder.svg?height=500&width=400",
      productCount: parseInt(row.product_count) || 0,
    }))
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return []
  }
}

export async function getDeliveryLocations(): Promise<DeliveryLocation[]> {
  try {
    const result = await query(
      `SELECT id, name, cost, delivery_time_days FROM delivery_settings WHERE is_active = true ORDER BY cost ASC`
    )
    return result.rows.map((row) => ({
      id: row.id, name: row.name, fee: Number(row.cost),
      estimatedDays: row.delivery_time_days?.toString() || "",
    }))
  } catch { return [] }
}

export async function getNavbarOffers(): Promise<string[]> {
  try {
    const result = await query(`SELECT title FROM offers WHERE is_active = true ORDER BY created_at DESC LIMIT 3`)
    return result.rows.map((row) => row.title)
  } catch { return [] }
}

export async function getPopupOffer(): Promise<Offer | null> {
  try {
    const result = await query(
      `SELECT id, title, description, discount_percentage FROM offers WHERE is_active = true ORDER BY created_at DESC LIMIT 1`
    )
    if (result.rows.length === 0) return null
    const row = result.rows[0]
    return { id: row.id, title: row.title, description: row.description || "",
      discount: row.discount_percentage ? `${row.discount_percentage}% OFF` : "",
      image: "", validUntil: "2026-12-31" }
  } catch { return null }
}

export async function getSiteSettings() {
  try {
    const result = await query(`SELECT key, value FROM settings LIMIT 20`)
    const settings: Record<string, unknown> = {}
    result.rows.forEach((row) => { settings[row.key] = row.value })
    return settings
  } catch { return {} }
}

export async function createOrder(order: {
  customerName: string
  customerEmail?: string
  customerPhone: string
  deliveryLocationId?: string
  deliveryAddress: string
  deliveryFee: number
  subtotal: number
  total: number
  notes?: string
  orderedVia?: string
  paymentMethod?: string
  mpesaCode?: string
  mpesaPhone?: string
  mpesaMessage?: string
  items: { productId: string; name?: string; quantity: number; price?: number; unitPrice?: number; variation?: string; image?: string }[]
}) {
  try {
    const orderNumber = `SS-${Date.now().toString(36).toUpperCase()}`

    // Find or create customer
    let customerId: string | null = null
    try {
      const existing = await query(`SELECT id FROM customers WHERE phone = $1 LIMIT 1`, [order.customerPhone])
      if (existing.rows.length > 0) {
        customerId = existing.rows[0].id
      } else {
        const newCust = await query(
          `INSERT INTO customers (first_name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING id`,
          [order.customerName, order.customerEmail || null, order.customerPhone, order.deliveryAddress]
        )
        customerId = newCust.rows[0].id
      }
    } catch (e) {
      console.error("[v0] Customer creation error (non-critical):", e)
    }

    const orderResult = await query(
      `INSERT INTO orders (order_number, customer_id, shipping_address, shipping_amount, total_amount, notes, status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'pending') RETURNING id`,
      [orderNumber, customerId, order.deliveryAddress, order.deliveryFee, order.total, order.notes || null]
    )
    const orderId = orderResult.rows[0].id

    for (const item of order.items) {
      const unitPrice = item.unitPrice || item.price || 0
      await query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.productId, item.quantity, unitPrice, item.quantity * unitPrice]
      )
    }

    return { orderNumber, orderId }
  } catch (error) {
    console.error("[v0] Error creating order:", error)
    throw error
  }
}

export async function getHeroBanners(): Promise<HeroBanner[]> {
  try {
    const result = await query(`SELECT * FROM banners WHERE is_active = true ORDER BY sort_order ASC`)
    return result.rows.map((row) => ({
      id: row.id, title: row.title || "", subtitle: "", collection: "",
      bannerImage: row.image_url || "/placeholder.svg?height=600&width=1200",
      linkUrl: row.link_url || "/shop", buttonText: "Shop Now", sortOrder: row.sort_order || 0,
    }))
  } catch { return [] }
}

export async function searchProducts(query: string, limit = 100, offset = 0): Promise<Product[]> {
  try {
    if (query.length < 2) return []
    const searchTerm = `%${query}%`
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'active'
       AND (p.name ILIKE $1 OR p.description ILIKE $1 OR p.tags::text ILIKE $1)
       ORDER BY p.is_featured DESC NULLS LAST, p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [searchTerm, limit, offset]
    )
    return result.rows.map(mapProduct)
  } catch (error) {
    console.error("[v0] Error searching products:", error)
    return []
  }
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  return getProductsByCategory(collection)
}
