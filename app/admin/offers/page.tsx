import { AdminShell } from "@/components/admin/admin-shell"
import { OffersModule } from "@/components/admin/modules/offers-module"

export default function OffersPage() {
  return (
    <AdminShell title="Offers & Banners">
      <OffersModule />
    </AdminShell>
  )
}
