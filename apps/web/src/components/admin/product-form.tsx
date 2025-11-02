'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, ArtForm } from '@/types/product'

interface ProductFormProps {
  product?: Product
  artForms: ArtForm[]
}

export function ProductForm({ product, artForms }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    compare_at_price: product?.compare_at_price || 0,
    images: product?.images?.join('\n') || '',
    thumbnail: product?.thumbnail || '',
    in_stock: product?.in_stock ?? true,
    stock_quantity: product?.stock_quantity || 0,
    art_form_id: product?.art_form_id || '',
    fabric_type: product?.fabric_type || '',
    production_method: product?.production_method || 'handloom',
    story_title: product?.story_title || '',
    story_content: product?.story_content || '',
    inspiration: product?.inspiration || '',
    sustainability_score: product?.sustainability_score || 0,
    certifications: product?.certifications?.join(', ') || '',
    is_limited_edition: product?.is_limited_edition || false,
    edition_size: product?.edition_size || 0,
    is_featured: product?.is_featured || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Convert form data to API format
      const payload = {
        ...formData,
        images: formData.images.split('\n').filter(Boolean),
        certifications: formData.certifications.split(',').map((c) => c.trim()).filter(Boolean),
        price: Number(formData.price),
        compare_at_price: formData.compare_at_price ? Number(formData.compare_at_price) : undefined,
        stock_quantity: Number(formData.stock_quantity),
        sustainability_score: formData.sustainability_score ? Number(formData.sustainability_score) : undefined,
        edition_size: formData.edition_size ? Number(formData.edition_size) : undefined,
      }

      const url = product
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${product.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/products`

      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to save product')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Auto-generate slug from name
    if (name === 'name' && !product) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
          Basic Information
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <div>
            <label htmlFor="slug" className="mb-2 block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-heading-4 font-display text-brand-primary">Pricing</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-700">
              Price (₹) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <div>
            <label htmlFor="compare_at_price" className="mb-2 block text-sm font-medium text-gray-700">
              Compare at Price (₹)
            </label>
            <input
              type="number"
              id="compare_at_price"
              name="compare_at_price"
              min="0"
              step="0.01"
              value={formData.compare_at_price}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
            <p className="mt-1 text-xs text-gray-500">Original price for sale display</p>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-heading-4 font-display text-brand-primary">Inventory</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="stock_quantity" className="mb-2 block text-sm font-medium text-gray-700">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock_quantity"
              name="stock_quantity"
              required
              min="0"
              value={formData.stock_quantity}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="in_stock"
                checked={formData.in_stock}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>
          </div>
        </div>
      </div>

      {/* Cultural Metadata */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
          Cultural Metadata
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="art_form_id" className="mb-2 block text-sm font-medium text-gray-700">
              Art Form
            </label>
            <select
              id="art_form_id"
              name="art_form_id"
              value={formData.art_form_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="">Select Art Form</option>
              {artForms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fabric_type" className="mb-2 block text-sm font-medium text-gray-700">
              Fabric Type
            </label>
            <input
              type="text"
              id="fabric_type"
              name="fabric_type"
              value={formData.fabric_type}
              onChange={handleChange}
              placeholder="e.g., Cotton, Silk"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <div>
            <label htmlFor="production_method" className="mb-2 block text-sm font-medium text-gray-700">
              Production Method
            </label>
            <select
              id="production_method"
              name="production_method"
              value={formData.production_method}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="handloom">Handloom</option>
              <option value="hand_painted">Hand Painted</option>
              <option value="block_print">Block Print</option>
              <option value="screen_print">Screen Print</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div>
            <label htmlFor="sustainability_score" className="mb-2 block text-sm font-medium text-gray-700">
              Sustainability Score (0-100)
            </label>
            <input
              type="number"
              id="sustainability_score"
              name="sustainability_score"
              min="0"
              max="100"
              value={formData.sustainability_score}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="certifications" className="mb-2 block text-sm font-medium text-gray-700">
              Certifications
            </label>
            <input
              type="text"
              id="certifications"
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              placeholder="GOTS, Fair Trade (comma-separated)"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-heading-4 font-display text-brand-primary">Images</h2>
        <div className="grid gap-6">
          <div>
            <label htmlFor="thumbnail" className="mb-2 block text-sm font-medium text-gray-700">
              Thumbnail URL
            </label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <div>
            <label htmlFor="images" className="mb-2 block text-sm font-medium text-gray-700">
              Image URLs (one per line)
            </label>
            <textarea
              id="images"
              name="images"
              rows={4}
              value={formData.images}
              onChange={handleChange}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
          Product Story
        </h2>
        <div className="grid gap-6">
          <div>
            <label htmlFor="story_title" className="mb-2 block text-sm font-medium text-gray-700">
              Story Title
            </label>
            <input
              type="text"
              id="story_title"
              name="story_title"
              value={formData.story_title}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <div>
            <label htmlFor="story_content" className="mb-2 block text-sm font-medium text-gray-700">
              Story Content
            </label>
            <textarea
              id="story_content"
              name="story_content"
              rows={4}
              value={formData.story_content}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <div>
            <label htmlFor="inspiration" className="mb-2 block text-sm font-medium text-gray-700">
              Inspiration
            </label>
            <textarea
              id="inspiration"
              name="inspiration"
              rows={4}
              value={formData.inspiration}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Limited Edition */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
          Limited Edition
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_limited_edition"
                checked={formData.is_limited_edition}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-sm font-medium text-gray-700">Limited Edition</span>
            </label>
          </div>

          <div>
            <label htmlFor="edition_size" className="mb-2 block text-sm font-medium text-gray-700">
              Edition Size
            </label>
            <input
              type="number"
              id="edition_size"
              name="edition_size"
              min="0"
              value={formData.edition_size}
              onChange={handleChange}
              disabled={!formData.is_limited_edition}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:bg-gray-100"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-sm font-medium text-gray-700">Featured Product</span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline px-6 py-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-6 py-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
