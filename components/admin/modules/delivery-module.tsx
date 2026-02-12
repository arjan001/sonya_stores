"use client"

import { useState, useEffect } from "react"
import { Truck, Plus, Edit2, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Delivery {
  id: string
  name: string
  description: string | null
  delivery_time_days: number
  cost: number
  is_active: boolean
  created_at: string
}

export function DeliveryModule() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    delivery_time_days: 1,
    cost: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/delivery", {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setDeliveries(data)
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name) return
    try {
      const method = editingId ? "PUT" : "POST"
      const payload = editingId ? { ...formData, id: editingId } : formData

      const res = await fetch("/api/admin/delivery", {
        method,
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed")
      setIsDialogOpen(false)
      setEditingId(null)
      resetForm()
      fetchDeliveries()
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("Failed to save")
    }
  }

  const handleEdit = (delivery: Delivery) => {
    setFormData({
      name: delivery.name,
      description: delivery.description || "",
      delivery_time_days: delivery.delivery_time_days,
      cost: delivery.cost,
      is_active: delivery.is_active,
    })
    setEditingId(delivery.id)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this delivery option?")) return
    try {
      const res = await fetch(`/api/admin/delivery?id=${id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error("Failed")
      fetchDeliveries()
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("Failed to delete")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      delivery_time_days: 1,
      cost: 0,
      is_active: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="h-6 w-6" /> Delivery Options ({deliveries.length})
        </h2>
        <Button onClick={() => { resetForm(); setEditingId(null); setIsDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Option
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : deliveries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p>No delivery options</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-center font-medium">Delivery Time</th>
                <th className="px-6 py-3 text-right font-medium">Cost (KSh)</th>
                <th className="px-6 py-3 text-center font-medium">Status</th>
                <th className="px-6 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="border-t hover:bg-muted/50">
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-medium">{delivery.name}</p>
                      {delivery.description && (
                        <p className="text-xs text-muted-foreground mt-1">{delivery.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">{delivery.delivery_time_days} day(s)</td>
                  <td className="px-6 py-3 text-right font-semibold">KSh {delivery.cost.toFixed(2)}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      delivery.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {delivery.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center flex gap-2 justify-center">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(delivery)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(delivery.id)} className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{delivery.name}</h3>
                  <p className="text-sm text-muted-foreground">{delivery.delivery_time_days} day(s)</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  delivery.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {delivery.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              {delivery.description && (
                <p className="text-sm text-muted-foreground mb-3">{delivery.description}</p>
              )}
              <div className="mb-4">
                <p className="text-2xl font-bold text-green-600">KSh {delivery.cost}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(delivery)} className="flex-1">
                  <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(delivery.id)} className="text-red-500 flex-1">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Delivery Option" : "Add Delivery Option"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input
                placeholder="e.g., Express Delivery"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Delivery description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Days</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.delivery_time_days}
                  onChange={(e) => setFormData({ ...formData, delivery_time_days: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cost (KSh)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
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
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
