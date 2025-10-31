import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-alt">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-heading-2 text-brand-primary">Join NATI</h1>
          <p className="mt-2 text-body text-foreground-muted">
            Become part of the art revival movement
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-lg',
              formButtonPrimary: 'bg-brand-primary hover:bg-brand-primary/90',
              footerActionLink: 'text-brand-accent hover:text-brand-accent/90',
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/"
        />
      </div>
    </div>
  )
}
