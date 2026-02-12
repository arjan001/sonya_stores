"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { ArrowRight } from "lucide-react"

const HERO_BANNERS = [
  {
    id: "shoes",
    title: "Quality Shoes for Every Occasion",
    subtitle: "Discover our trusted collection of elegant heels, comfortable sneakers, and stylish sandals at unbeatable prices.",
    image: "/banners/shoes-collection.jpg",
    linkUrl: "/shop?category=womens-shoes",
    buttonText: "Shop Shoes",
  },
  {
    id: "handbags",
    title: "Stylish Handbags & Totes",
    subtitle: "Premium handbags and crossbody bags to complement your style.",
    image: "/banners/handbags-collection.jpg",
    linkUrl: "/shop?category=handbags",
    buttonText: "Shop Handbags",
  },
  {
    id: "home-decor",
    title: "Elegant Home Decor",
    subtitle: "Transform your space with curated home accessories and decor.",
    image: "/banners/home-decor-collection.jpg",
    linkUrl: "/shop?category=home-decor",
    buttonText: "Shop Home Decor",
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  const mainBanner = HERO_BANNERS[currentSlide]
  const sideBanners = HERO_BANNERS.filter((_, i) => i !== currentSlide).slice(0, 2)

  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          {/* Main Banner */}
          <Link
            href={mainBanner.linkUrl}
            className="lg:col-span-8 relative overflow-hidden rounded-sm min-h-[400px] lg:min-h-[520px] flex items-end group"
          >
            <div className="absolute inset-0 z-0">
              {HERO_BANNERS.map((banner, i) => (
                <div
                  key={banner.id}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: i === currentSlide ? 1 : 0 }}
                >
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority={i === 0}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
            </div>
            <div className="relative z-10 p-8 lg:p-12 w-full">
              <p className="text-background/80 text-xs tracking-[0.3em] uppercase mb-2">Quality Footwear</p>
              <h1 className="text-background text-4xl lg:text-5xl font-serif font-bold leading-tight text-balance">
                {mainBanner.title}
              </h1>
              <p className="text-background/70 text-sm mt-3 leading-relaxed max-w-md">
                {mainBanner.subtitle}
              </p>
              <span className="inline-flex items-center gap-2 mt-5 bg-background text-foreground px-7 py-3 text-sm font-medium group-hover:bg-background/90 transition-colors">
                {mainBanner.buttonText}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>

              {/* Dots */}
              <div className="flex gap-2 mt-6">
                {HERO_BANNERS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => { e.preventDefault(); setCurrentSlide(i) }}
                    className={`w-2 h-2 rounded-full transition-colors ${i === currentSlide ? "bg-background" : "bg-background/40"}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </Link>

          {/* Side Banners */}
          <div className="lg:col-span-4 flex flex-col gap-4 lg:gap-6">
            {sideBanners.map((banner) => (
              <Link
                key={banner.id}
                href={banner.linkUrl}
                className="relative overflow-hidden rounded-sm flex-1 min-h-[200px] lg:min-h-0 group flex items-end"
              >
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
                <div className="relative z-10 p-5 w-full">
                  <h3 className="text-background font-serif text-lg font-semibold leading-snug">
                    {banner.title}
                  </h3>
                  <p className="text-background/70 text-xs mt-1 line-clamp-2">
                    {banner.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-3 text-background text-xs font-medium tracking-wide uppercase group-hover:underline">
                    {banner.buttonText}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
