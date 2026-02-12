import type { Metadata } from "next"
import { WishlistPage } from "@/components/store/wishlist-page"

export const metadata: Metadata = {
  title: "My Wishlist | Kallittos Fashions",
  description:
    "Save your favourite thrift and brand-new denim pieces to your Kallittos Fashions wishlist. Curate your perfect collection of jeans, jackets, and dungarees and shop when you are ready. Delivered across Kenya via M-PESA.",
  alternates: { canonical: "https://kallittofashions.com/wishlist" },
  keywords: [
    "Kallittos wishlist", "saved jeans Kenya", "favourite denim Nairobi",
    "thrift jeans wishlist", "denim collection Kenya", "Kallittos Fashions wishlist",
    "buy later jeans", "curated denim picks", "Kallittos saved items",
  ],
  authors: [
    { name: "Kallittos Fashions", url: "https://kallittofashions.com" },
    { name: "OnePlusAfrica Tech Solutions", url: "https://oneplusafrica.com/" },
  ],
  creator: "OnePlusAfrica Tech Solutions",
  publisher: "Kallittos Fashions",
  openGraph: {
    title: "My Wishlist | Kallittos Fashions",
    description: "Your saved denim favourites at Kallittos Fashions. Curate your perfect thrift and new denim collection.",
    url: "https://kallittofashions.com/wishlist",
    siteName: "Kallittos Fashions",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary",
    title: "My Wishlist | Kallittos Fashions",
    description: "Your saved denim favourites at Kallittos Fashions.",
    creator: "@kallittos",
  },
  alternates: { canonical: "https://kallittofashions.com/wishlist" },
}

export default function Page() {
  return <WishlistPage />
}
