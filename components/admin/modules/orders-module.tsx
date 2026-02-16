"use client"

import { useState, useEffect } from "react"
import { Eye, Search, CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  discount_amount: number | null
  tax_amount: number | null
  shipping_amount: number | null
  status: string
  payment_status: string
  shipping_address: string | null
  notes: string | null
  created_at: string
  items?: OrderItem[]
}

export function OrdersModule() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const pageSize = 20

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, page, searchTerm])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String(page * pageSize),
        ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      })
      const res = await fetch(`/api/admin/orders?${params}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error("Failed to fetch orders")
      const json = await res.json()
      setOrders(json.orders || [])
      setTotal(json.total || 0)
    } catch (error) {
      console.error("[v0] Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(true)
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update order")
      
      // Update selected order
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
      
      fetchOrders()
    } catch (error) {
      console.error("[v0] Error updating order:", error)
      alert("Error updating order status")
    } finally {
      setUpdating(false)
    }
  }

  const handleViewDetails = async (order: Order) => {
    try {
      const res = await fetch(`/api/admin/orders?id=${order.id}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const fullOrder = await res.json()
        setSelectedOrder(fullOrder)
      } else {
        setSelectedOrder(order)
      }
      setIsDialogOpen(true)
    } catch (error) {
      console.error("[v0] Error fetching order details:", error)
      setSelectedOrder(order)
      setIsDialogOpen(true)
    }
  }

  const totalPages = Math.ceil(total / pageSize)
  const noResults = !loading && orders.length === 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'processing':
        return 'bg-blue-100 text-blue-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3" />
      case 'pending':
        return <Clock className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Orders ({total})
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search order number..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0) }}
            className="flex-1"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0) }}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">Loading orders...</div>
        </div>
      ) : noResults ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p>No orders found</p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Order #</th>
                  <th className="px-6 py-3 text-right font-medium">Amount</th>
                  <th className="px-6 py-3 text-center font-medium">Payment</th>
                  <th className="px-6 py-3 text-center font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                  <th className="px-6 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-muted/50">
                    <td className="px-6 py-3 font-medium">{order.order_number}</td>
                    <td className="px-6 py-3 text-right">KSh {Number(order.total_amount || 0).toFixed(2)}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        order.payment_status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.payment_status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium flex items-center gap-1 justify-center ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Button size="sm" variant="ghost" onClick={() => handleViewDetails(order)}>
                        <Eye className="h-4 w-4" />
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className={`inline-block px-2 py-1 rounded text-sm font-medium mt-1 ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <p className={`inline-block px-2 py-1 rounded text-sm font-medium mt-1 ${
                    selectedOrder.payment_status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedOrder.payment_status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Total</p>
                  <p className="text-2xl font-bold">KSh {Number(selectedOrder.total_amount || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="text-lg">{selectedOrder.created_at ? `${new Date(selectedOrder.created_at).toLocaleDateString()} ${new Date(selectedOrder.created_at).toLocaleTimeString()}` : '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedOrder.discount_amount && (
                  <div>
                    <p className="text-sm text-muted-foreground">Discount</p>
                    <p className="font-medium">-KSh {Number(selectedOrder.discount_amount || 0).toFixed(2)}</p>
                  </div>
                )}
                {selectedOrder.tax_amount && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tax</p>
                    <p className="font-medium">+KSh {Number(selectedOrder.tax_amount || 0).toFixed(2)}</p>
                  </div>
                )}
                {selectedOrder.shipping_amount && (
                  <div>
                    <p className="text-sm text-muted-foreground">Shipping</p>
                    <p className="font-medium">+KSh {Number(selectedOrder.shipping_amount || 0).toFixed(2)}</p>
                  </div>
                )}
              </div>

              {selectedOrder.shipping_address && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                  <p className="text-sm bg-muted p-2 rounded">{selectedOrder.shipping_address}</p>
                </div>
              )}

              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm bg-muted p-2 rounded">{selectedOrder.notes}</p>
                </div>
              )}

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Order Items</p>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left">Qty</th>
                          <th className="px-4 py-2 text-left">Unit Price</th>
                          <th className="px-4 py-2 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="px-4 py-2">{item.quantity}</td>
                            <td className="px-4 py-2">KSh {Number(item.unit_price || 0).toFixed(2)}</td>
                            <td className="px-4 py-2 text-right">KSh {Number(item.subtotal || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {["pending", "processing", "completed", "cancelled"].map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? "default" : "outline"}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                      disabled={updating}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
