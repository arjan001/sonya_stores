import { AdminShell } from "@/components/admin/admin-shell"
import { ProductsModule } from "@/components/admin/modules/products-module"

export default function ProductsPage() {
  return (
    <AdminShell title="Products">
      <ProductsModule />
    </AdminShell>
  )
}
