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

const siteUrl = "https://kallittofashions.com"

export const metadata: Metadata = {
  title: {
    default: "Kallittos | Curated Thrift & New Denim \u2013 Jeans & Jackets",
    template: "%s | Kallittos Fashions",
  },
  description:
    "Kallittos Fashions \u2013 Shop curated thrift & brand-new mom jeans, wide-leg denim, and vintage jackets. Style meets sustainability. Premium denim delivered across Kenya. Order via M-PESA, WhatsApp, or online.",
  keywords: [
    // Brand names (exact match searches)
    "kallittosfashions", "kallittos fashions", "kallittos", "kallitto fashions",
    "Kallittos Fashions Nairobi", "Kallittos denim", "Kallittos jeans",
    // Kenya best designs
    "Kenya best denim designs", "best jeans in Kenya", "best thrift jeans Kenya",
    "Kenya fashion online", "best denim store Nairobi", "top jeans shop Kenya",
    // Thrift jeans & denim searches
    "thrift jeans Kenya", "thrift jeans Nairobi", "buy thrift jeans online Kenya",
    "second hand jeans Nairobi", "mtumba jeans Kenya", "mtumba denim Nairobi",
    "affordable jeans Kenya", "cheap jeans Nairobi", "quality thrift denim",
    // Product types
    "mom jeans Kenya", "skinny jeans Nairobi", "boyfriend jeans Kenya",
    "high waisted jeans Kenya", "ripped jeans Nairobi", "distressed denim Kenya",
    "straight leg jeans Kenya", "wide leg denim Kenya", "baggy jeans Kenya",
    "denim shorts Kenya", "denim jackets Kenya", "denim dungarees Nairobi",
    // Fashion styles
    "Vintage Levi's jeans", "Y2K denim style", "90s vintage denim",
    "streetwear denim Kenya", "sustainable fashion Kenya", "eco-friendly fashion Nairobi",
    "curated thrift shop Kenya", "premium thrift denim", "pre-loved denim",
    // Location specific
    "Dynamic Mall thrift shops", "Nairobi CBD fashion", "thrift stores Nairobi CBD",
    "Gikomba premium thrift", "online denim shop Kenya", "buy jeans online Kenya",
    "denim delivery Nairobi", "M-PESA denim shop", "WhatsApp order jeans Kenya",
    // Generic denim
    "women jeans Kenya", "ladies jeans Nairobi", "plus size jeans Kenya",
    "denim collection Kenya", "new denim arrivals Kenya", "trendy jeans 2026",
    "dark wash denim", "light wash mom jeans", "raw hem jeans",
    // Brand variations & backlinks
    "Kallittos Fashions", "Kallitto Fashions", "Kallittos Fashion Kenya",
    "Kallittos Denim Jeans Nairobi", "Buy Jeans Online Kenya", "Kallittos Mom Jeans",
    "Baggy Jeans Kenya Kallittos", "Thrifted Denim Nairobi",
    "OnePlus Africa Tech Solutions", "OnePlus Africa", "OnePlus Web Design",
    "Kallittos Denim Jackets", "Kallittos Dungarees Nairobi", "Women's Denim Kenya",
    "Sustainable Fashion Nairobi", "Curated Thrift Kallittos", "Kallittos Fashions Online",
    "Best Jeans Shop Nairobi", "OnePlus Software Solutions", "Affordable Denim Kallittos",
    "Ripped Jeans Kallitto", "High Waisted Jeans Kallittos", "Kallittos Fashions Portfolio",
    "OnePlus E-commerce Developers", "Nairobi Fashion Online", "Denim Season Sale Kallittos",
    "Dynamic Mall Nairobi", "Skinny Jeans Kallitto", "Straight Leg Jeans Kallittos",
    "Denim Overalls Kallitto", "OnePlus Digital Solutions", "Kenya Online Boutique",
    "Trendy Denim 2026", "Kallittos TikTok Fashion", "OnePlus Web Development Nairobi",
    "Delivery Locations Kenya", "Kallittos Fashions Contact", "Thrift Meets Style",
    "Denim Destination Kenya", "OnePlus Africa Agency", "Kallittos Fashions Reviews",
    "Wide Leg Jeans Kallittos", "Men's Denim Nairobi", "Custom E-commerce Kenya",
    "OnePlus Tech Services", "Fashion Hub Nairobi", "Denim Drops Kallittos",
    "Kallitto Fashions Shop", "Premium Thrift Kallittos", "OnePlus Africa Projects",
    "Best Online Denim Store", "Kallittos Brand New Denim", "Kallitto Curated Thrift",
    "Kallittos Dynamic Mall", "OnePlus Kenya Web Agency", "Kallittos Denim Hub",
    "Ripped and Rugged Kallittos", "Kallittos Jeans Collection",
    "OnePlus Africa Tech Design", "Kallittos Official Store",
  ],
  authors: [
    { name: "Kallittos Fashions", url: "https://kallittofashions.com" },
    { name: "OnePlusAfrica Tech Solutions", url: "https://oneplusafrica.com/" },
  ],
  creator: "OnePlusAfrica Tech Solutions",
  publisher: "Kallittos Fashions",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "Kallittos Fashions",
    title: "Kallittos | Curated Thrift & New Denim \u2013 Jeans & Jackets",
    description:
      "Shop curated thrift & brand-new mom jeans, wide-leg denim, vintage jackets. Style meets sustainability. Delivered across Kenya.",
    images: [
      {
        url: `${siteUrl}/logo-kf.png`,
        width: 512,
        height: 512,
        alt: "Kallittos Fashions - Curated Thrift & New Denim Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kallittos | Curated Thrift & New Denim \u2013 Jeans & Jackets",
    description:
      "Shop curated thrift & brand-new mom jeans, wide-leg denim, and vintage jackets at Kallittos Fashions. Style meets sustainability.",
    images: [`${siteUrl}/logo-kf.png`],
    creator: "@kallittos",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  other: {
    "instagram:creator": "@kallittofashions",
    "tiktok:creator": "@kallittos",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
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
        <link rel="icon" href="/logo-kf.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-kf.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="google-site-verification" content="FY2n9Zc_Z1exsOdQJ4xsDTMW_P-UBehhQPI_Ana4nCg" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="author" href="https://oneplusafrica.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://kallittofashions.com" },
                { "@type": "ListItem", position: 2, name: "Shop", item: "https://kallittofashions.com/shop" },
                { "@type": "ListItem", position: 3, name: "Men's Collection", item: "https://kallittofashions.com/shop/men" },
                { "@type": "ListItem", position: 4, name: "Women's Collection", item: "https://kallittofashions.com/shop/women" },
                { "@type": "ListItem", position: 5, name: "Kali-ttos Little Wardrobe", item: "https://kallittofashions.com/shop/babyshop" },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Kallittos Fashions",
              legalName: "Kallittos Fashions Kenya",
              url: "https://kallittofashions.com",
              foundingDate: "2024",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                telephone: "+254713809695",
                email: "info@kallitosfashion.com",
                url: "https://wa.me/254713809695",
              },
              location: {
                "@type": "Place",
                name: "Dynamic Mall",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "2nd Floor, Room ML 96, Dynamic Mall",
                  addressLocality: "Nairobi CBD",
                  addressRegion: "Nairobi",
                  postalCode: "00100",
                  addressCountry: "KE",
                },
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Kallittos Fashions",
              description: "Curated thrift & brand-new mom jeans, wide-leg denim, and vintage jackets. Style meets sustainability in Nairobi, Kenya.",
              url: "https://kallittofashions.com",
              telephone: "+254713809695",
              email: "info@kallitosfashion.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Dynamic Mall, 2nd Floor, Room ML 96",
                addressLocality: "Nairobi CBD",
                addressRegion: "Nairobi",
                addressCountry: "KE",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -1.2864,
                longitude: 36.8172,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "09:00",
                closes: "18:00",
              },
              sameAs: [
                "https://www.instagram.com/kallittofashions/",
                "https://www.tiktok.com/@kallittos",
              ],
              priceRange: "KES 1,000 - KES 5,000",
              image: "https://kallittofashions.com/logo-kf.png",
              brand: {
                "@type": "Brand",
                name: "Kallittos Fashions",
              },
              founder: {
                "@type": "Organization",
                name: "OnePlusAfrica Tech Solutions",
                url: "https://oneplusafrica.com/",
              },
              paymentAccepted: "M-PESA, Cash on Delivery",
              currenciesAccepted: "KES",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Kallittos Fashions",
              alternateName: ["Kallittos", "Kallitto Fashions", "KF Denim"],
              url: "https://kallittofashions.com",
              description: "Curated thrift & brand-new denim delivered across Kenya. Mom jeans, skinny jeans, denim jackets & more.",
              publisher: {
                "@type": "Organization",
                name: "Kallittos Fashions",
                logo: {
                  "@type": "ImageObject",
                  url: "https://kallittofashions.com/logo-kf.png",
                },
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://kallittofashions.com/shop?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Kallittos Fashions Site Pages",
              itemListElement: [
                { "@type": "SiteNavigationElement", position: 1, name: "Home", url: "https://kallittofashions.com" },
                { "@type": "SiteNavigationElement", position: 2, name: "Shop All Denim", url: "https://kallittofashions.com/shop" },
                { "@type": "SiteNavigationElement", position: 3, name: "New Arrivals", url: "https://kallittofashions.com/shop?filter=new" },
                { "@type": "SiteNavigationElement", position: 4, name: "Special Offers", url: "https://kallittofashions.com/shop?filter=offers" },
                { "@type": "SiteNavigationElement", position: 5, name: "Delivery & Shipping", url: "https://kallittofashions.com/delivery" },
                { "@type": "SiteNavigationElement", position: 6, name: "Track My Order", url: "https://kallittofashions.com/track-order" },
                { "@type": "SiteNavigationElement", position: 7, name: "Men's Collection", url: "https://kallittofashions.com/shop/men" },
                { "@type": "SiteNavigationElement", position: 8, name: "Women's Collection", url: "https://kallittofashions.com/shop/women" },
                { "@type": "SiteNavigationElement", position: 9, name: "Kali-ttos Little Wardrobe", url: "https://kallittofashions.com/shop/babyshop" },
                { "@type": "SiteNavigationElement", position: 10, name: "Wishlist", url: "https://kallittofashions.com/wishlist" },
                { "@type": "SiteNavigationElement", position: 11, name: "Privacy Policy", url: "https://kallittofashions.com/privacy-policy" },
                { "@type": "SiteNavigationElement", position: 12, name: "Terms of Service", url: "https://kallittofashions.com/terms-of-service" },
                { "@type": "SiteNavigationElement", position: 13, name: "Refund Policy", url: "https://kallittofashions.com/refund-policy" },
              ],
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
