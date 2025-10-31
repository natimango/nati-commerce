export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Logo Animation */}
      <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-earth to-white">
        <div className="text-center">
          {/* Logo Animation Container */}
          <div className="mb-8 animate-fade-in">
            <h1 className="font-display text-display text-brand-primary">NATI</h1>
          </div>

          {/* Tagline that expands */}
          <div className="animate-slide-up animation-delay-300">
            <p className="text-heading-3 text-brand-secondary">
              Native Art and Textile India
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 animate-slide-up animation-delay-600">
            <button className="btn-primary px-8 py-3 text-lg">Explore Our Story</button>
          </div>
        </div>
      </section>

      {/* Navigation will appear on scroll - to be implemented */}

      {/* Product Sections - Coming soon */}
      <section className="container-custom py-24">
        <div className="grid gap-12">
          {/* NATI-Basics Section */}
          <div className="rounded-lg bg-background-alt p-12">
            <h2 className="mb-4 text-heading-2 text-brand-primary">NATI Basics</h2>
            <p className="text-body-large text-foreground-muted">
              Essential pieces crafted from natural fabrics
            </p>
          </div>

          {/* NATI-Artwear Section */}
          <div className="rounded-lg bg-background-alt p-12">
            <h2 className="mb-4 text-heading-2 text-brand-primary">NATI Artwear</h2>
            <p className="text-body-large text-foreground-muted">
              Folk art revival meets classical textile techniques
            </p>
          </div>

          {/* NATI-Collectibles Section */}
          <div className="rounded-lg bg-background-alt p-12">
            <h2 className="mb-4 text-heading-2 text-brand-primary">NATI Collectibles</h2>
            <p className="text-body-large text-foreground-muted">
              Limited collaborations celebrating craft and culture
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
