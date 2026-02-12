import { Suspense } from "react"
import { ShopPage } from "@/components/store/shop-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop Thrift Jeans & Denim | Kallittos Fashions Kenya",
  description:
    "Browse Kallittos Fashions full collection of curated thrift & brand-new mom jeans, skinny jeans, boyfriend jeans, denim shorts, wide-leg denim & more. Best denim designs in Kenya. Filter by category, size, and price. Delivered across Nairobi & Kenya.",
  alternates: { canonical: "https://kallittofashions.com/shop" },
  keywords: [
    "kallittosfashions shop", "buy thrift jeans online Kenya", "shop denim Nairobi",
    "mom jeans Kenya", "skinny jeans Nairobi", "boyfriend jeans Kenya", "ripped jeans Kenya",
    "denim shorts Kenya", "best jeans Kenya", "affordable jeans Nairobi",
    "mtumba jeans online", "thrift denim collection", "premium thrift jeans",
    "women jeans Kenya", "plus size jeans Nairobi", "Kenya denim online shop",
  ],
  openGraph: {
    title: "Shop Thrift Jeans & Denim | Kallittos Fashions Kenya",
    description: "Best curated thrift & new denim in Kenya. Mom jeans, skinny, boyfriend, shorts & more. Delivered across Nairobi & Kenya.",
    url: "https://kallittofashions.com/shop",
    type: "website",
    siteName: "Kallittos Fashions",
    locale: "en_KE",
    images: [{ url: "https://kallittofashions.com/logo-kf.png", width: 512, height: 512, alt: "Kallittos Fashions Shop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Thrift Jeans & Denim | Kallittos Fashions Kenya",
    description: "Best curated thrift & new denim in Kenya. Delivered across Nairobi & Kenya.",
    images: ["https://kallittofashions.com/logo-kf.png"],
  },
}

export default function Page() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  )
}
