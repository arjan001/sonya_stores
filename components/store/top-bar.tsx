"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function TopBar() {
  const { data } = useSWR("/api/site-data", fetcher)
  const offers: string[] = data?.navbarOffers?.map((o: { text: string }) => o.text) || ["FREE SHIPPING on orders above KSh 5,000"]
  const doubled = [...offers, ...offers]

  return (
    <div className="bg-foreground text-background overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap py-2">
        {doubled.map((offer, i) => (
          <span key={i} className="mx-8 text-xs tracking-widest uppercase">
            {offer}
          </span>
        ))}
      </div>
    </div>
  )
}
