/**
 * Programmatic SEO - "The Traffic Machine"
 *
 * Generates curated landing pages for high-intent long-tail keywords
 * Strategy: 200 quality pages, not 10,000 spam pages
 *
 * Examples:
 * - /shop/handloom-cotton-sarees-karnataka
 * - /shop/block-print-kurta-under-5000
 * - /shop/organic-silk-stoles-bridal
 *
 * Expected impact: Organic traffic from Google search
 */

import { askGeminiBrain } from '../ai/brain';

/**
 * SEO Route Definition
 * Each route is a curated combination of attributes that:
 * 1. Has search volume (people actually search for this)
 * 2. Represents products we have
 * 3. Is specific enough to have intent
 */
export interface SEORoute {
  slug: string[]; // URL segments
  title: string; // Page title for SEO
  h1: string; // Main heading
  metaDescription: string; // Meta description
  filters: ProductFilters; // Database query filters
}

export interface ProductFilters {
  artForm?: string | string[];
  fabric?: string | string[];
  priceMin?: number;
  priceMax?: number;
  occasion?: string | string[];
  color?: string | string[];
  region?: string | string[];
  category?: string;
  tags?: string[];
}

/**
 * Curated SEO Routes
 * These are manually curated for quality over quantity
 *
 * Expand this list to 200 routes based on:
 * - Google Search Console data (what people search)
 * - Keyword research tools
 * - Competitor analysis
 * - Your product catalog
 */
export const curatedSEORoutes: SEORoute[] = [
  // Art Form + Fabric + Category
  {
    slug: ['handloom', 'cotton', 'sarees'],
    title: 'Handloom Cotton Sarees | Pure Handwoven | NATI',
    h1: 'Authentic Handloom Cotton Sarees',
    metaDescription:
      'Shop pure handloom cotton sarees woven by master artisans. Each piece tells a story of tradition and craftsmanship. Free shipping across India.',
    filters: {
      artForm: 'handloom',
      fabric: 'cotton',
      category: 'saree',
    },
  },

  // Art Form + Price Range
  {
    slug: ['block-print', 'under-5000'],
    title: 'Block Print Clothing Under ₹5000 | Affordable Traditional | NATI',
    h1: 'Block Print Collection Under ₹5000',
    metaDescription:
      'Discover affordable block print kurtas, sarees, and stoles under ₹5000. Hand-carved wooden blocks, natural dyes, fair trade.',
    filters: {
      artForm: 'block-print',
      priceMax: 5000,
    },
  },

  // Fabric + Occasion + Category
  {
    slug: ['silk', 'bridal', 'sarees'],
    title: 'Bridal Silk Sarees | Wedding Collection | NATI',
    h1: 'Exquisite Bridal Silk Sarees',
    metaDescription:
      'Find your dream bridal silk saree. Handpicked collection featuring Kanchipuram, Banarasi, and regional weaves. Limited edition pieces.',
    filters: {
      fabric: 'silk',
      occasion: 'bridal',
      category: 'saree',
    },
  },

  // Region + Art Form + Category
  {
    slug: ['karnataka', 'kalamkari', 'stoles'],
    title: 'Karnataka Kalamkari Stoles | Hand-painted | NATI',
    h1: 'Karnataka Kalamkari Stoles',
    metaDescription:
      'Authentic Kalamkari stoles from Karnataka artisans. Each piece hand-painted with natural dyes. Support traditional craft.',
    filters: {
      artForm: 'kalamkari',
      region: 'karnataka',
      category: 'stole',
    },
  },

  // Sustainable + Fabric + Price
  {
    slug: ['organic', 'cotton', 'under-3000'],
    title: 'Organic Cotton Clothing Under ₹3000 | Sustainable Fashion | NATI',
    h1: 'Affordable Organic Cotton Collection',
    metaDescription:
      'Eco-friendly organic cotton kurtas, shirts, and dresses under ₹3000. GOTS certified, zero chemicals, ethically made.',
    filters: {
      fabric: 'organic-cotton',
      priceMax: 3000,
      tags: ['sustainable', 'organic'],
    },
  },

  // Art Form + Color + Category
  {
    slug: ['indigo', 'dyed', 'kurtas'],
    title: 'Indigo Dyed Kurtas | Natural Dye | NATI',
    h1: 'Hand-dyed Indigo Kurtas',
    metaDescription:
      'Traditional indigo dyed kurtas using natural fermentation. Deep blue hues that tell stories. Each piece unique.',
    filters: {
      tags: ['indigo', 'natural-dye'],
      category: 'kurta',
      color: 'blue',
    },
  },

  // TODO: Expand to 200 routes
  // Add more based on:
  // - Your bestsellers
  // - Search data from analytics
  // - Seasonal trends
  // - Regional demand
];

/**
 * Generate static params for Next.js
 * Use this in your [...slug]/page.tsx
 *
 * @example
 * export function generateStaticParams() {
 *   return generateSEOStaticParams();
 * }
 */
export function generateSEOStaticParams() {
  return curatedSEORoutes.map((route) => ({
    slug: route.slug,
  }));
}

/**
 * Get SEO route by slug
 *
 * @example
 * const route = getSEORoute(['handloom', 'cotton', 'sarees']);
 */
export function getSEORoute(slug: string[]): SEORoute | null {
  const slugString = slug.join('/');
  return curatedSEORoutes.find((r) => r.slug.join('/') === slugString) || null;
}

/**
 * Generate SEO content using AI
 * Cached in database to avoid regenerating
 *
 * @example
 * const content = await generateSEOContent(route);
 */
export async function generateSEOContent(route: SEORoute): Promise<{
  introduction: string;
  aboutArtForm?: string;
  buyingGuide?: string;
  faq?: Array<{ question: string; answer: string }>;
}> {
  // Check cache first (TODO: implement with your database)
  // const cached = await db.seoContent.findUnique({ where: { slug: route.slug.join('/') } });
  // if (cached) return cached;

  console.log(`[SEO] Generating content for: ${route.slug.join('/')}`);

  // Generate introduction
  const introduction = await askGeminiBrain(
    `Write a compelling 2-paragraph introduction for an e-commerce collection page featuring:

    Title: ${route.h1}
    Filters: ${JSON.stringify(route.filters)}

    Style:
    - Warm and cultural tone
    - Focus on craftsmanship and tradition
    - Include sensory details (texture, color, process)
    - Mention artisan communities and heritage
    - Natural keyword usage (no keyword stuffing)
    - 150-200 words

    DO NOT use generic marketing speak. Be authentic and specific.`,
    undefined,
    { temperature: 0.8 }
  );

  // Generate art form content (if relevant)
  let aboutArtForm: string | undefined;
  if (route.filters.artForm) {
    aboutArtForm = await askGeminiBrain(
      `Write a brief educational section about ${route.filters.artForm} art form:

      - Historical origin and evolution
      - Traditional techniques and process
      - Cultural significance
      - Modern adaptations

      Keep it 100-150 words, informative but accessible.`,
      undefined,
      { temperature: 0.7 }
    );
  }

  // Generate buying guide
  const buyingGuide = await askGeminiBrain(
    `Write a helpful buying guide for customers interested in ${route.h1}:

    Include tips on:
    - What makes a quality piece
    - How to identify authentic craftsmanship
    - Care and maintenance
    - Styling suggestions

    Format: 4-5 bullet points, concise and actionable.`,
    undefined,
    { temperature: 0.7 }
  );

  // Generate FAQ (3 questions)
  const faqPrompt = await askGeminiBrain(
    `Generate 3 frequently asked questions about ${route.h1} with concise answers (2-3 sentences each).

    Format as JSON array:
    [
      { "question": "...", "answer": "..." },
      { "question": "...", "answer": "..." },
      { "question": "...", "answer": "..." }
    ]

    Focus on practical questions customers actually have about quality, authenticity, care, and purchase.`,
    undefined,
    { temperature: 0.7, maxTokens: 500 }
  );

  let faq: Array<{ question: string; answer: string }> = [];
  try {
    faq = JSON.parse(faqPrompt);
  } catch {
    // If parsing fails, use default FAQs
    faq = [
      {
        question: 'How do I verify the authenticity?',
        answer:
          'Each piece comes with a certificate of authenticity detailing the artisan, technique, and origin. We work directly with master craftspeople.',
      },
      {
        question: 'What is the care process?',
        answer:
          'Hand wash with mild detergent in cold water. Dry in shade. Iron on medium heat. Detailed care instructions are included with your order.',
      },
      {
        question: 'How long does delivery take?',
        answer:
          'We ship within 2-3 business days. Delivery typically takes 5-7 days across India. Free shipping on all orders.',
      },
    ];
  }

  const content = {
    introduction,
    aboutArtForm,
    buyingGuide,
    faq,
  };

  // Cache the content (TODO: implement with your database)
  // await db.seoContent.create({
  //   data: {
  //     slug: route.slug.join('/'),
  //     content: JSON.stringify(content),
  //   },
  // });

  return content;
}

/**
 * Helper: Convert slug to breadcrumbs
 *
 * @example
 * const breadcrumbs = slugToBreadcrumbs(['handloom', 'cotton', 'sarees']);
 * // [{ label: 'Shop', href: '/shop' }, { label: 'Handloom', href: '/shop/handloom' }, ...]
 */
export function slugToBreadcrumbs(slug: string[]): Array<{ label: string; href: string }> {
  const breadcrumbs = [{ label: 'Shop', href: '/shop' }];

  let currentPath = '/shop';
  slug.forEach((segment) => {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: currentPath,
    });
  });

  return breadcrumbs;
}

/**
 * Helper: Generate structured data (JSON-LD) for SEO
 *
 * @example
 * const jsonLd = generateCollectionStructuredData(route, products);
 */
export function generateCollectionStructuredData(
  route: SEORoute,
  products: Array<{ name: string; price: number; image: string; url: string }>,
  totalProducts: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: route.title,
    description: route.metaDescription,
    numberOfItems: totalProducts,
    itemListElement: products.slice(0, 10).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        image: product.image,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
        url: `https://nati.in${product.url}`,
      },
    })),
  };
}

/**
 * Helper: Suggest related SEO pages
 *
 * @example
 * const related = getRelatedSEORoutes(currentRoute, 3);
 */
export function getRelatedSEORoutes(currentRoute: SEORoute, limit = 3): SEORoute[] {
  // Simple logic: find routes with overlapping filters
  return curatedSEORoutes
    .filter((route) => {
      if (route.slug.join('/') === currentRoute.slug.join('/')) return false;

      // Check for overlapping filters
      const hasOverlap =
        route.filters.artForm === currentRoute.filters.artForm ||
        route.filters.fabric === currentRoute.filters.fabric ||
        route.filters.category === currentRoute.filters.category;

      return hasOverlap;
    })
    .slice(0, limit);
}
