import { CollectionPage } from "@/components/store/collection-page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

const VALID_COLLECTIONS = ["men", "women", "babyshop"] as const

const META: Record<string, { title: string; description: string; keywords: string[]; schema: Record<string, unknown> }> = {
  men: {
    title: "Men's Denim Collection | Premium Jeans & Jackets | Kallittos Fashions Kenya",
    description: "Shop premium men's denim at Kallittos Fashions. Slim fits, relaxed cuts, rugged denim jackets & more. Curated thrift & brand-new pieces. M-PESA & WhatsApp orders. Delivered across Kenya.",
    keywords: ["men's jeans Kenya", "denim jackets men", "slim fit jeans", "relaxed fit denim", "men's fashion Kenya", "premium denim for men", "thrift jeans men", "brand new jeans Kenya", "denim collection", "men's clothing"],
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Men's Denim Collection",
      description: "Premium men's denim collection featuring slim fits, relaxed cuts, and rugged jackets",
      url: "https://kallittofashions.com/shop/men",
      mainEntity: {
        "@type": "ItemCollection",
        name: "Men's Denim",
        description: "Curated collection of premium men's denim",
        inLanguage: "en",
      },
    },
  },
  women: {
    title: "Women's Denim Collection | Mom Jeans, Skinny & More | Kallittos Fashions",
    description: "Discover premium women's denim at Kallittos Fashions. Mom jeans, skinny jeans, wide-leg denim, skirts & jackets. Curated thrift & brand-new styles. Fast delivery across Kenya.",
    keywords: ["women's jeans Kenya", "mom jeans", "skinny jeans women", "wide leg denim", "denim skirts", "denim jackets women", "high waisted jeans", "women's fashion Kenya", "thrift jeans women", "premium denim"],
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Women's Denim Collection",
      description: "Premium women's denim collection featuring mom jeans, skinny, wide-leg, and more styles",
      url: "https://kallittofashions.com/shop/women",
      mainEntity: {
        "@type": "ItemCollection",
        name: "Women's Denim",
        description: "Curated collection of premium women's denim styles",
        inLanguage: "en",
      },
    },
  },
  babyshop: {
    title: "Kali-ttos Little Wardrobe | Baby & Toddler Clothing | Ages 0-6",
    description: "Shop Kali-ttos Little Wardrobe for adorable baby & toddler clothing, shoes & accessories. Ages 0-1, 1-3 & 4-6. Follow @kalittos01 on TikTok. Safe, stylish pieces delivered across Kenya.",
    keywords: ["baby clothing Kenya", "toddler fashion", "baby clothes ages 0-6", "infant clothing", "toddler dresses", "baby shoes", "cute baby outfits", "little wardrobe", "baby fashion Kenya", "newborn to 6 years"],
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Kali-ttos Little Wardrobe",
      description: "Baby & toddler clothing collection for ages 0-6",
      url: "https://kallittofashions.com/shop/babyshop",
      mainEntity: {
        "@type": "ItemCollection",
        name: "Baby & Toddler Collection",
        description: "Curated collection of baby & toddler clothing for ages 0-6",
        inLanguage: "en",
      },
    },
  },
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params
  const meta = META[collection]
  if (!meta) return { title: "Collection Not Found" }
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: "Kallittos Fashions" }],
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://kallittofashions.com/shop/${collection}`,
      type: "website",
      siteName: "Kallittos Fashions",
      locale: "en_KE",
      images: [{ url: `https://kallittofashions.com/banners/${collection}-collection.jpg`, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`https://kallittofashions.com/banners/${collection}-collection.jpg`],
    },
    alternates: {
      canonical: `https://kallittofashions.com/shop/${collection}`,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  if (!VALID_COLLECTIONS.includes(collection as typeof VALID_COLLECTIONS[number])) {
    notFound()
  }
  
  const meta = META[collection]
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(meta.schema),
        }}
      />
      <CollectionPage collection={collection} />
    </>
  )
}
