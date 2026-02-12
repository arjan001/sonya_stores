"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Banner {
  id: string
  title: string
  image_url: string
  link_url: string
  is_active: boolean
}

export function BannersModule() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    linkUrl: "",
    isActive: true,
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/banners")
      if (!res.ok) throw new Error("Failed to fetch banners")
      const data = await res.json()
      setBanners(data)
    } catch (error) {
      console.error("[v0] Error fetching banners:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const method = editingId ? "PUT" : "POST"
      const payload = editingId ? { ...formData, id: editingId } : formData

      const res = await fetch("/api/admin/banners", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to save banner")

      setIsDialogOpen(false)
      setEditingId(null)
      setFormData({ title: "", imageUrl: "", linkUrl: "", isActive: true })
      fetchBanners()
    } catch (error) {
      console.error("[v0] Error saving banner:", error)
    }
  }

  const handleEdit = (banner: Banner) => {
    setFormData({
      title: banner.title,
      imageUrl: banner.image_url,
      linkUrl: banner.link_url,
      isActive: banner.is_active,
    })
    setEditingId(banner.id)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      fetchBanners()
    } catch (error) {
      console.error("[v0] Error deleting banner:", error)
    }
  }

  const filtered = banners.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners</h1>
        <Button onClick={() => { setEditingId(null); setFormData({ title: "", imageUrl: "", linkUrl: "", isActive: true }); setIsDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Banner
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search banners..."
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
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-left font-medium">Link</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((banner) => (
                <tr key={banner.id} className="border-t hover:bg-muted/50">
                  <td className="px-6 py-3">{banner.title}</td>
                  <td className="px-6 py-3 text-muted-foreground text-xs">{banner.link_url}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${banner.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {banner.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(banner)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(banner.id)}>
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
            <DialogTitle>{editingId ? "Edit" : "Add"} Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              placeholder="Banner Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              placeholder="Link URL"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
            <Button className="w-full" onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
