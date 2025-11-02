export default async function AdminAnalyticsPage() {
  // In production, fetch real analytics data
  const analytics = {
    revenue: {
      today: 2450,
      thisWeek: 12300,
      thisMonth: 45680,
      lastMonth: 38920,
    },
    orders: {
      today: 5,
      thisWeek: 23,
      thisMonth: 128,
      lastMonth: 105,
    },
    topProducts: [
      { name: 'Pochampally Ikat Silk Saree', sales: 28, revenue: 238000 },
      { name: 'Kalamkari Hand-Painted Stole', sales: 45, revenue: 112500 },
      { name: 'Gond Art Cotton Kurta', sales: 32, revenue: 59200 },
    ],
  }

  const calculateGrowth = (current: number, previous: number) => {
    const growth = ((current - previous) / previous) * 100
    return growth.toFixed(1)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-heading-2 font-display text-brand-primary">Analytics</h1>
        <p className="text-body text-foreground-muted">
          Sales insights and performance metrics
        </p>
      </div>

      {/* Revenue Overview */}
      <div className="mb-8">
        <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
          Revenue Overview
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-body-small text-foreground-muted">Today</p>
            <p className="mt-2 text-heading-3 font-display text-brand-primary">
              ₹{analytics.revenue.today.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-body-small text-foreground-muted">This Week</p>
            <p className="mt-2 text-heading-3 font-display text-brand-primary">
              ₹{analytics.revenue.thisWeek.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-body-small text-foreground-muted">This Month</p>
            <p className="mt-2 text-heading-3 font-display text-brand-primary">
              ₹{analytics.revenue.thisMonth.toLocaleString()}
            </p>
            <p className="mt-2 text-body-small text-green-600">
              +{calculateGrowth(analytics.revenue.thisMonth, analytics.revenue.lastMonth)}% vs last month
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-body-small text-foreground-muted">Last Month</p>
            <p className="mt-2 text-heading-3 font-display text-brand-primary">
              ₹{analytics.revenue.lastMonth.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Orders Overview */}
      <div className="mb-8">
        <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
          Orders Overview
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-body-small text-foreground-muted">Today</p>
            <p className="mt-2 text-heading-3 font-display text-brand-primary">
              {analytics.orders.today}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-body-small text-foreground-muted">This Week</p>
            <p className="mt-2 text-heading-3 font-display text-brand-primary">
              {analytics.orders.thisWeek}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-body-small text-foreground-muted">This Month</p>
            <p className="mt-2 text-heading-3 font-display text-brand-primary">
              {analytics.orders.thisMonth}
            </p>
            <p className="mt-2 text-body-small text-green-600">
              +{calculateGrowth(analytics.orders.thisMonth, analytics.orders.lastMonth)}% vs last month
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-body-small text-foreground-muted">Last Month</p>
            <p className="mt-2 text-heading-3 font-display text-brand-primary">
              {analytics.orders.lastMonth}
            </p>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="mb-8">
        <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
          Top Performing Products
        </h2>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {analytics.topProducts.map((product, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{product.sales} units</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{product.revenue.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
          Key Metrics
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-foreground-muted">Average Order Value</p>
                <p className="mt-2 text-heading-3 font-display text-brand-primary">
                  ₹{Math.round(analytics.revenue.thisMonth / analytics.orders.thisMonth).toLocaleString()}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-foreground-muted">Conversion Rate</p>
                <p className="mt-2 text-heading-3 font-display text-brand-primary">
                  3.2%
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-foreground-muted">Customer Retention</p>
                <p className="mt-2 text-heading-3 font-display text-brand-primary">
                  68%
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
