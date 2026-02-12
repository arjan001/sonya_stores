"use client"

import { useState, useEffect } from "react"
import { Zap, Plus, Edit2, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Offer {
  id: string
  title: string
  description: string | null
  discount_percentage: number | null
  discount_amount: number | null
  applies_to: string
  product_id: string | null
  category_id: string | null
  start_date: string
  end_date: string
  is_active: boolean
}

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
}

export function OffersModule() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percentage: 0,
    discount_amount: 0,
    applies_to: "category",
    product_id: "",
    category_id: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    is_active: true,
  })

  useEffect(() => {
    Promise.all([fetchOffers(), fetchProducts(), fetchCategories()])
  }, [])

  const fetchOffers = async () => {
    try {
      const res = await fetch("/api/admin/offers", {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setOffers(data)
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products?limit=1000", {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const { products: data } = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories", {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const handleSave = async () => {
    if (!formData.title) return
    try {
      const method = editingId ? "PUT" : "POST"
      const payload = editingId ? { ...formData, id: editingId } : formData

      const res = await fetch("/api/admin/offers", {
        method,
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed")
      setIsDialogOpen(false)
      setEditingId(null)
      resetForm()
      fetchOffers()
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("Failed to save")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this offer?")) return
    try {
      const res = await fetch(`/api/admin/offers?id=${id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error("Failed")
      fetchOffers()
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("Failed to delete")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discount_percentage: 0,
      discount_amount: 0,
      applies_to: "category",
      product_id: "",
      category_id: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      is_active: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6" /> Offers & Promotions ({offers.length})
        </h2>
        <Button onClick={() => { resetForm(); setEditingId(null); setIsDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Offer
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p>No offers</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-left font-medium">Discount</th>
                <th className="px-6 py-3 text-center font-medium">Applies To</th>
                <th className="px-6 py-3 text-center font-medium">Status</th>
                <th className="px-6 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-t hover:bg-muted/50">
                  <td className="px-6 py-3 font-medium">{offer.title}</td>
                  <td className="px-6 py-3">
                    {offer.discount_percentage ? `${offer.discount_percentage}%` : `KSh ${offer.discount_amount}`}
                  </td>
                  <td className="px-6 py-3 text-center capitalize">{offer.applies_to}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      offer.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {offer.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center flex gap-2 justify-center">
                    <Button size="sm" variant="ghost" onClick={() => {
                      const offer = offers.find(o => o.id === offer.id)
                      if (offer) {
                        setFormData({
                          title: offer.title,
                          description: offer.description || '',
                          discount_percentage: offer.discount_percentage || 0,
                          discount_amount: offer.discount_amount || 0,
                          applies_to: offer.applies_to,
                          product_id: offer.product_id || '',
                          category_id: offer.category_id || '',
                          start_date: offer.start_date,
                          end_date: offer.end_date,
                          is_active: offer.is_active,
                        })
                        setEditingId(offer.id)
                        setIsDialogOpen(true)
                      }
                    }}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(offer.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Offer" : "Add New Offer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="Offer title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Offer description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Applies To *</label>
                <Select value={formData.applies_to} onValueChange={(v) => setFormData({ ...formData, applies_to: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="all">All Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.applies_to === "category" && (
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.applies_to === "product" && (
                <div>
                  <label className="text-sm font-medium">Product</label>
                  <Select value={formData.product_id} onValueChange={(v) => setFormData({ ...formData, product_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((prod) => (
                        <SelectItem key={prod.id} value={prod.id}>{prod.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Discount %</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Or Flat Amount (KSh)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discount_amount}
                  onChange={(e) => setFormData({ ...formData, discount_amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span className="text-sm">Active</span>
            </label>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Offer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
