"use client"

import { useState, useEffect } from "react"
import { FileText, Plus, Edit2, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Policy {
  id: string
  type: string
  title: string
  slug: string
  content: string
  is_published: boolean
  created_at: string
}

const POLICY_TYPES = [
  { value: "privacy", label: "Privacy Policy" },
  { value: "terms", label: "Terms of Service" },
  { value: "refund", label: "Refund & Return Policy" },
  { value: "shipping", label: "Shipping Policy" },
  { value: "about", label: "About Us" },
]

export function PoliciesModule() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: "privacy",
    title: "",
    slug: "",
    content: "",
    is_published: true,
  })

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/policies", {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setPolicies(data)
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.content) return
    try {
      const method = editingId ? "PUT" : "POST"
      const payload = editingId ? { ...formData, id: editingId } : formData

      const res = await fetch("/api/admin/policies", {
        method,
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed")
      setIsDialogOpen(false)
      setEditingId(null)
      resetForm()
      fetchPolicies()
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("Failed to save")
    }
  }

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/policies?id=${id}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const policy = await res.json()
        setFormData({
          type: policy.type,
          title: policy.title,
          slug: policy.slug,
          content: policy.content,
          is_published: policy.is_published,
        })
        setEditingId(id)
        setIsDialogOpen(true)
      }
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this policy?")) return
    try {
      const res = await fetch(`/api/admin/policies?id=${id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error("Failed")
      fetchPolicies()
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("Failed to delete")
    }
  }

  const resetForm = () => {
    setFormData({
      type: "privacy",
      title: "",
      slug: "",
      content: "",
      is_published: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" /> Policies ({policies.length})
        </h2>
        <Button onClick={() => { resetForm(); setEditingId(null); setIsDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Policy
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : policies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p>No policies</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-left font-medium">Type</th>
                <th className="px-6 py-3 text-center font-medium">Status</th>
                <th className="px-6 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id} className="border-t hover:bg-muted/50">
                  <td className="px-6 py-3 font-medium">{policy.title}</td>
                  <td className="px-6 py-3 text-muted-foreground">{policy.type}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      policy.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {policy.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center flex gap-2 justify-center">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(policy.id)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(policy.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Policy" : "Add New Policy"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type *</label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POLICY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="Policy title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            </div>

            <div>
              <label className="text-sm font-medium">Content *</label>
              <Textarea
                placeholder="Policy content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              />
              <span className="text-sm">Published</span>
            </label>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Policy</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
