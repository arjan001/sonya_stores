import type { Metadata } from "next"
import { TopBar } from "@/components/store/top-bar"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"

export const metadata: Metadata = {
  title: "Refund Policy | Sonya Stores",
  description: "Understand Sonya Stores refund, return, and exchange policy.",
  alternates: { canonical: "https://sonyastores.com/refund-policy" },
  keywords: ["refund policy", "sonya stores", "returns", "exchange"],
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopBar />
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-12 lg:py-16">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-balance">Refund Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: February 2026
        </p>
        <div className="mt-10 space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">Return Period</h2>
            <p>We accept returns within 14 days of purchase. Items must be in original condition with all tags attached and packaging intact.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">How to Return Items</h2>
            <p>To initiate a return, please contact us with your order number. Our customer service team will provide you with return instructions and a prepaid shipping label where applicable.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">Refund Processing</h2>
            <p>Once we receive and inspect your returned items, we will process your refund within 5-7 business days. Refunds will be issued to your original payment method.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">Exclusions</h2>
            <p>The following items are not eligible for return:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Items purchased at a final sale or clearance price</li>
              <li>Items showing signs of wear or damage</li>
              <li>Items without original tags or packaging</li>
              <li>Custom or personalized items</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">Exchanges</h2>
            <p>We're happy to exchange items for a different size or color within the same return period. Contact our customer service team for exchange requests.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">Contact Us</h2>
            <p>For refund or return inquiries, please contact:</p>
            <div className="mt-2 space-y-1 text-sm">
              <p><strong className="text-foreground">Sonya Stores</strong></p>
              <p>Phone: 0723 274 619</p>
              <p>Email: info@sonyastores.com</p>
            </div>
          </section>

          <section className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">This refund policy was last updated in February 2026 and is subject to change.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
