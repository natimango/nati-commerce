import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-alt">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-heading-2 text-brand-primary">Welcome Back</h1>
          <p className="mt-2 text-body text-foreground-muted">
            Sign in to your NATI account
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-lg',
              formButtonPrimary: 'bg-brand-primary hover:bg-brand-primary/90',
              footerActionLink: 'text-brand-accent hover:text-brand-accent/90',
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
        />
      </div>
    </div>
  )
}
