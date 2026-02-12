import { AdminShell } from "@/components/admin/admin-shell"
import { SettingsModule } from "@/components/admin/modules/settings-module"

export default function SettingsPage() {
  return (
    <AdminShell title="Settings">
      <SettingsModule />
    </AdminShell>
  )
}
