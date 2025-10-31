import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types/product'
import { formatPrice } from '@/lib/stripe'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Image
          src={product.thumbnail || product.images[0] || '/placeholder-product.jpg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-2">
          {product.is_limited_edition && (
            <span className="rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-white">
              Limited Edition
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
              Sale
            </span>
          )}
          {!product.in_stock && (
            <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-white">
              Sold Out
            </span>
          )}
        </div>

        {/* Sustainability Score */}
        {product.sustainability_score && product.sustainability_score >= 80 && (
          <div className="absolute bottom-2 right-2">
            <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white">
              🌿 Eco-Friendly
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Art Form */}
        {product.art_form && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-brand-accent">
            {product.art_form}
          </p>
        )}

        {/* Product Name */}
        <h3 className="mb-1 text-body font-semibold text-foreground transition-colors group-hover:text-brand-primary">
          {product.name}
        </h3>

        {/* Artist */}
        {product.artist_name && (
          <p className="mb-2 text-body-small text-foreground-muted">
            by {product.artist_name}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-body font-bold text-brand-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-body-small text-foreground-muted line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>

        {/* Production Method */}
        {product.production_method && (
          <p className="mt-2 text-xs text-foreground-muted capitalize">
            {product.production_method.replace('_', ' ')}
          </p>
        )}
      </div>
    </Link>
  )
}
