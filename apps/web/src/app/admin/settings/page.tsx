'use client'

import { useState } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'NATI Commerce',
    storeEmail: 'hello@naticommerce.com',
    currency: 'INR',
    taxRate: '18',
    shippingFee: '100',
    freeShippingThreshold: '2000',
    enableFeaturedProducts: true,
    enableDrops: true,
    enableNewsletter: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In production, save to API
    alert('Settings saved successfully!')
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-heading-2 font-display text-brand-primary">
          Settings
        </h1>
        <p className="text-body text-foreground-muted">
          Manage your store settings and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Store Information */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
            Store Information
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="storeName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Store Name
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
            <div>
              <label
                htmlFor="storeEmail"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Store Email
              </label>
              <input
                type="email"
                id="storeEmail"
                name="storeEmail"
                value={settings.storeEmail}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Shipping */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
            Pricing & Shipping
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="currency"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="taxRate"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Tax Rate (%)
              </label>
              <input
                type="number"
                id="taxRate"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
            <div>
              <label
                htmlFor="shippingFee"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Shipping Fee (₹)
              </label>
              <input
                type="number"
                id="shippingFee"
                name="shippingFee"
                value={settings.shippingFee}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
            <div>
              <label
                htmlFor="freeShippingThreshold"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                id="freeShippingThreshold"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-heading-4 font-display text-brand-primary">
            Features
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Featured Products</p>
                <p className="text-sm text-gray-500">
                  Show featured products section on homepage
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="enableFeaturedProducts"
                  checked={settings.enableFeaturedProducts}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-accent peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-accent/50"></div>
              </label>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div>
                <p className="font-medium text-gray-900">Drops Collections</p>
                <p className="text-sm text-gray-500">
                  Enable limited-time product drops
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="enableDrops"
                  checked={settings.enableDrops}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-accent peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-accent/50"></div>
              </label>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div>
                <p className="font-medium text-gray-900">Newsletter</p>
                <p className="text-sm text-gray-500">
                  Enable newsletter signup form
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="enableNewsletter"
                  checked={settings.enableNewsletter}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-accent peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-accent/50"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary px-8 py-3">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
