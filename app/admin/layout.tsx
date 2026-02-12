import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Sonya Stores",
  description: "Admin dashboard for managing products, orders, categories, offers, delivery, newsletter, and store settings.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
