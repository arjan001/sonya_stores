import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { getProducts, getProductsCount, getProduct, createProduct, updateProduct, deleteProduct } from "@/lib/admin-db"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-key")

async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value
    if (!token) return null
    const verified = await jwtVerify(token, secret)
    return verified.payload.sub as string
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const id = searchParams.get("id")
    const search = searchParams.get("search")
    const categoryId = searchParams.get("categoryId")

    if (id) {
      const product = await getProduct(id)
      return NextResponse.json(product)
    }

    const products = await getProducts(limit, offset, search || undefined, categoryId || undefined)
    const total = await getProductsCount(search || undefined, categoryId || undefined)
    
    return NextResponse.json({ products, total })
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const data = await request.json()
    const result = await createProduct(data)

    return NextResponse.json({ id: result.id, message: "Product created", product: result }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id, ...data } = await request.json()
    const result = await updateProduct(id, data)

    return NextResponse.json({ message: "Product updated", product: result })
  } catch (error) {
    console.error("[v0] Error updating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    await deleteProduct(id)
    return NextResponse.json({ message: "Product deleted" })
  } catch (error) {
    console.error("[v0] Error deleting product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


