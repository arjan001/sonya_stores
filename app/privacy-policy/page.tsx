import type { Metadata } from "next"
import { TopBar } from "@/components/store/top-bar"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | Sonya Stores",
  description: "Learn how Sonya Stores collects, uses, and protects your personal information.",
  alternates: { canonical: "https://sonyastores.com/privacy-policy" },
  keywords: ["privacy policy", "sonya stores", "data protection"],
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopBar />
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-12 lg:py-16">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-balance">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: February 2026
        </p>
        <div className="mt-10 space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">1. Introduction</h2>
            <p>Sonya Stores ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the site includes:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong className="text-foreground">Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the site.</li>
              <li><strong className="text-foreground">Financial Data:</strong> Financial information, such as funds related to your purchases, may be collected when necessary.</li>
              <li><strong className="text-foreground">Device Data:</strong> Information about your device and browsing activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">3. Use of Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Process your transactions and send related information.</li>
              <li>Email regarding registration, order confirmation, and other transactional information.</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the site.</li>
              <li>Generate a personal profile about you so that future visits to the site will be personalized.</li>
              <li>Improve the site in order to better serve you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">4. Disclosure of Your Information</h2>
            <p>We may share or disclose your information in the following situations:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>By Law or to Protect Rights</li>
              <li>Third-Party Service Providers</li>
              <li>Business Transfers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">5. Security of Your Information</h2>
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">6. Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
            <div className="mt-2 space-y-1 text-sm">
              <p><strong className="text-foreground">Sonya Stores</strong></p>
              <p>Nature HSE opposite Agro HSE stall, Nairobi, Kenya</p>
              <p>Phone: 0723 274 619</p>
              <p>Email: info@sonyastores.com</p>
            </div>
          </section>

          <section className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">This privacy policy was last updated in February 2026 and is subject to change.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
