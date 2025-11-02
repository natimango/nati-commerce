import Link from 'next/link'
import { getArtists } from '@/lib/api'

export default async function AdminArtistsPage() {
  const artists = await getArtists()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading-2 font-display text-brand-primary">
            Artists
          </h1>
          <p className="text-body text-foreground-muted">
            Manage artisan profiles and their work
          </p>
        </div>
        <Link href="/admin/artists/new" className="btn-primary px-6 py-3">
          + Add Artist
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search artists..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent md:w-96"
        />
      </div>

      {/* Artists Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {artists.length === 0 ? (
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
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500">No artists found</p>
              <p className="mt-1 text-sm text-gray-400">
                Add your first artist profile to get started
              </p>
            </div>
          </div>
        ) : (
          artists.map((artist) => (
            <div
              key={artist.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              {artist.profile_image && (
                <img
                  src={artist.profile_image}
                  alt={artist.name}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="mb-2 text-heading-4 font-display text-brand-primary">
                  {artist.name}
                </h3>
                <p className="mb-1 text-body-small text-gray-600">
                  {artist.village}, {artist.district}
                </p>
                {artist.specialization && (
                  <p className="mb-2 text-body-small text-gray-600">
                    Specialization: {artist.specialization}
                  </p>
                )}
                <p className="mb-4 line-clamp-3 text-body-small text-gray-500">
                  {artist.bio}
                </p>
                {artist.years_of_experience && (
                  <p className="mb-4 text-body-small font-medium text-brand-accent">
                    {artist.years_of_experience} years of experience
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/artists/${artist.id}/edit`}
                      className="text-sm text-brand-accent hover:text-brand-accent/80"
                    >
                      Edit
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      href={`/artists/${artist.slug}`}
                      target="_blank"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {artists.length > 0 && (
        <div className="mt-6">
          <p className="text-body-small text-foreground-muted">
            Showing {artists.length} artist{artists.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
