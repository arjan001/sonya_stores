"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, Package, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  discount_price: number | null
  stock_quantity: number
  status: string
  is_featured: boolean
  is_new: boolean
  is_on_sale: boolean
  image_url: string | null
  created_at: string
}

export function ProductsModule() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const pageSize = 20

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    discountPrice: 0,
    costPrice: 0,
    categoryId: "",
    sku: "",
    stockQuantity: 0,
    status: "active",
    isFeatured: false,
    isNew: false,
    isOnSale: false,
    imageUrl: "",
    tags: "",
  })

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [page, searchTerm, selectedCategory])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching categories:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String(page * pageSize),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { categoryId: selectedCategory }),
      })
      const res = await fetch(`/api/admin/products?${params}`)
      if (!res.ok) throw new Error("Failed to fetch products")
      const { products: data, total: count } = await res.json()
      setProducts(data)
      setTotal(count)
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId || !formData.price) {
      alert("Please fill in required fields")
      return
    }

    try {
      setSaving(true)
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
      resetForm()
      setPage(0)
      fetchProducts()
    } catch (error) {
      console.error("[v0] Error saving product:", error)
      alert("Error saving product")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`)
      if (res.ok) {
        const product = await res.json()
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description || "",
          price: product.price,
          discountPrice: product.discount_price || 0,
          costPrice: product.cost_price || 0,
          categoryId: product.category_id,
          sku: product.sku || "",
          stockQuantity: product.stock_quantity || 0,
          status: product.status || "active",
          isFeatured: product.is_featured || false,
          isNew: product.is_new || false,
          isOnSale: product.is_on_sale || false,
          imageUrl: product.image_url || "",
          tags: (product.tags || []).join(", "),
        })
        setEditingId(id)
        setIsDialogOpen(true)
      }
    } catch (error) {
      console.error("[v0] Error fetching product:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setDeleteConfirm(null)
      fetchProducts()
    } catch (error) {
      console.error("[v0] Error deleting product:", error)
      alert("Error deleting product")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: 0,
      discountPrice: 0,
      costPrice: 0,
      categoryId: "",
      sku: "",
      stockQuantity: 0,
      status: "active",
      isFeatured: false,
      isNew: false,
      isOnSale: false,
      imageUrl: "",
      tags: "",
    })
  }

  const totalPages = Math.ceil(total / pageSize)
  const noResults = !loading && products.length === 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Products ({total})
          </h2>
        </div>
        <Button onClick={() => { resetForm(); setEditingId(null); setIsDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0) }}
            className="flex-1"
          />
        </div>
        <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setPage(0) }}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">Loading products...</div>
        </div>
      ) : noResults ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p>No products found</p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Name</th>
                  <th className="px-6 py-3 text-right font-medium">Price</th>
                  <th className="px-6 py-3 text-right font-medium">Stock</th>
                  <th className="px-6 py-3 text-center font-medium">Status</th>
                  <th className="px-6 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t hover:bg-muted/50">
                    <td className="px-6 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        {product.image_url && <img src={product.image_url} alt={product.name} className="h-8 w-8 rounded" />}
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      KSh {product.price.toFixed(2)}
                      {product.discount_price && (
                        <div className="text-xs text-muted-foreground line-through">
                          KSh {product.discount_price.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">{product.stock_quantity}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-700' : 
                        product.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center flex gap-2 justify-center">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(product.id)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirm(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Product Name *</label>
                <Input
                  placeholder="Product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input
                  placeholder="auto-generated"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category *</label>
                <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">SKU</label>
                <Input
                  placeholder="SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price *</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Discount Price</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Discount price"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cost Price</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Cost price"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Stock Quantity</label>
                <Input
                  type="number"
                  placeholder="Stock"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  placeholder="Image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input
                placeholder="e.g., shoes, leather, formal"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">New Product</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isOnSale}
                  onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">On Sale</span>
              </label>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
