import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserProfile } from '@clerk/nextjs'

export default async function ProfilePage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-heading-1 text-brand-primary">My Profile</h1>
        <p className="mt-2 text-body-large text-foreground-muted">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* User Profile Component */}
        <div className="lg:col-span-2">
          <UserProfile
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-lg',
                navbar: 'bg-background-alt',
                navbarButton: 'text-brand-primary hover:bg-brand-earth',
                formButtonPrimary: 'bg-brand-primary hover:bg-brand-primary/90',
              },
            }}
          />
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="mb-4 text-heading-4 text-brand-primary">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-body-small text-foreground-muted">Member Since</p>
                <p className="text-body font-medium">
                  {new Date(user.createdAt).toLocaleDateString('en-IN', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-body-small text-foreground-muted">Email</p>
                <p className="text-body font-medium">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              <div>
                <p className="text-body-small text-foreground-muted">Account Status</p>
                <p className="text-body font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4 text-heading-4 text-brand-primary">NATI Circle</h3>
            <p className="text-body text-foreground-muted">
              Join our loyalty program to get early access to drops and exclusive benefits.
            </p>
            <button className="btn-primary mt-4 w-full">Join NATI Circle</button>
          </div>
        </div>
      </div>
    </div>
  )
}
