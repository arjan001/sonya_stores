import { AdminShell } from "@/components/admin/admin-shell"
import { CategoriesModule } from "@/components/admin/modules/categories-module"

export default function CategoriesPage() {
  return (
    <AdminShell title="Categories">
      <CategoriesModule />
    </AdminShell>
  )
}
