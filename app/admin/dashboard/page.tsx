'use client'

import { AdminShell } from '@/components/admin/admin-shell'
import { DashboardOverview } from '@/components/admin/modules/dashboard-overview'

export default function AdminDashboard() {
  return (
    <AdminShell title="Dashboard">
      <DashboardOverview />
    </AdminShell>
  )
}
