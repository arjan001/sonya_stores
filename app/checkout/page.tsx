import { CheckoutPage } from "@/components/store/checkout-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Kallittos Fashions order. Pay via M-PESA or order via WhatsApp. Secure checkout for curated thrift & new denim.",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <CheckoutPage />
}
