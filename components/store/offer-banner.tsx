"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function OfferBanner() {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Banner 1 */}
          <Link
            href="/shop?filter=offers"
            className="relative overflow-hidden rounded-sm min-h-[280px] flex items-center group"
          >
            <Image
              src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=400&fit=crop"
              alt="Shoes collection sale"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-foreground/50" />
            <div className="relative z-10 p-8 lg:p-10">
              <p className="text-background/70 text-xs tracking-[0.3em] uppercase mb-2">
                Limited Offer
              </p>
              <h3 className="text-background text-2xl lg:text-3xl font-serif font-bold text-balance">
                Footwear Season Sale
              </h3>
              <p className="text-background/70 text-sm mt-2 max-w-xs">
                Up to 30% off on selected shoes. Quality meets affordability.
              </p>
              <div className="inline-flex items-center gap-2 mt-4 text-background text-sm font-medium">
                Shop The Sale
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Banner 2 */}
          <Link
            href="/shop?filter=new"
            className="relative overflow-hidden rounded-sm min-h-[280px] flex items-center group"
          >
            <Image
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=400&fit=crop"
              alt="New handbags arrivals"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-foreground/50" />
            <div className="relative z-10 p-8 lg:p-10">
              <p className="text-background/70 text-xs tracking-[0.3em] uppercase mb-2">
                Just Dropped
              </p>
              <h3 className="text-background text-2xl lg:text-3xl font-serif font-bold text-balance">
                New Handbag Collection
              </h3>
              <p className="text-background/70 text-sm mt-2 max-w-xs">
                Fresh styles arriving weekly. Totes, crossbody bags, and more.
              </p>
              <div className="inline-flex items-center gap-2 mt-4 text-background text-sm font-medium">
                Explore New In
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
