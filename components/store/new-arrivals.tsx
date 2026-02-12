"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Heart, ShoppingBag, Eye } from "lucide-react"

const NEW_PRODUCTS = [
  { id: "1", name: "Elegant Red Heels", price: 3500, category: "Women's Shoes", image: "/products/womens-heels-red.jpg" },
  { id: "4", name: "Tan Leather Tote Bag", price: 5500, category: "Handbags", image: "/products/handbag-tan.jpg" },
  { id: "7", name: "Black Sport Sneakers", price: 3200, category: "Sneakers", image: "/products/sneakers-black.jpg" },
  { id: "8", name: "Black Crossbody Bag", price: 4800, category: "Handbags", image: "/products/handbag-black.jpg" },
]

function formatPrice(price: number) {
  return `KSh ${price.toLocaleString()}`
}

export function NewArrivals() {
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
          {NEW_PRODUCTS.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary text-primary-foreground text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1">New</span>
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button type="button" className="w-9 h-9 flex items-center justify-center bg-background rounded-full shadow-sm hover:bg-secondary transition-colors" aria-label="Add to wishlist"><Heart className="h-4 w-4" /></button>
                  <button type="button" className="w-9 h-9 flex items-center justify-center bg-background rounded-full shadow-sm hover:bg-secondary transition-colors" aria-label="Quick view"><Eye className="h-4 w-4" /></button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button type="button" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 text-xs font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors">
                    <ShoppingBag className="h-3.5 w-3.5" />Add to Cart
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
                <h3 className="text-sm font-medium mt-1 group-hover:underline line-clamp-1">{product.name}</h3>
                <span className="text-sm font-semibold mt-1.5 block">{formatPrice(product.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
