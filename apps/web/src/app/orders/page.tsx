import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function OrdersPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // TODO: Fetch orders from API once order endpoint is implemented
  // For now, show placeholder
  const orders: any[] = []

  return (
    <div className="container-custom py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-heading-2 font-display text-brand-primary">
          Order History
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-background-alt p-12 text-center">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-foreground-muted"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>

            <h2 className="mb-2 text-heading-4 font-display text-brand-primary">
              No Orders Yet
            </h2>
            <p className="mb-6 text-body text-foreground-muted">
              Start exploring our collection of handcrafted Indian art pieces
            </p>

            <Link
              href="/shop"
              className="btn-primary inline-block px-6 py-3"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-body-small text-foreground-muted">
                      Order #{order.id}
                    </p>
                    <p className="text-body font-medium text-foreground">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-body-small text-foreground-muted">Total</p>
                    <p className="text-heading-4 font-display text-brand-primary">
                      ₹{order.amount_total}
                    </p>
                  </div>
                </div>

                <div className="mb-4 border-t border-gray-100 pt-4">
                  <div className="space-y-2">
                    {order.items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-body">
                        <span className="text-foreground">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="text-foreground-muted">
                          ₹{item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-body-small font-medium ${
                      order.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </span>

                  <Link
                    href={`/orders/${order.id}`}
                    className="text-body-small font-medium text-brand-accent hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
