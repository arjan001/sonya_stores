"use client"

import { useState, useMemo, useEffect } from "react"
import { SlidersHorizontal, Grid3X3, LayoutList, X, Search } from "lucide-react"
import { usePagination } from "@/hooks/use-pagination"
import { PaginationControls } from "@/components/pagination-controls"
import { TopBar } from "./top-bar"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { ProductCard } from "./product-card"
import type { Product, Category } from "@/lib/types"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatPrice(price: number): string {
  return `KSh ${price.toLocaleString()}`
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
]

function FilterSidebar({
  priceRange, setPriceRange, showNew, setShowNew, showOffers, setShowOffers, maxPrice,
}: {
  priceRange: number[]; setPriceRange: (range: number[]) => void; showNew: boolean; setShowNew: (show: boolean) => void; showOffers: boolean; setShowOffers: (show: boolean) => void; maxPrice: number
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Price Range</h3>
        <Slider min={0} max={maxPrice} step={100} value={priceRange} onValueChange={setPriceRange} className="mb-3" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span><span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Filter By</h3>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer"><Checkbox checked={showNew} onCheckedChange={(checked) => setShowNew(checked === true)} /><span className="text-sm">New Arrivals</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><Checkbox checked={showOffers} onCheckedChange={(checked) => setShowOffers(checked === true)} /><span className="text-sm">On Offer</span></label>
        </div>
      </div>
    </div>
  )
}

export function CollectionPage({ collection }: { collection: string }) {
  const { data: allProducts = [] } = useSWR<Product[]>("/api/products", fetcher)
  const { data: categories = [] } = useSWR<Category[]>("/api/categories", fetcher)

  const categoryInfo = categories.find((c) => c.slug === collection)
  const categoryLabel = categoryInfo?.name || collection.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  // Filter products by this category slug
  const collectionProducts = useMemo(
    () => allProducts.filter((p) => p.categorySlug === collection),
    [allProducts, collection]
  )

  const [sortBy, setSortBy] = useState("newest")
  const [showNew, setShowNew] = useState(false)
  const [showOffers, setShowOffers] = useState(false)
  const maxProductPrice = collectionProducts.length > 0 ? Math.max(...collectionProducts.map((p) => p.price)) : 10000
  const maxPrice = Math.ceil(maxProductPrice / 100) * 100
  const [priceRange, setPriceRange] = useState([0, maxPrice])
  const [priceInitialized, setPriceInitialized] = useState(false)
  const [gridView, setGridView] = useState<"grid" | "list">("grid")
  const [localSearch, setLocalSearch] = useState("")

  useEffect(() => {
    if (collectionProducts.length > 0 && !priceInitialized) {
      setPriceRange([0, maxPrice])
      setPriceInitialized(true)
    }
  }, [collectionProducts.length, maxPrice, priceInitialized])

  const filtered = useMemo(() => {
    let result = [...collectionProducts]
    if (localSearch) {
      const q = localSearch.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
    }
    if (showNew) result = result.filter((p) => p.isNew)
    if (showOffers) result = result.filter((p) => p.isOnOffer)
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break
      case "price-high": result.sort((a, b) => b.price - a.price); break
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return result
  }, [collectionProducts, showNew, showOffers, priceRange, sortBy, localSearch, maxPrice])

  const { paginatedItems, currentPage, totalPages, totalItems, itemsPerPage, goToPage, changePerPage, resetPage } = usePagination(filtered, { defaultPerPage: 12 })

  useEffect(() => { resetPage() }, [showNew, showOffers, sortBy, localSearch])

  const activeFilters = [
    showNew && "New Arrivals",
    showOffers && "On Offer",
    (priceRange[0] > 0 || priceRange[1] < maxPrice) && `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`,
  ].filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Category header */}
          <div className="relative w-full h-[140px] md:h-[180px] overflow-hidden rounded-sm bg-secondary flex items-center px-8 md:px-12">
            <div>
              <p className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase mb-1.5">Shop</p>
              <h1 className="text-foreground text-2xl md:text-3xl font-serif font-bold text-balance">{categoryLabel}</h1>
              <p className="text-muted-foreground text-sm mt-1">{filtered.length} product{filtered.length !== 1 ? "s" : ""} available</p>
            </div>
          </div>

          <div className="flex items-end justify-between mt-8 mb-6">
            <div>
              <h2 className="text-xl font-serif font-bold">{categoryLabel}</h2>
            </div>
            <div className="hidden md:flex items-center border border-border rounded-sm max-w-xs">
              <input type="text" placeholder="Filter products..." value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} className="flex-1 h-9 px-3 bg-background text-sm outline-none" />
              {localSearch && <button type="button" onClick={() => setLocalSearch("")} className="px-2"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>}
              <div className="px-2 border-l border-border"><Search className="h-3.5 w-3.5 text-muted-foreground" /></div>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {activeFilters.map((filter) => (
                <span key={String(filter)} className="flex items-center gap-1.5 bg-secondary text-foreground text-xs px-3 py-1.5 rounded-sm">
                  {String(filter)}
                  <button type="button" onClick={() => {
                    if (filter === "New Arrivals") setShowNew(false)
                    if (filter === "On Offer") setShowOffers(false)
                    if (String(filter).includes("KSh")) setPriceRange([0, maxPrice])
                  }}><X className="h-3 w-3" /></button>
                </span>
              ))}
              <button type="button" onClick={() => { setShowNew(false); setShowOffers(false); setPriceRange([0, maxPrice]); setLocalSearch("") }} className="text-xs text-muted-foreground hover:text-foreground underline">Clear All</button>
            </div>
          )}

          <div className="flex gap-8">
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <FilterSidebar priceRange={priceRange} setPriceRange={setPriceRange} showNew={showNew} setShowNew={setShowNew} showOffers={showOffers} setShowOffers={setShowOffers} maxPrice={maxPrice} />
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild><Button variant="outline" size="sm" className="lg:hidden bg-transparent"><SlidersHorizontal className="h-4 w-4 mr-2" />Filters</Button></SheetTrigger>
                    <SheetContent side="left" className="w-80 bg-background text-foreground p-6">
                      <h2 className="text-lg font-serif font-semibold mb-6">Filters</h2>
                      <FilterSidebar priceRange={priceRange} setPriceRange={setPriceRange} showNew={showNew} setShowNew={setShowNew} showOffers={showOffers} setShowOffers={setShowOffers} maxPrice={maxPrice} />
                    </SheetContent>
                  </Sheet>
                  <div className="hidden sm:flex items-center border border-border rounded-sm">
                    <button type="button" onClick={() => setGridView("grid")} className={`p-2 ${gridView === "grid" ? "bg-foreground text-background" : ""}`}><Grid3X3 className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setGridView("list")} className={`p-2 ${gridView === "list" ? "bg-foreground text-background" : ""}`}><LayoutList className="h-4 w-4" /></button>
                  </div>
                </div>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm bg-background border border-border px-3 py-2 rounded-sm outline-none">
                  {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No products found in this category yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Check back soon for new arrivals!</p>
                </div>
              ) : (
                <>
                  <div className={gridView === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6" : "grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"}>
                    {paginatedItems.map((product) => <ProductCard key={product.id} product={product} />)}
                  </div>
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(p) => { goToPage(p); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                    onItemsPerPageChange={changePerPage}
                    perPageOptions={[12, 24, 48, 96]}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
