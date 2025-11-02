import { ProductForm } from '@/components/admin/product-form'
import { getArtForms } from '@/lib/api'

export default async function NewProductPage() {
  const artForms = await getArtForms()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-heading-2 font-display text-brand-primary">Add New Product</h1>
        <p className="text-body text-foreground-muted">
          Create a new product in your catalog
        </p>
      </div>

      <ProductForm artForms={artForms} />
    </div>
  )
}
