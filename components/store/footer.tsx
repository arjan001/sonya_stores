import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand + Social */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="font-serif text-2xl font-bold tracking-tight">
                Sonya Stores
              </span>
            </Link>
            <p className="text-background/60 text-sm mt-4 leading-relaxed max-w-xs">
              Home for your most trusted Shoes Quality and Home Decor at unbeatable prices. Nature HSE opposite Agro HSE stall.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.tiktok.com/@sonyas.store"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-foreground border border-background/20 rounded-lg hover:bg-background/10 transition-colors"
                aria-label="Follow us on TikTok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.77 1.52V6.94a4.85 4.85 0 01-1.01-.25z" />
                </svg>
              </a>
              <a
                href="https://wa.me/254723274619"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#25D366] rounded-lg hover:opacity-80 transition-opacity"
                aria-label="Chat with us on WhatsApp"
              >
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3">
              <Link href="/shop" className="text-background/60 text-sm hover:text-background transition-colors">
                Shop All Products
              </Link>
              <Link href="/shop?filter=new" className="text-background/60 text-sm hover:text-background transition-colors">
                New Arrivals
              </Link>
              <Link href="/shop?filter=offers" className="text-background/60 text-sm hover:text-background transition-colors">
                On Offer
              </Link>
              <Link href="/track-order" className="text-background/60 text-sm hover:text-background transition-colors">
                Track My Order
              </Link>
              <Link href="/shop?category=womens-shoes" className="text-background/60 text-sm hover:text-background transition-colors">
                Women's Shoes
              </Link>
              <Link href="/shop?category=mens-shoes" className="text-background/60 text-sm hover:text-background transition-colors">
                Men's Shoes
              </Link>
              <Link href="/shop?category=handbags" className="text-background/60 text-sm hover:text-background transition-colors">
                Handbags
              </Link>
              <Link href="/shop?category=home-accessories" className="text-background/60 text-sm hover:text-background transition-colors">
                Home Accessories
              </Link>
            </nav>
          </div>

          {/* Visit Our Store */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5">
              Visit Our Store
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Navigation className="h-4 w-4 mt-0.5 text-background/40 flex-shrink-0" />
                <div>
                  <p className="text-background/80 text-sm font-medium">Find Us</p>
                  <p className="text-background/60 text-sm leading-relaxed">
                    Nature HSE opposite Agro HSE stall
                    <br />
                    Nairobi, Kenya
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-background/40 flex-shrink-0" />
                <a href="tel:+254723274619" className="text-background/60 text-sm hover:text-background transition-colors">
                  0723 274 619
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-background/40 flex-shrink-0" />
                <p className="text-background/60 text-sm leading-relaxed">
                  Mon - Sat: 9AM - 6PM
                </p>
              </div>
            </div>
          </div>

          {/* Follow Us + Map */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5">
              Connect With Us
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.tiktok.com/@sonyas.store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-background/60 text-sm hover:text-background transition-colors group"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-background/10 rounded-md group-hover:bg-background/20 transition-colors flex-shrink-0">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.77 1.52V6.94a4.85 4.85 0 01-1.01-.25z" /></svg>
                </span>
                @sonyas.store
              </a>
              <a
                href="https://wa.me/254723274619"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-background/60 text-sm hover:text-background transition-colors group"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-background/10 rounded-md group-hover:bg-background/20 transition-colors flex-shrink-0">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </span>
                WhatsApp Order
              </a>
            </div>

            {/* Google Maps embed placeholder */}
            <div className="mt-5 rounded-lg overflow-hidden border border-background/10">
              <a
                href="https://maps.google.com/?q=Nature+HSE+Nairobi"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-background/5 hover:bg-background/10 transition-colors p-4"
              >
                <div className="flex items-center gap-2 text-background/70 text-xs">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Get Directions to Nature HSE</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-background/40 text-xs">
              {"© 2026 Sonya Stores. All rights reserved."}
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="text-background/40 text-xs hover:text-background transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-background/40 text-xs hover:text-background transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund-policy" className="text-background/40 text-xs hover:text-background transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-background/30 text-[11px]">
              {"Designed & developed by "}
              <a
                href="https://oneplusafrica.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/50 hover:text-background transition-colors underline underline-offset-2"
              >
                OnePlusAfrica Tech Solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
