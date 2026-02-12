import { AdminShell } from "@/components/admin/admin-shell"
import { BannersModule } from "@/components/admin/modules/banners-module"

export default function BannersPage() {
  return (
    <AdminShell title="Banners">
      <BannersModule />
    </AdminShell>
  )
}
