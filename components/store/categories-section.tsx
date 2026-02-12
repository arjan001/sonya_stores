"use client"

import Link from "next/link"
import Image from "next/image"

const STATIC_CATEGORIES = [
  { name: "Women's Shoes", slug: "womens-shoes", image: "/categories/womens-shoes.jpg" },
  { name: "Men's Shoes", slug: "mens-shoes", image: "/categories/mens-shoes.jpg" },
  { name: "Sneakers", slug: "sneakers", image: "/categories/sneakers.jpg" },
  { name: "Handbags", slug: "handbags", image: "/categories/handbags.jpg" },
  { name: "Home Accessories", slug: "home-accessories", image: "/categories/home-accessories.jpg" },
  { name: "Sandals", slug: "sandals", image: "/categories/sandals.jpg" },
]

export function CategoriesSection() {
  return (
    <section className="py-14 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Browse Our Collection
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-pretty">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            View All Products
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {STATIC_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary ring-1 ring-border group-hover:ring-primary transition-all">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-foreground/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-sm font-medium mt-3 text-center leading-tight group-hover:text-primary transition-colors">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
