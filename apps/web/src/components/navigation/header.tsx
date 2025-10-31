'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { UserButton } from '@/components/auth/user-button'

export function Header() {
  const { isSignedIn } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <nav className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-bold text-brand-primary">
          NATI
        </Link>

        {/* Main Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          <Link
            href="/shop"
            className="text-body font-medium text-foreground transition-colors hover:text-brand-primary"
          >
            Shop
          </Link>
          <Link
            href="/story"
            className="text-body font-medium text-foreground transition-colors hover:text-brand-primary"
          >
            Story
          </Link>
          <Link
            href="/be-a-part"
            className="text-body font-medium text-foreground transition-colors hover:text-brand-primary"
          >
            Be a Part
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Link
                href="/profile"
                className="hidden text-body-small font-medium text-foreground transition-colors hover:text-brand-primary md:block"
              >
                Profile
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-body-small font-medium text-foreground transition-colors hover:text-brand-primary"
              >
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary px-4 py-2">
                Join
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
