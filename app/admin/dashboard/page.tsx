'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, LogOut, Package, ShoppingCart, Users, BarChart3, Mail, Truck, FileText, Zap, Image } from 'lucide-react'
import { ProductsModule } from '@/components/admin/modules/products-module'
import { CategoriesModule } from '@/components/admin/modules/categories-module'
import { OrdersModule } from '@/components/admin/modules/orders-module'
import { BannersModule } from '@/components/admin/modules/banners-module'
import { SettingsModule } from '@/components/admin/modules/settings-module'
import { AnalyticsModule } from '@/components/admin/modules/analytics-module'
import { NewsletterModule } from '@/components/admin/modules/newsletter-module'
import { DeliveryModule } from '@/components/admin/modules/delivery-module'
import { PoliciesModule } from '@/components/admin/modules/policies-module'
import { OffersModule } from '@/components/admin/modules/offers-module'

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/me', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) {
          router.push('/admin/login')
          return
        }
        setAdmin(await res.json())
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } finally {
      router.push('/admin/login')
    }
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
          <TabsList className="grid w-full max-w-4xl grid-cols-10 gap-1">
            <TabsTrigger value="overview" title="Overview" className="text-xs">
              <BarChart3 className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="products" title="Products" className="text-xs">
              <Package className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="categories" title="Categories" className="text-xs">
              <Package className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="banners" title="Banners" className="text-xs">
              <Image className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="orders" title="Orders" className="text-xs">
              <ShoppingCart className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="offers" title="Offers" className="text-xs">
              <Zap className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="newsletter" title="Newsletter" className="text-xs">
              <Mail className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="delivery" title="Delivery" className="text-xs">
              <Truck className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="policies" title="Policies" className="text-xs">
              <FileText className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="settings" title="Settings" className="text-xs">
              <Settings className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="overview" className="space-y-6">
              <AnalyticsModule />
            </TabsContent>

            <TabsContent value="products">
              <ProductsModule />
            </TabsContent>

            <TabsContent value="categories">
              <CategoriesModule />
            </TabsContent>

            <TabsContent value="banners">
              <BannersModule />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersModule />
            </TabsContent>

            <TabsContent value="offers">
              <OffersModule />
            </TabsContent>

            <TabsContent value="newsletter">
              <NewsletterModule />
            </TabsContent>

            <TabsContent value="delivery">
              <DeliveryModule />
            </TabsContent>

            <TabsContent value="policies">
              <PoliciesModule />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsModule />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
