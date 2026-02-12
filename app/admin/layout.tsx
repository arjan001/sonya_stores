import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Kallitos Fashion",
  description: "Admin dashboard for managing products, orders, categories and offers.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
