import { NextResponse } from "next/server"
import { getProductBySlug, getProductsByCategory } from "@/lib/supabase-data"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    let related = []
    if (product.categorySlug) {
      const catProducts = await getProductsByCategory(product.categorySlug)
      related = catProducts.filter((p) => p.id !== product.id).slice(0, 4)
    }

    return NextResponse.json({ product, related })
  } catch (error) {
    console.error("[v0] Failed to fetch product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
