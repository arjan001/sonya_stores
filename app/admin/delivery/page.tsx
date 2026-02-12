import { AdminShell } from "@/components/admin/admin-shell"
import { DeliveryModule } from "@/components/admin/modules/delivery-module"

export default function DeliveryPage() {
  return (
    <AdminShell title="Delivery Settings">
      <DeliveryModule />
    </AdminShell>
  )
}
