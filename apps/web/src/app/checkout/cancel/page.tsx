import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <div className="container-custom py-12">
      <div className="mx-auto max-w-2xl text-center">
        {/* Cancel Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-10 w-10 text-yellow-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-heading-2 font-display text-brand-primary">
          Checkout Cancelled
        </h1>

        <p className="mb-8 text-body text-foreground-muted">
          Your payment was not processed. Your cart items have been saved and are
          waiting for you.
        </p>

        <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-body text-yellow-800">
            No charges were made to your account. You can continue shopping or
            complete your checkout when you're ready.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/checkout"
            className="btn-primary px-6 py-3"
          >
            Return to Checkout
          </Link>

          <Link
            href="/shop"
            className="btn-secondary px-6 py-3"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
            Need Help?
          </h2>
          <p className="text-body text-foreground-muted">
            If you experienced any issues during checkout, please contact our
            support team:
          </p>
          <a
            href="mailto:support@nati.com"
            className="mt-2 inline-block text-body font-semibold text-brand-accent hover:underline"
          >
            support@nati.com
          </a>
        </div>
      </div>
    </div>
  )
}
