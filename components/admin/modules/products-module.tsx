"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice: number | null
  categoryId: string
  isNew: boolean
  isOnOffer: boolean
  offerPercentage: number | null
  inStock: boolean
  createdAt: string
}

export function ProductsModule() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: 0,
    originalPrice: 0,
    categoryId: "",
    isNew: false,
    isOnOffer: false,
    offerPercentage: 0,
    inStock: true,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/products")
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const method = editingId ? "PUT" : "POST"
      const payload = editingId ? { ...formData, id: editingId } : formData

      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to save product")

      setIsDialogOpen(false)
      setEditingId(null)
      setFormData({
        name: "",
        slug: "",
        price: 0,
        originalPrice: 0,
        categoryId: "",
        isNew: false,
        isOnOffer: false,
        offerPercentage: 0,
        inStock: true,
      })
      fetchProducts()
    } catch (error) {
      console.error("[v0] Error saving product:", error)
    }
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      categoryId: product.categoryId,
      isNew: product.isNew,
      isOnOffer: product.isOnOffer,
      offerPercentage: product.offerPercentage || 0,
      inStock: product.inStock,
    })
    setEditingId(product.id)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      fetchProducts()
    } catch (error) {
      console.error("[v0] Error deleting product:", error)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => { setEditingId(null); setFormData({ name: "", slug: "", price: 0, originalPrice: 0, categoryId: "", isNew: false, isOnOffer: false, offerPercentage: 0, inStock: true }); setIsDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Price</th>
                <th className="px-6 py-3 text-left font-medium">Stock</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t hover:bg-muted/50">
                  <td className="px-6 py-3">{product.name}</td>
                  <td className="px-6 py-3">KSh {product.price}</td>
                  <td className="px-6 py-3">{product.inStock ? "In Stock" : "Out"}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Original Price"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || null })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              />
              In Stock
            </label>
            <Button className="w-full" onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
