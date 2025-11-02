import { ProductForm } from '@/components/admin/product-form'
import { getArtForms } from '@/lib/api'

async function getProduct(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
    {
      cache: 'no-store',
    }
  )
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  const data = await response.json()
  return data.product || data
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const [product, artForms] = await Promise.all([
    getProduct(params.id),
    getArtForms(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-heading-2 font-display text-brand-primary">
          Edit Product
        </h1>
        <p className="text-body text-foreground-muted">
          Update product information
        </p>
      </div>

      <ProductForm product={product} artForms={artForms} />
    </div>
  )
}
