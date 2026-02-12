"use client"

import { useState, useEffect } from "react"
import { Mail, Plus, Trash2, Search, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Subscriber {
  id: string
  email: string
  name: string
  is_active: boolean
  subscribed_at: string
  unsubscribed_at: string | null
}

export function NewsletterModule() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ email: "", name: "" })
  const pageSize = 20

  useEffect(() => {
    fetchSubscribers()
  }, [page, searchTerm])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String(page * pageSize),
        ...(searchTerm && { search: searchTerm }),
      })
      const res = await fetch(`/api/admin/newsletter?${params}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      // Handle both array and { subscribers } formats
      const subscribersList = Array.isArray(data) ? data : (data.subscribers || [])
      setSubscribers(subscribersList)
      setTotal(data.total || subscribersList.length)
    } catch (error) {
      console.error("[v0] Error:", error)
      setSubscribers([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.email) return
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed")
      setIsDialogOpen(false)
      setFormData({ email: "", name: "" })
      setPage(0)
      fetchSubscribers()
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("Failed to add subscriber")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return
    try {
      const res = await fetch(`/api/admin/newsletter?id=${id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error("Failed")
      fetchSubscribers()
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("Failed to remove subscriber")
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="h-6 w-6" /> Newsletter ({total})
        </h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Subscriber
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search email..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(0) }}
          className="flex-1"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : subscribers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p>No subscribers</p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Name</th>
                  <th className="px-6 py-3 text-left font-medium">Email</th>
                  <th className="px-6 py-3 text-center font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Subscribed</th>
                  <th className="px-6 py-3 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-t hover:bg-muted/50">
                    <td className="px-6 py-3">{sub.name}</td>
                    <td className="px-6 py-3">{sub.email}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        sub.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {sub.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">
                      {new Date(sub.subscribed_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(sub.id)}
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
              <span className="text-sm">Page {page + 1} of {totalPages}</span>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Newsletter Subscriber</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Add Subscriber</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
