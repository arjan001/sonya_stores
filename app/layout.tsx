import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
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
    default: "Sonya Stores | Quality Shoes & Home Decor at Unbeatable Prices",
    template: "%s | Sonya Stores",
  },
  description:
    "Sonya Stores - Home for your most trusted Shoes Quality and Home Decor at unbeatable prices. Find us at Nature HSE opposite Agro HSE stall. Call 0723274619.",
  keywords: [
    "sonya stores", "Sonya Stores Kenya", "quality shoes Kenya",
    "women shoes Nairobi", "men shoes Kenya", "sneakers Kenya",
    "handbags Kenya", "home decor Kenya", "home accessories Nairobi",
    "affordable shoes Kenya", "sandals Kenya", "leather shoes Nairobi",
    "tote bags Kenya", "crossbody bags", "home decorations",
    "fashion Nairobi", "online shopping Kenya", "shoe store Kenya",
  ],
  authors: [{ name: "Sonya Stores", url: siteUrl }],
  publisher: "Sonya Stores",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "Sonya Stores",
    title: "Sonya Stores | Quality Shoes & Home Decor at Unbeatable Prices",
    description: "Home for your most trusted Shoes Quality and Home Decor at unbeatable prices.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonya Stores | Quality Shoes & Home Decor",
    description: "Your most trusted source for quality shoes and home decor at unbeatable prices.",
    creator: "@sonyas.store",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  other: {
    "tiktok:creator": "@sonyas.store",
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
        <WishlistProvider><CartProvider>{children}</CartProvider></WishlistProvider>
        <PageViewTracker />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
