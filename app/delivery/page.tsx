import { DeliveryPage } from "@/components/store/delivery-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Delivery Locations & Rates",
  description:
    "Kallittos Fashions delivery locations and shipping rates across Kenya. Free shipping on orders above KSh 5,000. Same-day delivery available in Nairobi CBD. Pay via M-PESA or cash on delivery.",
  alternates: { canonical: "https://kallittofashions.com/delivery" },
  keywords: [
    "Kallittos Fashions delivery", "denim delivery Nairobi", "free shipping Kenya",
    "same-day delivery Nairobi", "thrift fashion shipping",
  ],
  openGraph: {
    title: "Delivery Locations & Rates | Kallittos Fashions",
    description: "Free shipping on orders above KSh 5,000. Same-day delivery in Nairobi. M-PESA accepted.",
    url: "https://kallittofashions.com/delivery",
    type: "website",
    siteName: "Kallittos Fashions",
    locale: "en_KE",
    images: [{ url: "https://kallittofashions.com/logo-kf.png", width: 512, height: 512, alt: "Kallittos Fashions Delivery" }],
  },
  twitter: {
    card: "summary",
    title: "Delivery Locations & Rates | Kallittos Fashions",
    description: "Free shipping on orders above KSh 5,000. Same-day delivery in Nairobi.",
  },
}

export default function Page() {
  return <DeliveryPage />
}
