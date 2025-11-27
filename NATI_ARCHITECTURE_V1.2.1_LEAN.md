# NATI Architecture v1.2.1: "Lean & Mean" - Sales-First Edition
## Build a Money-Printing Brand, Not a Tech Portfolio

**Version:** 1.2.1 (Lean & Mean)
**Philosophy:** Sales Tech over Engineering Ego, Monolith over Microservices, Revenue over Resume
**Last Updated:** 2025-11-27
**Target Launch:** Drop 1 - January 2026 (12 weeks)

---

## Executive Summary

**The Pivot:** We're moving from "Building a Tech Company" to "Building a Money-Printing Brand using Tech."

NATI v1.2.1 is the **ruthlessly optimized** version of v1.2 - we've killed the engineering ego and doubled down on growth tech.

### What Changed from v1.2 → v1.2.1:

| Component | v1.2 (Over-Engineered) | v1.2.1 (Lean & Mean) | Impact |
|-----------|------------------------|----------------------|--------|
| **AI Gateway** | Python FastAPI on Cloud Run | Vercel AI SDK in Next.js | -₹6k/mo, -500ms latency |
| **Event Queue** | Google Pub/Sub | BullMQ (Redis) | -₹2k/mo, simpler dev |
| **CMS** | Sanity (webhook sync) | MDX in repo | -₹6k/mo, no sync bugs |
| **Marketing** | Generic analytics | Dynamic OG + SEO | +30% CTR, organic traffic |
| **Services** | 8-10 services | 4-5 services | 90% less DevOps |

**New Monthly Burn:** ₹35,000 - ₹60,000 (was ₹53k - ₹110k)
**New Dev Speed:** 1 language (TypeScript), 1 repo, 1 deploy

---

## 1. The Lean Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 NATI v1.2.1: LEAN & MEAN ARCHITECTURE                       │
│                     "The Monolith That Prints Money"                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                        EDGE LAYER (FREE MARKETING)                  │    │
│  │  ┌──────────────────────────────────────────────────────────────┐  │    │
│  │  │  Cloudflare (CDN + Cache)                                     │  │    │
│  │  │  • Static assets cached globally                              │  │    │
│  │  │  • Image optimization                                         │  │    │
│  │  │  • DDoS protection (free tier)                                │  │    │
│  │  └──────────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                   ↓                                          │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                   THE MONOLITH (Next.js 15 on Vercel)               │    │
│  │                                                                      │    │
│  │  ┌────────────────────────────────────────────────────────────┐    │    │
│  │  │  Frontend (App Router + RSC)                                │    │    │
│  │  │  • Product pages with stories (MDX)                         │    │    │
│  │  │  • Dynamic OG images (@vercel/og)                           │    │    │
│  │  │  • Programmatic SEO (200 landing pages)                     │    │    │
│  │  │  • Server-first, stream HTML                                │    │    │
│  │  └────────────────────────────────────────────────────────────┘    │    │
│  │                                                                      │    │
│  │  ┌────────────────────────────────────────────────────────────┐    │    │
│  │  │  Backend (Server Actions + API Routes)                      │    │    │
│  │  │                                                              │    │    │
│  │  │  ┌──────────────────┐  ┌──────────────────┐                │    │    │
│  │  │  │  Medusa.js 2.0   │  │  AI Brain        │                │    │    │
│  │  │  │  (Commerce)      │  │  (Vercel AI SDK) │                │    │    │
│  │  │  │                  │  │                  │                │    │    │
│  │  │  │  • Products      │  │  • Gemini Flash  │                │    │    │
│  │  │  │  • Orders        │  │  • OpenAI backup │                │    │    │
│  │  │  │  • Cart/Checkout │  │  • Embeddings    │                │    │    │
│  │  │  │  • Auth          │  │  • Streaming     │                │    │    │
│  │  │  └──────────────────┘  └──────────────────┘                │    │    │
│  │  │                                                              │    │    │
│  │  │  ┌────────────────────────────────────────────────────┐    │    │    │
│  │  │  │  BullMQ Workers (The Invisible Salesmen)           │    │    │    │
│  │  │  │  • transactional: Email/SMS recovery               │    │    │    │
│  │  │  │  • analytics: BigQuery batch inserts               │    │    │    │
│  │  │  │  • ai-jobs: Heat scores, embeddings                │    │    │    │
│  │  │  └────────────────────────────────────────────────────┘    │    │    │
│  │  └────────────────────────────────────────────────────────────┘    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                   ↓                                          │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    DATA LAYER (SINGLE SOURCE OF TRUTH)              │    │
│  │                                                                      │    │
│  │  ┌──────────────────────────────────────────────────────────────┐  │    │
│  │  │  PostgreSQL 16 + pgvector (Google Cloud SQL)                 │  │    │
│  │  │                                                                │  │    │
│  │  │  Schemas:                                                     │  │    │
│  │  │  ├─ core_*       (products, orders, users)                   │  │    │
│  │  │  ├─ cultural_*   (art_forms, artists, stories)               │  │    │
│  │  │  ├─ drops_*      (collections, waitlists)                    │  │    │
│  │  │  ├─ ai_*         (embeddings, heat_scores)                   │  │    │
│  │  │  └─ events_*     (user_events for intent tracking)           │  │    │
│  │  │                                                                │  │    │
│  │  │  Performance:                                                 │  │    │
│  │  │  ├─ pgvector HNSW (semantic search)                          │  │    │
│  │  │  ├─ Materialized views (hot products)                        │  │    │
│  │  │  ├─ Connection pooling (PgBouncer)                           │  │    │
│  │  │  └─ Read replica (for analytics queries)                     │  │    │
│  │  └──────────────────────────────────────────────────────────────┘  │    │
│  │                                                                      │    │
│  │  ┌──────────────────────────────────────────────────────────────┐  │    │
│  │  │  Redis 7 (Google Memorystore)                                │  │    │
│  │  │  • Session storage                                            │  │    │
│  │  │  • Cart cache                                                 │  │    │
│  │  │  • BullMQ job queues ← NEW                                   │  │    │
│  │  │  • Rate limiting                                              │  │    │
│  │  │  • AI response cache (1 hour TTL)                            │  │    │
│  │  └──────────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                   ↓                                          │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    ANALYTICS LAYER (FUTURE INSIGHTS)                │    │
│  │                                                                      │    │
│  │  ┌──────────────────────────────────────────────────────────────┐  │    │
│  │  │  Google BigQuery (Cold Storage)                              │  │    │
│  │  │  • Daily batch from BullMQ worker                            │  │    │
│  │  │  • Events, orders, revenue                                   │  │    │
│  │  │  • Future ML training data                                   │  │    │
│  │  └──────────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    INTEGRATIONS (PAY WHEN YOU MAKE MONEY)           │    │
│  │                                                                      │    │
│  │  Payments:  Razorpay (2% fee only on sales)                         │    │
│  │  Email:     Resend (₹500/mo for 10k emails)                         │    │
│  │  SMS:       Gupshup (pay per send)                                  │    │
│  │  Shipping:  Shiprocket (pay per order)                              │    │
│  │  Analytics: GA4 (free), Plausible (₹800/mo)                         │    │
│  │  Monitoring: Sentry (free tier), Vercel Analytics                   │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Technology Stack (Lean)

### 2.1 The Monolith
```yaml
Runtime:         Next.js 15 (App Router + React Server Components)
Language:        TypeScript (ONLY TypeScript)
Hosting:         Vercel (Free tier → Pro ₹1,600/mo)
UI:              React 19 + Tailwind CSS + shadcn/ui
State:           Zustand (client) + Server Components (server)
Forms:           React Hook Form + Zod
API:             Server Actions (primary) + tRPC (if needed)
Real-time:       Server-Sent Events (drops countdown)
```

### 2.2 Data & Commerce
```yaml
E-commerce:      Medusa.js 2.0 (embedded in Next.js)
Database:        PostgreSQL 16 + pgvector 0.7+
                 Google Cloud SQL (₹8k-15k/mo)
Cache/Queue:     Redis 7 (Google Memorystore ₹3k-5k/mo)
Queue:           BullMQ (Redis-based, NO Pub/Sub)
Storage:         Cloudflare R2 (₹0-1k/mo vs GCS)
Payments:        Razorpay (2% per transaction)
Shipping:        Shiprocket (pay per shipment)
```

### 2.3 AI Layer (Simplified)
```yaml
Primary LLM:     Google Gemini 2.0 Flash
                 (via Vercel AI SDK, NOT separate service)
Embeddings:      Gemini text-embedding-004
Vector Storage:  pgvector (in PostgreSQL)
Vision:          Gemini Vision (product analysis)
Fallback:        OpenAI GPT-4o-mini (via Vercel AI SDK)
Framework:       Vercel AI SDK (streaming, caching, retry)
```

### 2.4 Content & Analytics
```yaml
CMS:             MDX files in repo (stories/*.mdx)
                 - Version controlled
                 - No API calls
                 - Instant builds
Data Warehouse:  Google BigQuery (₹1k-3k/mo)
ETL:             BullMQ worker (nightly batch)
BI:              SQL queries → Metabase (self-hosted)
Monitoring:      Sentry (free tier) + Vercel Analytics
Logging:         Vercel Logs + Datadog (if needed)
CI/CD:           GitHub Actions (free)
IaC:             Terraform (GCP resources only)
```

---

## 3. The "Sales Tech" Modules

### 3.1 Dynamic OG Image Generator (The Free Billboard)

**Impact:** 30% higher CTR on social shares (Instagram, WhatsApp, Twitter)

**Implementation:**
```typescript
// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const price = searchParams.get('price');
  const image = searchParams.get('img');
  const stock = searchParams.get('stock'); // "Only 3 left", "Drops in 2 hours"

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#F5F5F0',
        }}
      >
        {/* Left: Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 60,
            justifyContent: 'center',
            width: '60%',
          }}
        >
          <div style={{ fontSize: 60, fontFamily: 'Serif', color: '#1a1a1a' }}>
            NATI
          </div>
          <div style={{ fontSize: 40, fontWeight: 900, marginTop: 20 }}>
            {title}
          </div>
          <div style={{ fontSize: 30, color: '#4a4a4a', marginTop: 10 }}>
            ₹{price}
          </div>
          {stock && (
            <div
              style={{
                background: '#e53e3e',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 20,
                marginTop: 30,
                width: 'fit-content',
                fontSize: 24,
                fontWeight: 'bold',
              }}
            >
              {stock}
            </div>
          )}
        </div>

        {/* Right: Product Image */}
        <div
          style={{
            width: '40%',
            height: '100%',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );
}
```

**Usage in Product Page:**
```typescript
// app/products/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);

  return {
    title: product.name,
    openGraph: {
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(product.name)}&price=${product.price}&img=${product.image}&stock=${getStockMessage(product.stock)}`,
          width: 1200,
          height: 600,
        },
      ],
    },
  };
}
```

---

### 3.2 Programmatic SEO (The Traffic Machine)

**Impact:** Capture long-tail search traffic for high-intent keywords

**Strategy:** Generate 200 curated landing pages (NOT 10,000 spam pages)

**Examples:**
- `/shop/handloom-cotton-sarees-karnataka`
- `/shop/block-print-kurta-under-5000`
- `/shop/organic-silk-stoles-bridal`

**Implementation:**
```typescript
// app/shop/[...slug]/page.tsx
import { getProductsByAttributes } from '@/lib/medusa';

// Generate static paths at build time
export async function generateStaticParams() {
  // Define high-intent combinations (curated, not exhaustive)
  const seoRoutes = [
    { slug: ['handloom', 'cotton', 'sarees'] },
    { slug: ['block-print', 'kurta', 'under-5000'] },
    { slug: ['organic', 'silk', 'stoles', 'bridal'] },
    // ... 197 more curated combinations
  ];

  return seoRoutes;
}

export default async function ShopPage({ params }) {
  const { slug } = params;

  // Parse attributes from slug
  const attributes = parseSlugToAttributes(slug);

  // Query products matching attributes
  const products = await getProductsByAttributes(attributes);

  // AI-generate SEO content (cache in database)
  const seoContent = await generateSEOContent(attributes);

  return (
    <div>
      <h1>{seoContent.title}</h1>
      <p>{seoContent.description}</p>

      <ProductGrid products={products} />
    </div>
  );
}

// Helper: Convert slug to database query
function parseSlugToAttributes(slug: string[]) {
  return {
    artForm: slug.find(s => ['handloom', 'block-print'].includes(s)),
    fabric: slug.find(s => ['cotton', 'silk', 'linen'].includes(s)),
    priceRange: slug.find(s => s.startsWith('under-'))
      ? parseInt(slug.find(s => s.startsWith('under-')).split('-')[1])
      : null,
    // etc.
  };
}
```

**SEO Content Generation (Cached):**
```typescript
// lib/seo/generate-content.ts
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from '@/lib/db';

export async function generateSEOContent(attributes) {
  // Check cache
  const cached = await db.seoContent.findUnique({
    where: { attributes: JSON.stringify(attributes) },
  });

  if (cached) return cached;

  // Generate with AI
  const { text } = await generateText({
    model: google('gemini-2.0-flash-exp'),
    prompt: `Write compelling SEO content for a collection page featuring:
    - Art form: ${attributes.artForm}
    - Fabric: ${attributes.fabric}
    - Price range: Under ₹${attributes.priceRange}

    Style: Warm, cultural, focused on craftsmanship. 2-3 sentences.`,
  });

  // Cache it
  const content = { title: generateTitle(attributes), description: text };
  await db.seoContent.create({
    data: { attributes: JSON.stringify(attributes), content },
  });

  return content;
}
```

---

### 3.3 Heat Score Algorithm (The Invisible Merchandiser)

**Impact:** Auto-promote products that are "hot" right now, maximize conversions

**Logic:**
```sql
-- Run nightly via BullMQ worker
UPDATE core.products p
SET heat_score = subquery.score,
    heat_rank = RANK() OVER (ORDER BY subquery.score DESC)
FROM (
    SELECT
        product_id,
        (
            -- Views (1 point each)
            (COUNT(*) FILTER (WHERE event_type = 'product_viewed') * 1) +

            -- Add to cart (5 points)
            (COUNT(*) FILTER (WHERE event_type = 'add_to_cart') * 5) +

            -- Purchases (10 points)
            (COUNT(*) FILTER (WHERE event_type = 'purchase') * 10) +

            -- Shares (3 points)
            (COUNT(*) FILTER (WHERE event_type = 'product_shared') * 3)

        ) *
        -- Decay: Recent events worth more (exponential decay)
        EXP(-EXTRACT(EPOCH FROM (NOW() - timestamp)) / 86400.0) -- Decay over 24h

        as score
    FROM events.user_events
    WHERE timestamp > NOW() - INTERVAL '7 days'  -- Only look at last 7 days
    GROUP BY product_id
) AS subquery
WHERE p.id = subquery.product_id;

-- Reset scores for products with no recent activity
UPDATE core.products
SET heat_score = 0
WHERE id NOT IN (
    SELECT DISTINCT product_id
    FROM events.user_events
    WHERE timestamp > NOW() - INTERVAL '7 days'
);
```

**Usage in Frontend:**
```typescript
// Default sort: Heat score (hot products first)
const products = await db.product.findMany({
  where: { status: 'active', stock: { gt: 0 } },
  orderBy: { heat_score: 'desc' },
  take: 20,
});
```

---

### 3.4 Abandoned Cart Recovery (The Invisible Salesman)

**Implementation:**
```typescript
// lib/queue/workers/cart-recovery.ts
import { Worker } from 'bullmq';
import { connection } from '@/lib/redis';
import { getCart } from '@/lib/medusa';
import { sendEmail } from '@/lib/email';

export const cartRecoveryWorker = new Worker(
  'cart-recovery',
  async (job) => {
    const { cartId, email, userId } = job.data;

    console.log(`[Cart Recovery] Processing cart ${cartId}`);

    // 1. Check if they completed purchase
    const cart = await getCart(cartId);
    if (cart.completed_at) {
      console.log(`[Cart Recovery] Cart ${cartId} already completed, skipping`);
      return { status: 'already_completed' };
    }

    // 2. Check if cart still has items
    if (!cart.items || cart.items.length === 0) {
      console.log(`[Cart Recovery] Cart ${cartId} is empty, skipping`);
      return { status: 'empty_cart' };
    }

    // 3. Send recovery email
    await sendEmail({
      to: email,
      subject: "Your cart is waiting (and so are we)",
      template: 'abandoned-cart',
      data: {
        items: cart.items,
        total: cart.total,
        cartUrl: `https://nati.in/cart/${cartId}`,
        // Optional: Add a small discount code for urgency
        discountCode: 'COMEBACK10',
      },
    });

    // 4. Log the event
    await logEvent(userId, 'cart_recovery_sent', {
      cartId,
      itemCount: cart.items.length,
      value: cart.total,
    });

    return { status: 'sent', email };
  },
  { connection }
);

// Schedule recovery job when cart is updated
export async function scheduleCartRecovery(cartId: string, email: string, userId: string) {
  await cartRecoveryQueue.add(
    'recover',
    { cartId, email, userId },
    {
      delay: 60 * 60 * 1000, // 1 hour delay
      jobId: `cart-recovery-${cartId}`, // Prevent duplicates
    }
  );
}
```

**Trigger from Cart Update:**
```typescript
// app/actions/cart.ts
'use server';

import { scheduleCartRecovery } from '@/lib/queue/workers/cart-recovery';

export async function addToCart(productId: string) {
  const cart = await updateCart(productId);
  const user = await getCurrentUser();

  // Schedule recovery (will be canceled if they checkout)
  if (user) {
    await scheduleCartRecovery(cart.id, user.email, user.id);
  }

  return cart;
}
```

---

### 3.5 AI Brain (Vercel AI SDK Integration)

**NO Python Microservice. Just TypeScript.**

```typescript
// lib/ai/brain.ts
import { generateText, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { redis } from '@/lib/redis';
import crypto from 'crypto';

// Provider configuration
const providers = {
  gemini: google('gemini-2.0-flash-exp'),
  openai: openai('gpt-4o-mini'),
};

// Main AI function with caching and fallback
export async function askGeminiBrain(
  prompt: string,
  userId?: string,
  options = { temperature: 0.7, maxTokens: 1000 }
) {
  // 1. Generate cache key
  const cacheKey = `ai:${crypto
    .createHash('md5')
    .update(prompt)
    .digest('hex')}`;

  // 2. Check cache (1 hour TTL)
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`[AI] Cache hit for prompt: ${prompt.slice(0, 50)}...`);
    return JSON.parse(cached);
  }

  try {
    // 3. Primary: Gemini
    console.log(`[AI] Calling Gemini for prompt: ${prompt.slice(0, 50)}...`);

    const { text, usage } = await generateText({
      model: providers.gemini,
      prompt,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
    });

    // 4. Cache result
    await redis.set(cacheKey, JSON.stringify(text), 'EX', 3600);

    // 5. Async cost tracking (fire-and-forget)
    logAIUsage('gemini', usage, userId).catch(console.error);

    return text;

  } catch (error) {
    console.warn(`[AI] Gemini failed, falling back to OpenAI:`, error);

    // 6. Fallback: OpenAI
    try {
      const { text, usage } = await generateText({
        model: providers.openai,
        prompt,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      });

      await redis.set(cacheKey, JSON.stringify(text), 'EX', 3600);
      logAIUsage('openai', usage, userId).catch(console.error);

      return text;

    } catch (fallbackError) {
      console.error(`[AI] All providers failed:`, fallbackError);
      throw new Error('AI service temporarily unavailable');
    }
  }
}

// Streaming version (for chatbot)
export async function streamGeminiBrain(prompt: string) {
  const result = await streamText({
    model: providers.gemini,
    prompt,
  });

  return result.toAIStreamResponse();
}

// Embeddings for semantic search
export async function generateEmbedding(text: string) {
  const cacheKey = `embedding:${crypto
    .createHash('md5')
    .update(text)
    .digest('hex')}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Use Gemini embedding model
  const { embedding } = await embed({
    model: google.embedding('text-embedding-004'),
    value: text,
  });

  await redis.set(cacheKey, JSON.stringify(embedding), 'EX', 86400); // 24h

  return embedding;
}

// Cost tracking (stores in Postgres for BigQuery sync)
async function logAIUsage(provider: string, usage: any, userId?: string) {
  await db.aiUsageLog.create({
    data: {
      provider,
      userId,
      inputTokens: usage.promptTokens || 0,
      outputTokens: usage.completionTokens || 0,
      totalTokens: usage.totalTokens || 0,
      costInr: calculateCost(provider, usage.totalTokens || 0),
      timestamp: new Date(),
    },
  });
}

function calculateCost(provider: string, tokens: number): number {
  const rates = {
    gemini: 0.00015, // ₹0.15 per 1M tokens
    openai: 0.005,   // ₹5 per 1M tokens
  };

  return (tokens / 1000000) * rates[provider];
}
```

**Usage in Server Actions:**
```typescript
// app/actions/ai.ts
'use server';

import { askGeminiBrain } from '@/lib/ai/brain';

export async function getProductRecommendations(userId: string) {
  const userProfile = await getUserProfile(userId);

  const prompt = `Given this user profile:
  - Recent views: ${userProfile.recentViews.join(', ')}
  - Art preferences: ${userProfile.artPreferences.join(', ')}
  - Price range: ₹${userProfile.avgSpend}

  Recommend 5 products from our catalog that would delight them.`;

  const recommendations = await askGeminiBrain(prompt, userId);

  return recommendations;
}
```

---

## 4. The 12-Week "Money-First" Sprint Plan

### Sprint 1 (Weeks 1-2): The "Naked Store"
**Goal:** A working checkout flow. No bells, no whistles.

**Tasks:**
- [ ] Next.js 15 setup (Vercel)
- [ ] PostgreSQL setup (Google Cloud SQL)
- [ ] Medusa.js integration (embedded mode)
- [ ] Basic auth (email + OTP via Resend)
- [ ] Product listing page (no filters yet)
- [ ] Product detail page (simple, no story)
- [ ] Cart (Redis-backed)
- [ ] Checkout with Razorpay
- [ ] Deploy to production
- [ ] **"Quick Buy" flow:** Direct product → checkout (bypass cart)

**Deliverable:** You can buy a product.

---

### Sprint 2 (Weeks 3-4): The "Growth Skeleton"
**Goal:** System can remember and act asynchronously.

**Tasks:**
- [ ] Redis setup (Google Memorystore)
- [ ] BullMQ setup (3 queues: transactional, analytics, ai-jobs)
- [ ] Event tracking system (Server Actions)
- [ ] BigQuery setup + schema
- [ ] BigQuery ingestion worker (batches 100 events)
- [ ] Basic analytics dashboard (Metabase)
- [ ] Abandoned cart recovery worker
- [ ] Test cart recovery flow

**Deliverable:** Cart abandonment emails are sending automatically.

---

### Sprint 3 (Weeks 5-6): The Content Engine
**Goal:** Traffic acquisition and brand building.

**Tasks:**
- [ ] MDX setup for stories (stories/*.mdx)
- [ ] Story page template (/stories/[slug])
- [ ] Dynamic OG image API route
- [ ] OG image integration in product pages
- [ ] Programmatic SEO: Define 200 routes
- [ ] Programmatic SEO: Implement [...slug] handler
- [ ] AI-generate SEO content for top 50 routes
- [ ] Submit sitemap to Google
- [ ] Test social sharing (WhatsApp, Instagram)

**Deliverable:** Every product share looks like a dynamic ad. 50 SEO pages indexed by Google.

---

### Sprint 4 (Weeks 7-8): The Engagement Loop
**Goal:** Stop leaking users. Bring them back.

**Tasks:**
- [ ] "Notify Me" modal for out-of-stock
- [ ] Waitlist system (Postgres table + email capture)
- [ ] Drop landing page template
- [ ] Real-time countdown (Server-Sent Events)
- [ ] NATI Circle MVP (points in users table)
- [ ] Points calculation (1 point = ₹1 spent)
- [ ] Loyalty rewards display
- [ ] Email templates (Resend)
- [ ] SMS integration (Gupshup)

**Deliverable:** Users can join waitlists and earn points. Drops have countdown timers.

---

### Sprint 5 (Weeks 9-10): The AI Brain
**Goal:** Smart product positioning and search.

**Tasks:**
- [ ] Vercel AI SDK setup
- [ ] AI brain module (lib/ai/brain.ts)
- [ ] Product embedding worker (BullMQ)
- [ ] Embed all products (Gemini → pgvector)
- [ ] Semantic search ("search by vibe")
- [ ] Heat score calculator (SQL query)
- [ ] Heat score cron job (nightly)
- [ ] Update collection pages to sort by heat_score
- [ ] Visual similarity search
- [ ] AI chatbot (basic)

**Deliverable:** Products auto-sort by what's hot. Semantic search works.

---

### Sprint 6 (Weeks 11-12): The Launchpad
**Goal:** Production-ready for Drop 1.

**Tasks:**
- [ ] Launch Control Panel (protected /admin/control)
  - [ ] Real-time active users
  - [ ] Orders per minute
  - [ ] Stock levels
  - [ ] "Panic button" (enable aggressive caching)
- [ ] Performance audit (Core Web Vitals)
- [ ] Load testing (Artillery, 1000 concurrent users)
- [ ] Caching strategy (Cloudflare)
- [ ] Image optimization (Cloudflare Images)
- [ ] Security audit (rate limiting, CSRF, etc.)
- [ ] Monitoring setup (Sentry, Vercel)
- [ ] Cost alerts (GCP billing)
- [ ] Documentation
- [ ] **Launch checklist**

**Deliverable:** 🚀 Drop 1 goes live. System handles traffic. You have control.

---

## 5. Cost Breakdown (Revised)

### Early Stage (Months 1-6)
```
Infrastructure:
  Vercel Pro                              ₹1,600/mo
  Cloudflare (free tier)                  ₹0/mo
  Google Cloud SQL (db-n1-standard-1)     ₹8,000/mo
  Google Memorystore (Redis 1GB)          ₹3,000/mo
  Cloudflare R2 (Storage)                 ₹500/mo

AI & Data:
  Gemini API (optimistic usage)           ₹5,000/mo
  BigQuery (storage + queries)            ₹1,500/mo

SaaS (Pay-per-use):
  Resend (email)                          ₹500/mo
  Gupshup (SMS, pay per send)             ₹1,500/mo
  Sentry (free tier)                      ₹0/mo

Transaction Fees (only when you make sales):
  Razorpay (2% of GMV)                    Variable
  Shiprocket (per shipment)               Variable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL MONTHLY BURN:              ₹21,600/mo
Add buffer (20%):                ₹26,000/mo

12-Month Fixed Cost:             ₹3.12 Lakhs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

At ₹50k GMV/month:
  + Transaction fees (2%)         ₹1,000
  + Shiprocket (~10 orders)       ₹1,500

Total: ₹28,500/mo
```

### Scaling (Months 7-12, ₹5L GMV/mo)
```
Infrastructure:                   ₹15,000/mo (scaled DB, Redis)
AI & Data:                        ₹12,000/mo (more API calls)
SaaS:                             ₹3,000/mo
Transaction fees (2% of ₹5L):    ₹10,000/mo
Shipping:                         ₹15,000/mo (100 orders)

TOTAL:                            ₹55,000/mo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Savings from v1.2 → v1.2.1:**
- Killed Cloud Run (Python service): -₹6,000/mo
- Killed Pub/Sub: -₹2,000/mo
- Killed Sanity CMS: -₹4,000/mo
- **Total saved:** -₹12,000/mo = **-₹1.44L/year**

---

## 6. What We Killed (And Why)

| Component | Why We Killed It | What We Use Instead |
|-----------|------------------|---------------------|
| **Python AI Gateway** | Cold starts, extra latency, context switching | Vercel AI SDK in Next.js |
| **Google Pub/Sub** | Overkill for <100k users, IAM complexity | BullMQ with Redis |
| **Sanity CMS** | Webhook sync fragility, cost | MDX in repo |
| **Separate Vector DB** | Extra service, extra cost | pgvector in Postgres |
| **Complex Analytics** | Premature optimization | BigQuery batch + Metabase |

---

## 7. What We Added (And Why)

| Component | Why We Added It | Impact |
|-----------|-----------------|--------|
| **Dynamic OG Images** | Every share becomes an ad | +30% CTR |
| **Programmatic SEO** | Capture long-tail search traffic | Organic growth |
| **Heat Score** | Auto-merchandising | Higher conversions |
| **Cart Recovery** | Recapture lost sales | +15% recovery rate |
| **Launch Control** | You control the chaos | Peace of mind |

---

## 8. Final Principles

### 1. Complexity is the Enemy
Every microservice is a future bug. Every API call is latency. Every service is ₹5k/mo.

### 2. Marketing is Code
The OG image generator is not a "nice to have." It's your social media team. Build it with the same care as your checkout flow.

### 3. Data is for Action
Don't hoard data in BigQuery to look at it next year. Use the heat score to change what users see *tomorrow*.

### 4. Monoliths Win at This Stage
Next.js scales to millions of users. You're not Google. You don't need Kubernetes.

### 5. Build What Sells
Every feature should answer: "Does this help sell a shirt or tell a story?" If not, it goes in the backlog for 2026.

---

## 9. Migration Path (When to Upgrade)

You'll know it's time to break up the monolith when:

1. **Database is slow** (>500ms p95 queries) → Add Typesense for search
2. **Redis is full** → Add separate cache cluster
3. **AI costs spike** (>₹50k/mo) → Add prompt optimization layer
4. **Complex queries** (multi-hop relationships) → Add Neo4j graph DB
5. **Scale beyond India** → Add regional replicas

Until then: **Keep it lean. Keep it mean. Keep printing money.**

---

## 10. Ready to Build?

**This is not a tech demo. This is a revenue machine.**

Sprint 1 starts now. Let's ship. 🚀
