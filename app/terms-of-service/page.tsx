import type { Metadata } from "next"
import { TopBar } from "@/components/store/top-bar"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"

export const metadata: Metadata = {
  title: "Terms of Service | Sonya Stores",
  description: "Read the terms and conditions governing your use of the Sonya Stores website.",
  alternates: { canonical: "https://sonyastores.com/terms-of-service" },
  keywords: ["terms of service", "sonya stores", "terms and conditions"],
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopBar />
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-12 lg:py-16">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-balance">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: February 2026
        </p>
        <div className="mt-10 space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">1. Agreement to Terms</h2>
            <p>By accessing and using the Sonya Stores website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on Sonya Stores website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Sell or rent any materials obtained from the website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">3. Disclaimer</h2>
            <p>The materials on Sonya Stores website are provided on an 'as is' basis. Sonya Stores makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">4. Limitations</h2>
            <p>In no event shall Sonya Stores or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Sonya Stores website.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">5. Accuracy of Materials</h2>
            <p>The materials appearing on Sonya Stores website could include technical, typographical, or photographic errors. Sonya Stores does not warrant that any of the materials on its website are accurate, complete, or current. Sonya Stores may make changes to the materials contained on its website at any time without notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">6. Links</h2>
            <p>Sonya Stores has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Sonya Stores of the site. Use of any such linked website is at the user's own risk.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">7. Modifications</h2>
            <p>Sonya Stores may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">8. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of Kenya, and you irrevocably submit to the exclusive jurisdiction of the courts located in Kenya.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-foreground">9. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us:</p>
            <div className="mt-2 space-y-1 text-sm">
              <p><strong className="text-foreground">Sonya Stores</strong></p>
              <p>Nature HSE opposite Agro HSE stall, Nairobi, Kenya</p>
              <p>Phone: 0723 274 619</p>
              <p>Email: info@sonyastores.com</p>
            </div>
          </section>

          <section className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">These terms of service were last updated in February 2026 and are subject to change.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
