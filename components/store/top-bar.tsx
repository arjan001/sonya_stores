"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function TopBar() {
  const offers: string[] = ["Quality Shoes & Home Decor at Unbeatable Prices | Call 0723274619 | Nature HSE opposite Agro HSE stall"]
  const doubled = [...offers, ...offers]

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden">
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
