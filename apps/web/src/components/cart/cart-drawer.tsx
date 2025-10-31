'use client'

import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/stripe'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter()
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-heading-4 font-display text-brand-primary">
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="text-foreground-muted hover:text-foreground"
              aria-label="Close cart"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="text-body text-foreground-muted">Your cart is empty</p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="btn-primary mt-4 px-6 py-2"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
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
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-foreground-muted hover:text-red-600"
                          aria-label="Remove item"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="h-8 w-8 rounded-md border border-gray-300 hover:bg-gray-100"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-body w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 rounded-md border border-gray-300 hover:bg-gray-100"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-body font-semibold text-brand-primary">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-body font-medium text-foreground">Subtotal</span>
                <span className="text-heading-4 font-display text-brand-primary">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full py-3 text-center"
              >
                Proceed to Checkout
              </button>

              <p className="mt-3 text-center text-body-small text-foreground-muted">
                Shipping and taxes calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
