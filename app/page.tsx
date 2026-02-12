import { LandingPage } from "@/components/store/landing-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kallittos Fashions | Curated Thrift & New Denim - Jeans, Jackets & More in Kenya",
  description:
    "Shop the best curated thrift & brand-new denim at Kallittos Fashions. Mom jeans, skinny jeans, boyfriend jeans, wide-leg denim, denim jackets & dungarees. Sustainable fashion delivered across Kenya via M-PESA.",
  keywords: [
    "kallittos fashions",
    "thrift jeans Kenya",
    "mom jeans",
    "denim Nairobi",
    "sustainable fashion Kenya",
    "buy jeans online Kenya",
    "mtumba jeans",
    "skinny jeans",
    "boyfriend jeans Kenya",
    "fashion Nairobi",
    "clothing Kenya",
    "online shopping Kenya",
  ],
  alternates: { canonical: "https://kallittofashions.com" },
  openGraph: {
    title: "Kallittos Fashions | Curated Thrift & New Denim in Kenya",
    description: "Shop curated thrift & brand-new mom jeans, wide-leg denim, and vintage jackets. Style meets sustainability. Delivered across Kenya.",
    url: "https://kallittofashions.com",
    type: "website",
    siteName: "Kallittos Fashions",
    locale: "en_KE",
    images: [{ url: "https://kallittofashions.com/logo-kf.png", width: 512, height: 512, alt: "Kallittos Fashions Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kallittos Fashions | Curated Thrift & New Denim in Kenya",
    description: "Shop curated thrift & brand-new denim. Style meets sustainability. Delivered across Kenya.",
    images: ["https://kallittofashions.com/logo-kf.png"],
    creator: "@kallittos",
  },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Kallittos Fashions",
            description: "Curated thrift & brand-new denim online store in Kenya",
            url: "https://kallittofashions.com",
            mainEntity: {
              "@type": "LocalBusiness",
              name: "Kallittos Fashions",
              description: "Premium curated denim, baby clothing & fashion in Kenya",
              image: "https://kallittofashions.com/logo-kf.png",
              address: {
                "@type": "PostalAddress",
                streetAddress: "2nd Floor, Room ML 96, Dynamic Mall",
                addressLocality: "Nairobi CBD",
                addressRegion: "Nairobi",
                postalCode: "00100",
                addressCountry: "KE",
              },
              telephone: "+254713809695",
              url: "https://kallittofashions.com",
            },
          }),
        }}
      />
      <LandingPage />
    </>
  )
}
