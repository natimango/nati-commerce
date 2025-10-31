import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/products(.*)',
  '/drops(.*)',
  '/artists(.*)',
  '/art-forms(.*)',
  '/about',
  '/story',
  '/api/webhooks(.*)',
])

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/orders(.*)',
  '/wishlist(.*)',
  '/settings(.*)',
  '/dashboard(.*)',
])

export default clerkMiddleware((auth, request) => {
  // Protect routes that require authentication
  if (isProtectedRoute(request)) {
    auth().protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
