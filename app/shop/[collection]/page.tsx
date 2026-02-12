import { CollectionPage } from "@/components/store/collection-page"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params
  const label = collection.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  return {
    title: `${label} | Sonya Stores Kenya`,
    description: `Shop ${label} at Sonya Stores. Premium quality at unbeatable prices. Delivered across Nairobi & Kenya.`,
    openGraph: {
      title: `${label} | Sonya Stores Kenya`,
      description: `Shop ${label} at Sonya Stores. Premium quality at unbeatable prices.`,
      url: `https://sonyastores.com/shop/${collection}`,
      type: "website",
      siteName: "Sonya Stores",
      locale: "en_KE",
    },
    alternates: { canonical: `https://sonyastores.com/shop/${collection}` },
  }
}

export default async function Page({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  return <CollectionPage collection={collection} />
}
