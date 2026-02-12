import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { CartDrawer } from "@/components/store/cart-drawer"
import { Toaster } from "@/components/ui/sonner"
import { PageViewTracker } from "@/components/page-view-tracker"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const siteUrl = "https://sonyastores.com"

export const metadata: Metadata = {
  title: {
    default: "Sonya Stores | Quality Shoes & Luxury Home Decor in Nairobi",
    template: "%s | Sonya Stores",
  },
  description:
    "Shop the most trusted collection of premium footwear and elegant home decor at Sonya Stores. Unbeatable prices on quality shoes and home essentials. Visit us at Nature House, Stall 7, or call 0723274619.",
  keywords: [
    "Quality shoes Nairobi", "home decor Kenya", "Sonya Stores Nairobi", "affordable luxury shoes", "Nature House stall 7",
    "best shoe store Nairobi CBD", "elegant home interiors", "stylish sneakers Kenya", "office shoes for men",
    "ladies heels Nairobi", "designer home decor", "interior design pieces", "trusted shoe vendors",
    "Sonya Stores contact", "affordable home makeover", "trendy footwear 2026", "wall art Nairobi",
    "decorative vases Kenya", "comfortable walking shoes", "leather shoes Nairobi", "modern home furniture",
    "budget-friendly decor", "Sonya Stores Nature House", "Agro House opposite shops", "wholesale shoes Kenya",
    "retail home decor", "premium bedding Nairobi", "shoe shop stall 7", "home lighting fixtures",
    "sneakers for sale Kenya", "formal shoes Nairobi", "home styling tips", "Nairobi small business",
    "luxury lifestyle decor", "durable footwear", "fashionable boots Kenya", "throw pillows Nairobi",
    "kitchen decor Kenya", "bedroom essentials", "living room accessories", "Sonya Stores 0723274619",
    "quality sneakers Nairobi", "authentic shoes Kenya", "home fragrance and candles", "decorative mirrors",
    "minimalist home decor", "vintage shoe styles", "casual shoes for women", "men's official shoes",
    "home improvement Kenya", "Nairobi CBD shopping", "cheap shoes Nairobi", "high-quality decor",
    "unique gift items", "Sonya Stores reviews", "Nature House stall listings", "stylish home accents",
    "outdoor footwear", "indoor slippers", "rug and carpet Nairobi", "curtain designs Kenya",
    "shoe care products", "home organization tools", "trending decor 2026", "discounted shoes",
    "festive home decor", "Nairobi fashion hub", "home decor delivery Kenya", "Sonya Stores online"
  ],
  authors: [{ name: "oneplusafrica tech solutions", url: "https://oneplusafrica.com" }],
  creator: "oneplusafrica tech solutions",
  publisher: "Sonya Stores",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "Sonya Stores",
    title: "Sonya Stores | Trusted Shoes & Home Decor",
    description: "Premium footwear and home essentials at unbeatable prices. Based in Nairobi, Nature House.",
    images: [{
      url: `${siteUrl}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: "Sonya Stores - Quality Shoes & Home Decor"
    }]
  },
  twitter: {
    card: "summary_large_image",
    site: "@sonyas.store",
    creator: "@sonyas.store",
    title: "Sonya Stores - Quality Shoes & Decor",
    description: "Shop unbeatable prices on quality shoes and home decor in Nairobi CBD.",
    images: [`${siteUrl}/twitter-image.jpg`]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  other: {
    "tiktok:creator": "@sonyas.store",
    "article:author": "oneplusafrica tech solutions",
  },
}

export const viewport: Viewport = {
  themeColor: "#8B5E3C",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Sonya Stores",
              description: "Home for your most trusted Shoes Quality and Home Decor at unbeatable prices.",
              url: siteUrl,
              telephone: "+254723274619",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Nature HSE opposite Agro HSE stall",
                addressLocality: "Nairobi",
                addressCountry: "KE",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "09:00",
                closes: "18:00",
              },
              sameAs: ["https://www.tiktok.com/@sonyas.store"],
              priceRange: "KES 1,000 - KES 10,000",
              paymentAccepted: "M-PESA, Cash",
              currenciesAccepted: "KES",
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <WishlistProvider><CartProvider>{children}<CartDrawer /></CartProvider></WishlistProvider>
        <PageViewTracker />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
