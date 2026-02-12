'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, LogOut, Package, ShoppingCart, Users, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    // In a real app, verify token on backend
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold">Sonya Stores Admin</h1>
            <p className="text-sm text-muted-foreground">Dashboard & Management</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-5">
            <TabsTrigger value="overview" title="Overview">
              <BarChart3 className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="products" title="Products">
              <Package className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="orders" title="Orders">
              <ShoppingCart className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="customers" title="Customers">
              <Users className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="settings" title="Settings">
              <Settings className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KSh 0</div>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Products Management</CardTitle>
                <CardDescription>Coming soon - Manage products, categories, and inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Product management module is being developed...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
                <CardDescription>Coming soon - View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Orders management module is being developed...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customers Management</CardTitle>
                <CardDescription>Coming soon - Manage customer accounts and data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Customers management module is being developed...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SettingsModule />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function SettingsModule() {
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: string, value: string) => {
    setSettings({
      ...settings,
      [key]: value,
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert('Settings saved successfully')
      }
    } catch (error) {
      console.error('[v0] Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading settings...</div>

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure store information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Store Name</label>
            <input
              type="text"
              value={settings.store_name || 'Sonya Stores'}
              onChange={(e) => handleSettingChange('store_name', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Store Email</label>
            <input
              type="email"
              value={settings.store_email || 'info@sonyastores.com'}
              onChange={(e) => handleSettingChange('store_email', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Store Phone</label>
            <input
              type="tel"
              value={settings.store_phone || '0723274619'}
              onChange={(e) => handleSettingChange('store_phone', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Store Address</label>
            <textarea
              value={settings.store_address || 'Nature HSE opposite Agro HSE stall, Nairobi, Kenya'}
              onChange={(e) => handleSettingChange('store_address', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-sm h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Store Description</label>
            <textarea
              value={settings.store_description || ''}
              onChange={(e) => handleSettingChange('store_description', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-sm h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
              <input
                type="number"
                value={settings.tax_rate || 16}
                onChange={(e) => handleSettingChange('tax_rate', e.target.value)}
                step="0.1"
                className="w-full px-3 py-2 border border-border rounded-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shipping Cost (KSh)</label>
              <input
                type="number"
                value={settings.shipping_cost || 200}
                onChange={(e) => handleSettingChange('shipping_cost', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-sm"
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
