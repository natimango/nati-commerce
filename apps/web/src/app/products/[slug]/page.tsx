'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProduct } from '@/lib/api'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/stripe'
import type { Product } from '@/types/product'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProduct(slug)
      setProduct(data)
    } catch (err) {
      console.error('Failed to fetch product:', err)
      setError('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.thumbnail || product.images[0] || '/placeholder-product.jpg',
      artist: product.artist_name,
      artForm: product.art_form,
    })

    // Show success message (could be a toast notification)
    alert('Added to cart!')
  }

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-earth border-t-brand-primary"></div>
            <p className="text-body text-foreground-muted">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container-custom py-12">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-heading-3 font-display text-brand-primary">
              Product Not Found
            </p>
            <p className="mb-6 text-body text-foreground-muted">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/shop" className="btn-primary px-6 py-3">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  return (
    <div className="container-custom py-12">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-body-small text-foreground-muted">
        <Link href="/" className="hover:text-brand-accent">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-accent">
          Shop
        </Link>
        {product.art_form && (
          <>
            <span>/</span>
            <span className="text-foreground">{product.art_form}</span>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Images */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images[selectedImage] || product.thumbnail || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.is_limited_edition && (
                <span className="rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-white">
                  Limited Edition
                  {product.edition_size && ` (${product.edition_number}/${product.edition_size})`}
                </span>
              )}
              {hasDiscount && (
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-brand-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div>
          {/* Art Form */}
          {product.art_form && (
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-brand-accent">
              {product.art_form}
            </p>
          )}

          {/* Product Name */}
          <h1 className="mb-2 text-heading-2 font-display text-brand-primary">
            {product.name}
          </h1>

          {/* Artist */}
          {product.artist_name && (
            <p className="mb-4 text-body text-foreground-muted">
              by{' '}
              {product.artist_id ? (
                <Link
                  href={`/artists/${product.artist_id}`}
                  className="font-medium text-brand-accent hover:underline"
                >
                  {product.artist_name}
                </Link>
              ) : (
                <span className="font-medium">{product.artist_name}</span>
              )}
            </p>
          )}

          {/* Price */}
          <div className="mb-6 flex items-center gap-3">
            <span className="text-heading-3 font-display text-brand-primary">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-body text-foreground-muted line-through">
                  {formatPrice(product.compare_at_price!)}
                </span>
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                  Save {discountPercentage}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <p className="text-body text-foreground">{product.description}</p>
          </div>

          {/* Add to Cart */}
          <div className="mb-8">
            {product.in_stock ? (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <label htmlFor="quantity" className="text-body font-medium text-foreground">
                    Quantity:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 rounded-md border border-gray-300 hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-10 w-16 rounded-md border border-gray-300 text-center text-body"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 rounded-md border border-gray-300 hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Stock Status */}
                {product.stock_quantity && product.stock_quantity <= 10 && (
                  <p className="text-body-small text-orange-600">
                    Only {product.stock_quantity} left in stock
                  </p>
                )}

                {/* Add to Cart Button */}
                <button onClick={handleAddToCart} className="btn-primary w-full py-3 text-center">
                  Add to Cart
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                <p className="text-body font-medium text-foreground-muted">Out of Stock</p>
                <p className="text-body-small text-foreground-muted">
                  Contact us to be notified when this item is back in stock
                </p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            {/* Production Method */}
            {product.production_method && (
              <div className="flex justify-between text-body">
                <span className="text-foreground-muted">Production Method:</span>
                <span className="font-medium capitalize text-foreground">
                  {product.production_method.replace('_', ' ')}
                </span>
              </div>
            )}

            {/* Fabric Type */}
            {product.fabric_type && (
              <div className="flex justify-between text-body">
                <span className="text-foreground-muted">Fabric:</span>
                <span className="font-medium text-foreground">{product.fabric_type}</span>
              </div>
            )}

            {/* Sustainability Score */}
            {product.sustainability_score && (
              <div className="flex justify-between text-body">
                <span className="text-foreground-muted">Sustainability Score:</span>
                <span className="font-medium text-green-600">
                  {product.sustainability_score}/100
                </span>
              </div>
            )}

            {/* Certifications */}
            {product.certifications && product.certifications.length > 0 && (
              <div>
                <span className="text-body text-foreground-muted">Certifications:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story Section */}
      {(product.story_title || product.story_content || product.inspiration) && (
        <div className="mt-12 border-t border-gray-200 pt-12">
          <h2 className="mb-6 text-heading-3 font-display text-brand-primary">
            {product.story_title || 'The Story'}
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {product.story_content && (
              <div>
                <h3 className="mb-2 text-body font-semibold text-foreground">About This Piece</h3>
                <p className="text-body text-foreground-muted">{product.story_content}</p>
              </div>
            )}
            {product.inspiration && (
              <div>
                <h3 className="mb-2 text-body font-semibold text-foreground">Inspiration</h3>
                <p className="text-body text-foreground-muted">{product.inspiration}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
