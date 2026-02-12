"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { TopBar } from "@/components/store/top-bar"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"
import { ProductCard } from "@/components/store/product-card"
import { ChevronRight, Search as SearchIcon } from "lucide-react"
import type { Product } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      if (query.length >= 2) setHasSearched(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const { data, error, isLoading } = useSWR<{ products: Product[]; total: number; count: number }>(
    debouncedQuery.length >= 2 ? `/api/search?q=${encodeURIComponent(debouncedQuery)}${categoryFilter ? `&categoryId=${categoryFilter}` : ""}` : null,
    fetcher
  )

  const products = data?.products || []
  const total = data?.total || 0

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <Navbar />

      <main className="flex-1 bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Search Results</span>
          </div>

          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Search Products</h1>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, description, or tags..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
                />
              </div>
            </div>
          </div>

          {/* Results Info */}
          {hasSearched && (
            <div className="mb-6 text-sm text-muted-foreground">
              {isLoading ? (
                <span>Searching...</span>
              ) : products.length === 0 ? (
                <span>No products found for "{debouncedQuery}"</span>
              ) : (
                <span>Found {total} product{total !== 1 ? "s" : ""}</span>
              )}
            </div>
          )}

          {/* No Search Message */}
          {!hasSearched && (
            <div className="text-center py-12">
              <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Enter at least 2 characters to search</p>
            </div>
          )}

          {/* Results Grid */}
          {hasSearched && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* No Results */}
          {hasSearched && products.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products match your search</p>
              <Link href="/shop" className="text-foreground hover:underline font-medium">
                Browse all products →
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
