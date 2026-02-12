"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Heart, ShoppingBag, Eye } from "lucide-react"

const OFFER_PRODUCTS = [
  { id: "3", name: "White Minimalist Sneakers", price: 2800, originalPrice: 3500, category: "Sneakers", image: "/products/sneakers-white.jpg", offerPercentage: 20 },
  { id: "6", name: "Ceramic Decorative Vase", price: 2200, originalPrice: 2800, category: "Home Decor", image: "/products/vase-decor.jpg", offerPercentage: 21 },
  { id: "5", name: "Gold Flat Sandals", price: 1800, originalPrice: 2400, category: "Sandals", image: "/products/sandals-gold.jpg", offerPercentage: 25 },
  { id: "2", name: "Classic Brown Oxford", price: 4200, originalPrice: 5000, category: "Men's Shoes", image: "/products/mens-leather-brown.jpg", offerPercentage: 16 },
]

function formatPrice(price: number) {
  return `KSh ${price.toLocaleString()}`
}

export function OnOfferProducts() {
  return (
    <section className="py-14 lg:py-20 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Hot Deals
            </p>
            <h2 className="text-2xl lg:text-3xl font-serif font-bold">
              Products On Offer
            </h2>
          </div>
          <Link href="/shop?filter=offers" className="hidden sm:flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {OFFER_PRODUCTS.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="bg-foreground text-background text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1">-{product.offerPercentage}%</span>
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
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
