"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function NewArrivals() {
  const { data: products = [] } = useSWR<Product[]>("/api/products", fetcher)

  // Filter products marked as new
  const newProducts = products.filter((p) => p.isNew).slice(0, 4)

  // Fallback to most recent products if none marked as new
  const display = newProducts.length > 0 ? newProducts : products.slice(0, 4)

  if (display.length === 0) return null

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Just In
            </p>
            <h2 className="text-2xl lg:text-3xl font-serif font-bold">
              New Arrivals
            </h2>
          </div>
          <Link href="/shop?filter=new" className="hidden sm:flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {display.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
