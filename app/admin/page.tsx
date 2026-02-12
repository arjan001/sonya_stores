import { AdminShell } from "@/components/admin/admin-shell"
import { AnalyticsModule } from "@/components/admin/modules/analytics-module"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function AdminDashboard() {
  // Check if user is authenticated server-side
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value

  if (!token) {
    redirect("/admin/login")
  }

  return (
    <AdminShell title="Dashboard">
      <AnalyticsModule />
    </AdminShell>
  )
}
