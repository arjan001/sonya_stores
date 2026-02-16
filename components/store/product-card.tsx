"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, Eye } from "lucide-react"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const wishlisted = isInWishlist(product.id)

  return (
    <div className="group">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
          <Image
            src={product.images?.[0] || "/placeholder.svg?height=800&width=600"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=800&width=600"
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.stockQuantity <= 0 && (
              <span className="bg-red-600 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1">
                Out of Stock
              </span>
            )}
            {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
              <span className="bg-orange-600 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1">
                Low Stock
              </span>
            )}
            {product.isNew && (
              <span className="bg-foreground text-background text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1">
                New
              </span>
            )}
            {product.isOnOffer && product.offerPercentage && (
              <span className="bg-foreground text-background text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1">
                -{product.offerPercentage}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(product) }}
              className="w-9 h-9 flex items-center justify-center bg-background rounded-full shadow-sm hover:bg-secondary transition-colors"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </button>
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center bg-background rounded-full shadow-sm hover:bg-secondary transition-colors"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Add to Cart */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (product.stockQuantity > 0) addItem(product)
              }}
              disabled={product.stockQuantity <= 0}
              className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                product.stockQuantity <= 0 
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                  : 'bg-foreground text-background hover:bg-foreground/90'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {product.stockQuantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>

      <div className="mt-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {product.category}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium mt-1 group-hover:underline line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
