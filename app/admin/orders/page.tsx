import { AdminShell } from "@/components/admin/admin-shell"
import { OrdersModule } from "@/components/admin/modules/orders-module"

export default function OrdersPage() {
  return (
    <AdminShell title="Orders">
      <OrdersModule />
    </AdminShell>
  )
}
