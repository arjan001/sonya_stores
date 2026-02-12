import { createAdminClient } from "@/lib/supabase/admin"
import type { Metadata } from "next"
import { TopBar } from "@/components/store/top-bar"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"

async function getPolicy() {
  const supabase = createAdminClient()
  const { data } = await supabase.from("policies").select("*").eq("slug", "refund-policy").single()
  return data
}

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPolicy()
  return {
    title: p?.meta_title || "Refund Policy | Kallittos Fashions",
    description: p?.meta_description || "Understand Kallittos Fashions refund, return, and exchange policy.",
    alternates: { canonical: "https://kallittofashions.com/refund-policy" },
    keywords: p?.meta_keywords?.split(",").map((k: string) => k.trim()) || ["refund policy", "kallittos fashions"],
    authors: [
      { name: "Kallittos Fashions", url: "https://kallittofashions.com" },
      { name: "OnePlusAfrica Tech Solutions", url: "https://oneplusafrica.com/" },
    ],
    creator: "OnePlusAfrica Tech Solutions",
    alternates: { canonical: "https://kallittofashions.com/refund-policy" },
    openGraph: {
      title: p?.meta_title || "Refund Policy | Kallittos Fashions",
      description: p?.meta_description || "Understand Kallittos Fashions refund, return, and exchange policy.",
      url: "https://kallittofashions.com/refund-policy",
      siteName: "Kallittos Fashions",
      type: "website",
    },
  }
}

export default async function RefundPolicyPage() {
  const policy = await getPolicy()
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopBar />
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-12 lg:py-16">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-balance">{policy?.title || "Refund Policy"}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: {policy?.last_updated ? new Date(policy.last_updated).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" }) : "February 2026"}
        </p>
        <div
          className="mt-10 prose prose-sm max-w-none text-muted-foreground prose-headings:text-lg prose-headings:font-serif prose-headings:font-semibold prose-headings:text-foreground prose-strong:text-foreground prose-a:text-foreground prose-a:underline prose-a:underline-offset-2 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: policy?.content || "<p>Content not available.</p>" }}
        />
      </main>
      <Footer />
    </div>
  )
}
