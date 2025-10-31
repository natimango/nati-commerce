'use client'

import { UserButton as ClerkUserButton } from '@clerk/nextjs'

export function UserButton() {
  return (
    <ClerkUserButton
      appearance={{
        elements: {
          avatarBox: 'w-10 h-10',
          userButtonPopoverCard: 'shadow-lg',
          userButtonPopoverActionButton: 'hover:bg-brand-earth',
          userButtonPopoverActionButtonText: 'text-brand-primary',
        },
      }}
      afterSignOutUrl="/"
    />
  )
}
