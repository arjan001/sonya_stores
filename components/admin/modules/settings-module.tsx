"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Settings {
  [key: string]: any
}

export function SettingsModule() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Settings>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/settings", {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error("Failed to fetch settings")
      const data = await res.json()
      setSettings(data)
      setFormData(data)
    } catch (error) {
      console.error("[v0] Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to save settings")
      alert("Settings saved successfully!")
      fetchSettings()
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      alert("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value })
  }

  if (loading) return <div className="text-center py-10">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Store Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Store Name</label>
              <Input
                value={formData.store_name || ""}
                onChange={(e) => handleChange("store_name", e.target.value)}
                placeholder="Sonya Stores"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Store Email</label>
              <Input
                type="email"
                value={formData.store_email || ""}
                onChange={(e) => handleChange("store_email", e.target.value)}
                placeholder="info@sonyastores.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Store Phone</label>
              <Input
                value={formData.store_phone || ""}
                onChange={(e) => handleChange("store_phone", e.target.value)}
                placeholder="0723 274 619"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Store Address</label>
              <Textarea
                value={formData.store_address || ""}
                onChange={(e) => handleChange("store_address", e.target.value)}
                placeholder="Nature HSE opposite Agro HSE stall, Nairobi, Kenya"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tax Rate (%)</label>
              <Input
                type="number"
                value={formData.tax_rate || 0}
                onChange={(e) => handleChange("tax_rate", parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Shipping Cost (KSh)</label>
              <Input
                type="number"
                value={formData.shipping_cost || 0}
                onChange={(e) => handleChange("shipping_cost", parseFloat(e.target.value))}
                placeholder="500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Currency</label>
              <Input
                value={formData.currency || "KSh"}
                onChange={(e) => handleChange("currency", e.target.value)}
                placeholder="KSh"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Items Sold Counter (for UI)</label>
              <Input
                type="number"
                value={formData.items_sold || 0}
                onChange={(e) => handleChange("items_sold", parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">WhatsApp Number</label>
              <Input
                value={formData.whatsapp_number || ""}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                placeholder="254723274619"
              />
            </div>
            <div>
              <label className="text-sm font-medium">TikTok URL</label>
              <Input
                value={formData.tiktok_url || ""}
                onChange={(e) => handleChange("tiktok_url", e.target.value)}
                placeholder="https://tiktok.com/@sonyastores"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Instagram URL</label>
              <Input
                value={formData.instagram_url || ""}
                onChange={(e) => handleChange("instagram_url", e.target.value)}
                placeholder="https://instagram.com/sonyastores"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO & Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Meta Title</label>
              <Input
                value={formData.meta_title || ""}
                onChange={(e) => handleChange("meta_title", e.target.value)}
                placeholder="Sonya Stores - Premium Shoes & Home Decor"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Meta Description</label>
              <Textarea
                value={formData.meta_description || ""}
                onChange={(e) => handleChange("meta_description", e.target.value)}
                placeholder="Shop quality shoes and home accessories at Sonya Stores"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button 
        className="w-full md:w-auto" 
        size="lg"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  )
}
