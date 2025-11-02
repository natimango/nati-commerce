import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

export async function checkAdminAccess() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Check if user is admin
  // In production, check user role from database or Clerk metadata
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
  const isAdmin = adminEmails.includes(user.emailAddresses[0]?.emailAddress || '')

  if (!isAdmin) {
    redirect('/')
  }

  return user
}
