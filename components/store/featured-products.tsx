"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function FeaturedProducts() {
  const { data: products = [] } = useSWR<Product[]>("/api/products", fetcher)

  // Show first 8 products as featured
  const featured = products.slice(0, 8)

  if (featured.length === 0) return null

  return (
    <section className="py-14 lg:py-20 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Curated For You
            </p>
            <h2 className="text-2xl lg:text-3xl font-serif font-bold">
              Featured Products
            </h2>
          </div>
          <Link href="/shop" className="hidden sm:flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
