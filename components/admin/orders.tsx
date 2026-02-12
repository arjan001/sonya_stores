"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Eye, Truck, CheckCircle, Clock, Package, XCircle, Search, Trash2, Loader2, MessageSquare, Phone } from "lucide-react"
import { usePagination } from "@/hooks/use-pagination"
import { PaginationControls } from "@/components/pagination-controls"
import { AdminShell } from "./admin-shell"
import { formatPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type OrderStatus = "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled"

interface Order {
  id: string
  orderNo: string
  customer: string
  phone: string
  email: string
  items: { name: string; qty: number; price: number; variation?: string; image?: string }[]
  subtotal: number
  delivery: number
  total: number
  location: string
  address: string
  notes: string
  status: OrderStatus
  orderedVia: string
  paymentMethod: string
  mpesaCode: string
  mpesaPhone: string
  mpesaMessage: string
  date: string
}

const statusConfig: Record<OrderStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-secondary text-foreground" },
  confirmed: { label: "Confirmed", icon: CheckCircle, className: "bg-foreground text-background" },
  dispatched: { label: "Dispatched", icon: Truck, className: "bg-foreground text-background" },
  delivered: { label: "Delivered", icon: Package, className: "bg-secondary text-foreground" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-secondary text-muted-foreground" },
}

export function AdminOrders() {
  const { data: orders = [], mutate } = useSWR<Order[]>("/api/admin/orders", fetcher)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.orderNo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const { paginatedItems, currentPage, totalPages, totalItems, itemsPerPage, goToPage, changePerPage, resetPage } = usePagination(filtered, { defaultPerPage: 15 })

  useEffect(() => { resetPage() }, [search, statusFilter])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedItems.map((o) => o.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    const count = selectedIds.size
    if (!confirm(`Permanently delete ${count} order${count !== 1 ? "s" : ""}? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const ids = Array.from(selectedIds).join(",")
      const res = await fetch(`/api/admin/orders?ids=${ids}`, { method: "DELETE" })
      if (res.ok) {
        toast.success(`${count} order${count !== 1 ? "s" : ""} deleted`)
        setSelectedIds(new Set())
        mutate()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to delete orders")
      }
    } catch {
      toast.error("Failed to delete orders")
    } finally {
      setDeleting(false)
    }
  }

 const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
  const res = await fetch("/api/admin/orders", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: orderId, status: newStatus }),
  })
  if (res.ok) toast.success(`Order ${statusConfig[newStatus].label.toLowerCase()}`)
  else toast.error("Failed to update order status")
    mutate()
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const stats = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    dispatched: orders.filter((o) => o.status === "dispatched").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  return (
    <AdminShell title="Orders">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">{orders.length} total orders</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(Object.entries(stats) as [string, number][]).map(([key, count]) => (
            <div key={key} className="border border-border p-4 rounded-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{key}</span>
                {key === "pending" && <Clock className="h-4 w-4 text-muted-foreground" />}
                {key === "confirmed" && <CheckCircle className="h-4 w-4 text-muted-foreground" />}
                {key === "dispatched" && <Truck className="h-4 w-4 text-muted-foreground" />}
                {key === "delivered" && <Package className="h-4 w-4 text-muted-foreground" />}
              </div>
              <p className="text-2xl font-bold mt-1">{count}</p>
            </div>
          ))}
        </div>

        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-sm px-4 py-2.5">
            <span className="text-sm font-medium">{selectedIds.size} order{selectedIds.size !== 1 ? "s" : ""} selected</span>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} className="text-muted-foreground hover:text-foreground">
              Clear
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 mr-1.5" />}
              Delete Selected
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-10">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary">
                  <th className="w-10 px-4 py-3">
                    <Checkbox
                      checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all orders"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-medium">Order</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Customer</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Payment</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedItems.map((order) => {
                  const config = statusConfig[order.status]
                  return (
                    <tr key={order.id} className={`hover:bg-secondary/50 transition-colors ${selectedIds.has(order.id) ? "bg-secondary/30" : ""}`}>
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedIds.has(order.id)}
                          onCheckedChange={() => toggleSelect(order.id)}
                          aria-label={`Select order ${order.orderNo}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {order.items[0]?.image && (
                            <div className="relative w-9 h-11 flex-shrink-0 bg-secondary rounded-sm overflow-hidden hidden sm:block">
                              <Image src={order.items[0].image || "/placeholder.svg"} alt="" fill className="object-cover" />
                            </div>
                          )}
                          <div>
                            <span className="font-medium">{order.orderNo}</span>
                            <span className="sm:hidden text-xs text-muted-foreground block">{order.customer}</span>
                            <span className="hidden sm:block text-xs text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{order.customer}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{order.date}</td>
                      <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {order.paymentMethod === "mpesa" ? (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#00843D]/10 text-[#00843D]">M-PESA</span>
                        ) : order.orderedVia === "whatsapp" ? (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#25D366]/10 text-[#25D366]">WhatsApp</span>
                        ) : (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-secondary text-muted-foreground">COD</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm ${config.className}`}>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
          onItemsPerPageChange={changePerPage}
          perPageOptions={[10, 15, 25, 50]}
        />
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background text-foreground">
          <DialogHeader>
            <DialogTitle className="font-serif">Order {selectedOrder?.orderNo}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-5 mt-4">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-sm ${statusConfig[selectedOrder.status].className}`}>
                  {statusConfig[selectedOrder.status].label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{selectedOrder.date}</span>
                  {selectedOrder.orderedVia === "whatsapp" && (
                    <Badge variant="outline" className="text-[10px]">WhatsApp</Badge>
                  )}
                  {selectedOrder.paymentMethod === "mpesa" && (
                    <Badge variant="outline" className="text-[10px] border-[#00843D]/30 text-[#00843D]">M-PESA</Badge>
                  )}
                </div>
              </div>

              {/* Customer Info + WhatsApp Contact */}
              <div className="border border-border rounded-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-semibold">{selectedOrder.customer}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {selectedOrder.phone}
                    </p>
                    {selectedOrder.email && <p className="text-xs text-muted-foreground">{selectedOrder.email}</p>}
                    <p className="text-xs text-muted-foreground">{selectedOrder.location} -- {selectedOrder.address}</p>
                    {selectedOrder.notes && <p className="text-xs text-muted-foreground italic mt-2">Note: {selectedOrder.notes}</p>}
                  </div>
                  <a
                    href={`https://wa.me/${selectedOrder.phone.replace(/\D/g, "").replace(/^0/, "254")}?text=${encodeURIComponent(`Hi ${selectedOrder.customer.split(" ")[0]}, regarding your order ${selectedOrder.orderNo} at Kallittos Fashion.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-medium px-3 py-2 rounded-sm transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* M-PESA Payment Details */}
              {selectedOrder.paymentMethod === "mpesa" && (
                <div className="border border-[#00843D]/20 rounded-sm overflow-hidden">
                  <div className="bg-[#00843D]/5 px-4 py-2 flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-[#00843D]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#00843D]">M-PESA Payment</span>
                  </div>
                  <div className="p-4 space-y-2">
                    {selectedOrder.mpesaCode && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Transaction Code</span>
                        <span className="font-mono font-bold tracking-wider">{selectedOrder.mpesaCode}</span>
                      </div>
                    )}
                    {selectedOrder.mpesaPhone && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phone Used</span>
                        <span>{selectedOrder.mpesaPhone}</span>
                      </div>
                    )}
                    {selectedOrder.mpesaMessage && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">Transaction Message</p>
                        <div className="bg-secondary/70 rounded-sm p-3 text-xs leading-relaxed font-mono whitespace-pre-wrap break-words">
                          {selectedOrder.mpesaMessage}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border border-border rounded-sm overflow-hidden">
                <div className="bg-secondary px-4 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Items</span>
                </div>
                <div className="divide-y divide-border">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <div className="relative w-12 h-14 flex-shrink-0 bg-secondary rounded-sm overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        {item.variation && <p className="text-xs text-muted-foreground">{item.variation}</p>}
                        <p className="text-xs text-muted-foreground">Qty: {item.qty} x {formatPrice(item.price)}</p>
                      </div>
                      <span className="text-sm font-medium flex-shrink-0">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border px-4 py-3 space-y-1">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span>{selectedOrder.delivery === 0 ? "FREE" : formatPrice(selectedOrder.delivery)}</span></div>
                  <div className="flex justify-between text-sm font-semibold pt-1 border-t border-border"><span>Total</span><span>{formatPrice(selectedOrder.total)}</span></div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(["pending", "confirmed", "dispatched", "delivered", "cancelled"] as OrderStatus[]).map((s) => (
                    <Button
                      key={s}
                      variant={selectedOrder.status === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(selectedOrder.id, s)}
                      className={selectedOrder.status === s ? "bg-foreground text-background" : "bg-transparent"}
                    >
                      {statusConfig[s].label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
