import { ProductDetailPage } from "@/components/store/product-detail-page"
import { getProductBySlug } from "@/lib/supabase-data"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

const SITE_URL = "https://kallittofashions.com"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const product = await getProductBySlug(slug)
    if (!product) return { title: "Product Not Found | Kallittos Fashions" }
    const desc = product.description.slice(0, 155) + (product.description.length > 155 ? "..." : "")
    return {
      title: `${product.name} | Kallittos Fashions`,
      description: `${desc} | Shop curated thrift & new denim at Kallittos Fashions.`,
      keywords: [
        product.name, "Kallittos Fashions", "thrift denim Kenya",
        "curated denim", "sustainable fashion", "buy jeans online Kenya",
        product.category || "", "thrift jeans Nairobi",
      ],
      alternates: {
        canonical: `${SITE_URL}/product/${slug}`,
      },
      openGraph: {
        title: `${product.name} | Kallittos Fashions`,
        description: `${desc} Style meets sustainability.`,
        url: `${SITE_URL}/product/${slug}`,
        images: product.images[0] ? [{ url: product.images[0], width: 600, height: 800, alt: `${product.name} - Kallittos Fashions` }] : [],
        type: "website",
        siteName: "Kallittos Fashions",
        locale: "en_KE",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | Kallittos Fashions`,
        description: desc,
        images: product.images[0] ? [product.images[0]] : [],
        creator: "@kallittos",
      },
    }
  } catch {
    return { title: "Product Not Found | Kallittos Fashions" }
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Fetch product for structured data
  let jsonLd = null
  try {
    const product = await getProductBySlug(slug)
    if (product) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        url: `${SITE_URL}/product/${slug}`,
        image: product.images,
        brand: { "@type": "Brand", name: "Kallittos Fashions" },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "KES",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "Kallittos Fashions",
            url: SITE_URL,
          },
          itemCondition: product.condition === "thrift"
            ? "https://schema.org/UsedCondition"
            : "https://schema.org/NewCondition",
        },
        category: product.category,
      }
    }
  } catch {}

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailPage slug={slug} />
    </>
  )
}
