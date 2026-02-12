import { Suspense } from "react"
import { ShopPage } from "@/components/store/shop-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop All | Sonya Stores Kenya",
  description:
    "Browse Sonya Stores full collection of premium shoes, handbags, sneakers and home accessories. Quality footwear and elegant home decor at unbeatable prices. Delivered across Nairobi & Kenya.",
  alternates: { canonical: "https://sonyastores.com/shop" },
  keywords: [
    "sonya stores shop", "buy shoes online Kenya", "shop shoes Nairobi",
    "women shoes Kenya", "men shoes Nairobi", "sneakers Kenya", "handbags Kenya",
    "home accessories Kenya", "affordable shoes Nairobi", "quality footwear Kenya",
    "home decor Nairobi", "premium shoes", "elegant handbags",
  ],
  openGraph: {
    title: "Shop All | Sonya Stores Kenya",
    description: "Premium shoes, handbags and home accessories at unbeatable prices. Delivered across Nairobi & Kenya.",
    url: "https://sonyastores.com/shop",
    type: "website",
    siteName: "Sonya Stores",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All | Sonya Stores Kenya",
    description: "Premium shoes, handbags and home accessories. Delivered across Nairobi & Kenya.",
  },
}

export default function Page() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  )
}
