import Link from 'next/link'
import { getArtForms } from '@/lib/api'

export default async function AdminArtFormsPage() {
  const artForms = await getArtForms()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading-2 font-display text-brand-primary">
            Art Forms
          </h1>
          <p className="text-body text-foreground-muted">
            Manage traditional Indian art forms
          </p>
        </div>
        <Link
          href="/admin/art-forms/new"
          className="btn-primary px-6 py-3"
        >
          + Add Art Form
        </Link>
      </div>

      {/* Art Forms Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {artForms.length === 0 ? (
          <div className="col-span-full rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <svg
                className="mb-4 h-12 w-12 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <p className="text-gray-500">No art forms found</p>
              <p className="mt-1 text-sm text-gray-400">
                Create your first art form to get started
              </p>
            </div>
          </div>
        ) : (
          artForms.map((artForm) => (
            <div
              key={artForm.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              {artForm.banner_image && (
                <img
                  src={artForm.banner_image}
                  alt={artForm.name}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-heading-4 font-display text-brand-primary">
                    {artForm.name}
                  </h3>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      artForm.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {artForm.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="mb-1 text-body-small text-gray-600">
                  Region: {artForm.region}
                </p>
                <p className="mb-4 line-clamp-3 text-body-small text-gray-500">
                  {artForm.history}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/art-forms/${artForm.id}/edit`}
                      className="text-sm text-brand-accent hover:text-brand-accent/80"
                    >
                      Edit
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      href={`/art-forms/${artForm.slug}`}
                      target="_blank"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {artForms.length > 0 && (
        <div className="mt-6">
          <p className="text-body-small text-foreground-muted">
            Showing {artForms.length} art form{artForms.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
