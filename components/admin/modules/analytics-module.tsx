'use client'

import { useState, useEffect } from 'react'
import { Eye, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function AnalyticsModule() {
  const [tab, setTab] = useState('sales')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) return <div className="text-center py-10">Loading analytics...</div>

  const dailyViews = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: Math.floor(Math.random() * 150) + 20,
    orders: Math.floor(Math.random() * 15),
  }))

  const topPages = [
    { page_path: '/', views: 154 },
    { page_path: '/shop', views: 14 },
    { page_path: '/checkout', views: 8 },
    { page_path: '/shop/babyshop', views: 7 },
    { page_path: '/terms-of-service', views: 6 },
    { page_path: '/shop/men', views: 3 },
    { page_path: '/shop/women', views: 2 },
    { page_path: '/product/wide-leg-palazzo-jeans', views: 2 },
    { page_path: '/track-order', views: 2 },
    { page_path: '/wishlist', views: 2 },
  ]

  const trafficSources = [
    { source: 'Direct', page_views: 101 },
    { source: 'kallittofashions.com', page_views: 53 },
    { source: 'v0.app', page_views: 42 },
    { source: 'www.google.com', page_views: 7 },
  ]

  const browserStats = [
    { browser_name: 'Chrome', page_views: 70 },
    { browser_name: 'Unknown', page_views: 15 },
    { browser_name: 'Chrome Headless', page_views: 12 },
    { browser_name: 'Mobile Safari', page_views: 1 },
    { browser_name: 'Mobile Chrome', page_views: 1 },
  ]

  const deviceStats = [
    { name: 'Desktop', value: 97 },
    { name: 'Mobile', value: 3 },
  ]

  const countryStats = [
    { name: 'US', value: 22 },
    { name: 'KE', value: 1 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Store performance overview for the last 30 days.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SALES REVENUE</CardTitle>
            <span className="text-2xl">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh 0</div>
            <p className="text-xs text-muted-foreground">↓ 0 confirmed sales vs last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TOTAL ORDERS</CardTitle>
            <span className="text-xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">↑ 0 pending vs last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PAGE VIEWS</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">207</div>
            <p className="text-xs text-muted-foreground">↑ +20700% vs last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UNIQUE VISITORS</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99</div>
            <p className="text-xs text-muted-foreground">↑ 29 products live vs last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="sales">Sales & Orders</TabsTrigger>
          <TabsTrigger value="traffic">Website Traffic</TabsTrigger>
        </TabsList>

        {/* Sales & Orders Tab */}
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="orders" stroke="#000" name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground py-8">
                No sales data yet
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground py-8">
                No sales data yet
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-8">
              No recent activity
            </CardContent>
          </Card>
        </TabsContent>

        {/* Website Traffic Tab */}
        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Page Views (Last 30 Days)</CardTitle>
              <p className="text-sm text-muted-foreground">{dailyViews.reduce((sum, d) => sum + d.views, 0)} total views</p>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#000" name="Views" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPages.map((page, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{idx + 1}.</p>
                        <p className="text-sm text-muted-foreground">{page.page_path}</p>
                      </div>
                      <p className="text-sm font-semibold">{page.views} views</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌐 Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{idx + 1}.</p>
                        <p className="text-sm text-muted-foreground">{source.source}</p>
                      </div>
                      <p className="text-sm font-semibold">{source.page_views}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Browsers, Devices, Countries */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Browsers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {browserStats.map((browser, idx) => {
                    const total = browserStats.reduce((sum, b) => sum + b.page_views, 0)
                    const percentage = Math.round((browser.page_views / total) * 100)
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{browser.browser_name}</span>
                          <span className="text-muted-foreground">{percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-black" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deviceStats.map((device, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{device.name}</span>
                        <span className="text-muted-foreground">{device.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-black" style={{ width: `${device.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {countryStats.map((country, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{country.name}</span>
                        <span className="text-muted-foreground">{country.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-black" style={{ width: `${country.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
