import { createClient } from "@/lib/supabase/server"
import type { Product, Category, DeliveryLocation, Offer, HeroBanner } from "./types"

export function formatPrice(price: number): string {
  return `KSh ${price.toLocaleString()}`
}

function mapProduct(row: Record<string, unknown>, images: Record<string, unknown>[], variations: Record<string, unknown>[], productTags: Record<string, string[]> = {}): Product {
  const productImages = images
    .filter((img) => img.product_id === row.id)
    .sort((a, b) => (a.sort_order as number) - (b.sort_order as number))
    .map((img) => img.url as string)

  const productVariations = variations
    .filter((v) => v.product_id === row.id)
    .reduce<Record<string, Set<string>>>((acc, v) => {
      const label = v.label as string
      if (!acc[label]) acc[label] = new Set()
      acc[label].add(v.value as string)
      return acc
    }, {})

  const variationsList = Object.entries(productVariations).map(([type, options]) => ({
    type,
    options: Array.from(options),
  }))

  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    images: productImages.length > 0 ? productImages : ["/placeholder.svg?height=800&width=600"],
    category: (row as Record<string, unknown> & { categories?: { name: string; slug: string } }).categories?.name || "",
    categorySlug: (row as Record<string, unknown> & { categories?: { name: string; slug: string } }).categories?.slug || "",
    description: (row.description as string) || "",
    variations: variationsList.length > 0 ? variationsList : undefined,
    tags: productTags[row.id as string] || [],
    collection: (row.collection as string) || "unisex",
    isNew: row.is_new as boolean,
    isOnOffer: row.is_on_offer as boolean,
    offerPercentage: row.offer_percentage ? Number(row.offer_percentage) : undefined,
    inStock: row.in_stock as boolean,
    createdAt: (row.created_at as string) || "",
  }
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const [productsRes, imagesRes, variationsRes, productTagsRes] = await Promise.all([
    supabase.from("products").select("*, categories(name, slug)").order("sort_order", { ascending: true }),
    supabase.from("product_images").select("*").order("sort_order", { ascending: true }),
    supabase.from("product_variations").select("*"),
    supabase.from("product_tags").select("product_id, tags(name)"),
  ])

  if (!productsRes.data) return []

  const tagMap: Record<string, string[]> = {}
  for (const pt of productTagsRes.data || []) {
    const pid = pt.product_id as string
    const tagName = (pt as Record<string, unknown> & { tags?: { name: string } }).tags?.name
    if (tagName) {
      if (!tagMap[pid]) tagMap[pid] = []
      tagMap[pid].push(tagName)
    }
  }

  return productsRes.data.map((row) =>
    mapProduct(row, imagesRes.data || [], variationsRes.data || [], tagMap)
  )
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data: row } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .single()

  if (!row) return null

  const [imagesRes, variationsRes, ptRes] = await Promise.all([
    supabase.from("product_images").select("*").eq("product_id", row.id).order("sort_order", { ascending: true }),
    supabase.from("product_variations").select("*").eq("product_id", row.id),
    supabase.from("product_tags").select("product_id, tags(name)").eq("product_id", row.id),
  ])

  const tagMap: Record<string, string[]> = {}
  for (const pt of ptRes.data || []) {
    const pid = pt.product_id as string
    const tagName = (pt as Record<string, unknown> & { tags?: { name: string } }).tags?.name
    if (tagName) {
      if (!tagMap[pid]) tagMap[pid] = []
      tagMap[pid].push(tagName)
    }
  }

  return mapProduct(row, imagesRes.data || [], variationsRes.data || [], tagMap)
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single()

  if (!category) return []

  const [productsRes, imagesRes, variationsRes] = await Promise.all([
    supabase.from("products").select("*, categories(name, slug)").eq("category_id", category.id),
    supabase.from("product_images").select("*"),
    supabase.from("product_variations").select("*"),
  ])

  if (!productsRes.data) return []

  return productsRes.data.map((row) =>
    mapProduct(row, imagesRes.data || [], variationsRes.data || [])
  )
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (!categories) return []

  // Get product counts per category
  const { data: products } = await supabase
    .from("products")
    .select("category_id")

  const countMap: Record<string, number> = {}
  for (const p of products || []) {
    countMap[p.category_id] = (countMap[p.category_id] || 0) + 1
  }

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    image: cat.image_url || "/placeholder.svg?height=500&width=400",
    productCount: countMap[cat.id] || 0,
  }))
}

export async function getDeliveryLocations(): Promise<DeliveryLocation[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("delivery_locations")
    .select("*")
    .eq("is_active", true)
    .order("fee", { ascending: true })

  if (!data) return []

  return data.map((loc) => ({
    id: loc.id,
    name: loc.name,
    fee: Number(loc.fee),
    estimatedDays: loc.estimated_days || "",
  }))
}

export async function getNavbarOffers(): Promise<string[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("navbar_offers")
    .select("text")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  return data?.map((o) => o.text) || []
}

export async function getPopupOffer(): Promise<Offer | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("popup_offers")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .single()

  if (!data) return null

  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    discount: data.discount_percentage ? `${data.discount_percentage}% OFF` : "",
    image: data.image_url || "",
    validUntil: "2026-06-30",
  }
}

export async function getSiteSettings() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single()

  return data
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
  const supabase = await createClient()

  // Generate order number
  const orderNumber = `KF-${Date.now().toString(36).toUpperCase()}`

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: order.customerName,
      customer_email: order.customerEmail || null,
      customer_phone: order.customerPhone,
      delivery_location_id: order.deliveryLocationId || null,
      delivery_address: order.deliveryAddress,
      delivery_fee: order.deliveryFee,
      subtotal: order.subtotal,
      total: order.total,
      notes: order.notes || null,
      ordered_via: order.orderedVia,
      payment_method: order.paymentMethod || "cod",
      mpesa_code: order.mpesaCode || null,
      mpesa_phone: order.mpesaPhone || null,
      mpesa_message: order.mpesaMessage || null,
      status: "pending",
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Insert order items
  const orderItems = order.items.map((item) => ({
    order_id: orderData.id,
    product_id: item.productId,
    product_name: item.productName,
    product_image: item.productImage || null,
    variation: item.variation || null,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.totalPrice,
  }))

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems)

  if (itemsError) throw itemsError

  return { orderNumber: orderData.order_number, orderId: orderData.id }
}

export async function getHeroBanners(): Promise<HeroBanner[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("hero_banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (!data) return []

  return data.map((b) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle || "",
    collection: b.collection,
    bannerImage: b.banner_image || `/banners/${b.collection}-collection.jpg`,
    linkUrl: b.link_url,
    buttonText: b.button_text || "Shop Now",
    sortOrder: b.sort_order,
  }))
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  const supabase = await createClient()

  const [productsRes, imagesRes, variationsRes, productTagsRes] = await Promise.all([
    supabase.from("products").select("*, categories(name, slug)").eq("collection", collection).order("sort_order", { ascending: true }),
    supabase.from("product_images").select("*").order("sort_order", { ascending: true }),
    supabase.from("product_variations").select("*"),
    supabase.from("product_tags").select("product_id, tags(name)"),
  ])

  if (!productsRes.data) return []

  const tagMap: Record<string, string[]> = {}
  for (const pt of productTagsRes.data || []) {
    const pid = pt.product_id as string
    const tagName = (pt as Record<string, unknown> & { tags?: { name: string } }).tags?.name
    if (tagName) {
      if (!tagMap[pid]) tagMap[pid] = []
      tagMap[pid].push(tagName)
    }
  }

  return productsRes.data.map((row) =>
    mapProduct(row, imagesRes.data || [], variationsRes.data || [], tagMap)
  )
}
