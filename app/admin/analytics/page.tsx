import { AdminShell } from "@/components/admin/admin-shell"
import { AnalyticsModule } from "@/components/admin/modules/analytics-module"

export default function AnalyticsPage() {
  return (
    <AdminShell title="Analytics">
      <AnalyticsModule />
    </AdminShell>
  )
}
