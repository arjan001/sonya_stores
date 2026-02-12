import { LandingPage } from "@/components/store/landing-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sonya Stores | Quality Shoes & Home Decor at Unbeatable Prices",
  description:
    "Home for your most trusted Shoes Quality and Home Decor at unbeatable prices. Find us at Nature HSE opposite Agro HSE stall. Call 0723274619.",
  keywords: [
    "sonya stores",
    "quality shoes Kenya",
    "women shoes",
    "men shoes",
    "home decor Kenya",
    "handbags Kenya",
    "affordable shoes Nairobi",
    "home accessories",
    "sneakers Kenya",
    "fashion Nairobi",
    "online shopping Kenya",
  ],
  alternates: { canonical: "https://sonyastores.com" },
  openGraph: {
    title: "Sonya Stores | Quality Shoes & Home Decor at Unbeatable Prices",
    description: "Home for your most trusted Shoes Quality and Home Decor at unbeatable prices. Nature HSE opposite Agro HSE stall.",
    url: "https://sonyastores.com",
    type: "website",
    siteName: "Sonya Stores",
    locale: "en_KE",
    images: [{ url: "https://sonyastores.com/logo-sonya.png", width: 512, height: 512, alt: "Sonya Stores Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonya Stores | Quality Shoes & Home Decor",
    description: "Your most trusted source for quality shoes and home decor at unbeatable prices.",
    images: ["https://sonyastores.com/logo-sonya.png"],
    creator: "@sonyas.store",
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
            name: "Sonya Stores",
            description: "Quality shoes and home decor at unbeatable prices in Kenya",
            url: "https://sonyastores.com",
            mainEntity: {
              "@type": "LocalBusiness",
              name: "Sonya Stores",
              description: "Home for your most trusted Shoes Quality and Home Decor at unbeatable prices",
              image: "https://sonyastores.com/logo-sonya.png",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Nature HSE opposite Agro HSE stall",
                addressLocality: "Nairobi",
                addressRegion: "Nairobi",
                addressCountry: "KE",
              },
              telephone: "+254723274619",
              url: "https://sonyastores.com",
            },
          }),
        }}
      />
      <LandingPage />
    </>
  )
}
