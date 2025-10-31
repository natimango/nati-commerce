'use client'

import { useState, useEffect } from 'react'
import { ProductGrid } from '@/components/products/product-grid'
import { getProducts, getArtForms } from '@/lib/api'
import type { Product, ArtForm, ProductListParams } from '@/types/product'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [artForms, setArtForms] = useState<ArtForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [selectedArtForm, setSelectedArtForm] = useState<string>('')
  const [sortBy, setSortBy] = useState<ProductListParams['sort']>('newest')
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchArtForms()
  }, [selectedArtForm, sortBy, showOnlyInStock])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: ProductListParams = {
        sort: sortBy,
        in_stock: showOnlyInStock || undefined,
      }

      if (selectedArtForm) {
        params.art_form = selectedArtForm
      }

      const response = await getProducts(params)
      setProducts(response.products)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const fetchArtForms = async () => {
    try {
      const forms = await getArtForms()
      setArtForms(forms.filter((form) => form.is_active))
    } catch (err) {
      console.error('Failed to fetch art forms:', err)
    }
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-heading-1 font-display text-brand-primary">
          Shop
        </h1>
        <p className="text-body text-foreground-muted">
          Discover handcrafted pieces celebrating India's rich textile heritage
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Art Form Filter */}
          <div>
            <label htmlFor="art-form" className="sr-only">
              Filter by Art Form
            </label>
            <select
              id="art-form"
              value={selectedArtForm}
              onChange={(e) => setSelectedArtForm(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-body text-foreground focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="">All Art Forms</option>
              {artForms.map((form) => (
                <option key={form.id} value={form.slug}>
                  {form.name}
                </option>
              ))}
            </select>
          </div>

          {/* In Stock Filter */}
          <label className="flex items-center gap-2 text-body text-foreground">
            <input
              type="checkbox"
              checked={showOnlyInStock}
              onChange={(e) => setShowOnlyInStock(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
            />
            In stock only
          </label>
        </div>

        {/* Right: Sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-body-small text-foreground-muted">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ProductListParams['sort'])}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-body text-foreground focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-earth border-t-brand-primary"></div>
            <p className="text-body text-foreground-muted">Loading products...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-body text-red-700">{error}</p>
          </div>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="mt-8 text-center text-body-small text-foreground-muted">
          Showing {products.length} {products.length === 1 ? 'product' : 'products'}
        </div>
      )}
    </div>
  )
}
