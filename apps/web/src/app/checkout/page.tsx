'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/stripe'
import { getStripe } from '@/lib/stripe'
import Image from 'next/image'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect to home if cart is empty
    if (items.length === 0) {
      router.push('/')
    }
  }, [items, router])

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripe()
      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="container-custom py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-heading-2 font-display text-brand-primary">
          Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
                Order Summary
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <h3 className="text-body font-medium text-foreground">
                        {item.name}
                      </h3>
                      {item.artist && (
                        <p className="text-body-small text-foreground-muted">
                          by {item.artist}
                        </p>
                      )}
                      {(item.size || item.color) && (
                        <p className="text-body-small text-foreground-muted">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-body-small text-foreground-muted">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-body font-semibold text-brand-primary">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-background-alt p-6">
              <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
                Price Details
              </h2>

              <div className="space-y-3 border-b border-gray-200 pb-4">
                <div className="flex justify-between text-body">
                  <span className="text-foreground-muted">Subtotal</span>
                  <span className="text-foreground">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-body">
                  <span className="text-foreground-muted">Shipping</span>
                  <span className="text-foreground">Calculated at next step</span>
                </div>
              </div>

              <div className="mb-6 mt-4 flex justify-between">
                <span className="text-body font-semibold text-foreground">Total</span>
                <span className="text-heading-4 font-display text-brand-primary">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-body-small text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Proceed to Payment'}
              </button>

              <Link
                href="/"
                className="mt-4 block text-center text-body-small text-brand-accent hover:underline"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 text-body-small text-foreground-muted">
                <p className="mb-2 font-semibold">Secure Checkout</p>
                <p>
                  Your payment information is encrypted and secure. We accept major
                  credit cards, debit cards, and UPI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
