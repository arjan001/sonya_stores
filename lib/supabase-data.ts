import { query } from "@/lib/db"
import type { Product, Category, DeliveryLocation, Offer, HeroBanner } from "./types"

export function formatPrice(price: number): string {
  return `KSh ${price.toLocaleString()}`
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    images: row.images ? (JSON.parse(row.images as string) as string[]) : ["/placeholder.svg?height=800&width=600"],
    category: row.category_name as string,
    categorySlug: row.category_slug as string,
    description: (row.description as string) || "",
    tags: row.tags ? (JSON.parse(row.tags as string) as string[]) : [],
    collection: (row.collection as string) || "unisex",
    isNew: row.is_new as boolean,
    isOnOffer: row.is_on_offer as boolean,
    offerPercentage: row.offer_percentage ? Number(row.offer_percentage) : undefined,
    inStock: row.in_stock as boolean,
    createdAt: (row.created_at as string) || "",
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = true
       ORDER BY p.sort_order ASC`
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
       WHERE p.slug = $1 AND p.is_active = true`,
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
       WHERE c.slug = $1 AND p.is_active = true
       ORDER BY p.sort_order ASC`,
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
      `SELECT id, name, slug, image_url, 
              (SELECT COUNT(*) FROM products WHERE category_id = categories.id AND is_active = true) as product_count
       FROM categories
       WHERE is_active = true
       ORDER BY sort_order ASC`
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
      `SELECT id, name, cost as fee, delivery_time_days as estimated_days
       FROM delivery_settings
       WHERE is_active = true
       ORDER BY cost ASC`
    )
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      fee: Number(row.fee),
      estimatedDays: row.estimated_days?.toString() || "",
    }))
  } catch (error) {
    console.error("[v0] Error fetching delivery locations:", error)
    return []
  }
}

export async function getNavbarOffers(): Promise<string[]> {
  try {
    const result = await query(
      `SELECT title FROM offers
       WHERE is_active = true AND type = 'navbar'
       ORDER BY sort_order ASC
       LIMIT 3`
    )
    return result.rows.map((row) => row.title)
  } catch (error) {
    console.error("[v0] Error fetching navbar offers:", error)
    return []
  }
}

export async function getPopupOffer(): Promise<Offer | null> {
  try {
    const result = await query(
      `SELECT id, title, description, discount_percentage, image_url
       FROM offers
       WHERE is_active = true AND type = 'popup'
       ORDER BY created_at DESC
       LIMIT 1`
    )
    if (result.rows.length === 0) return null
    const row = result.rows[0]
    return {
      id: row.id,
      title: row.title,
      description: row.description || "",
      discount: row.discount_percentage ? `${row.discount_percentage}% OFF` : "",
      image: row.image_url || "",
      validUntil: "2026-12-31",
    }
  } catch (error) {
    console.error("[v0] Error fetching popup offer:", error)
    return null
  }
}

export async function getSiteSettings() {
  try {
    const result = await query(`SELECT * FROM settings LIMIT 5`)
    const settings: Record<string, unknown> = {}
    result.rows.forEach((row) => {
      settings[row.key] = row.value
    })
    return settings
  } catch (error) {
    console.error("[v0] Error fetching site settings:", error)
    return {}
  }
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
  orderedVia: string
  paymentMethod?: string
  mpesaCode?: string
  mpesaPhone?: string
  mpesaMessage?: string
  items: {
    productId: string
    productName: string
    productImage?: string
    variation?: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
}) {
  try {
    const orderNumber = `SS-${Date.now().toString(36).toUpperCase()}`

    const orderResult = await query(
      `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, delivery_address, 
       delivery_fee, subtotal, total, notes, ordered_via, payment_method, mpesa_code, mpesa_phone, mpesa_message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING id`,
      [
        orderNumber, order.customerName, order.customerEmail || null, order.customerPhone,
        order.deliveryAddress, order.deliveryFee, order.subtotal, order.total,
        order.notes || null, order.orderedVia, order.paymentMethod || "cod",
        order.mpesaCode || null, order.mpesaPhone || null, order.mpesaMessage || null, "pending"
      ]
    )

    const orderId = orderResult.rows[0].id

    // Insert order items
    for (const item of order.items) {
      await query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, variation, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [orderId, item.productId, item.productName, item.productImage || null, 
         item.variation || null, item.quantity, item.unitPrice, item.totalPrice]
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
    const result = await query(
      `SELECT id, title, description as subtitle, category as collection, image_url as banner_image, 
              link_url, cta_text as button_text, sort_order
       FROM banners
       WHERE is_active = true
       ORDER BY sort_order ASC`
    )
    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle || "",
      collection: row.collection,
      bannerImage: row.banner_image || `/banners/${row.collection}-collection.jpg`,
      linkUrl: row.link_url,
      buttonText: row.button_text || "Shop Now",
      sortOrder: row.sort_order,
    }))
  } catch (error) {
    console.error("[v0] Error fetching hero banners:", error)
    return []
  }
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  try {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.collection = $1 AND p.is_active = true
       ORDER BY p.sort_order ASC`,
      [collection]
    )
    return result.rows.map(mapProduct)
  } catch (error) {
    console.error("[v0] Error fetching products by collection:", error)
    return []
  }
}
