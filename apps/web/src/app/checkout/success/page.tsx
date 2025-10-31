'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart-store'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId) {
      // Clear the cart after successful payment
      clearCart()
    }
  }, [sessionId, clearCart])

  return (
    <div className="container-custom py-12">
      <div className="mx-auto max-w-2xl text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-heading-2 font-display text-brand-primary">
          Payment Successful!
        </h1>

        <p className="mb-8 text-body text-foreground-muted">
          Thank you for your order. We've received your payment and will begin
          processing your order shortly.
        </p>

        {sessionId && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-background-alt p-4">
            <p className="text-body-small text-foreground-muted">
              Order Reference
            </p>
            <p className="text-body font-mono text-foreground">{sessionId}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-body text-foreground">
            A confirmation email has been sent to your registered email address
            with order details and tracking information.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/orders"
              className="btn-primary px-6 py-3"
            >
              View Order History
            </Link>

            <Link
              href="/shop"
              className="btn-secondary px-6 py-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-brand-earth bg-brand-earth/20 p-6">
          <h2 className="mb-2 text-heading-4 font-display text-brand-primary">
            What's Next?
          </h2>
          <div className="space-y-2 text-body text-foreground-muted">
            <p>• Order confirmation email sent</p>
            <p>• Artisan begins crafting your piece</p>
            <p>• Quality check and packaging (2-3 days)</p>
            <p>• Shipped with tracking details (5-7 business days)</p>
          </div>
        </div>

        <p className="mt-8 text-body-small text-foreground-muted">
          Need help? Contact us at{' '}
          <a
            href="mailto:support@nati.com"
            className="text-brand-accent hover:underline"
          >
            support@nati.com
          </a>
        </p>
      </div>
    </div>
  )
}
