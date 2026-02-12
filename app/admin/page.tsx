import { AdminShell } from "@/components/admin/admin-shell"
import { AnalyticsModule } from "@/components/admin/modules/analytics-module"

export default function AdminDashboard() {
  return (
    <AdminShell title="Dashboard">
      <AnalyticsModule />
    </AdminShell>
  )
}
