# NATI v1.2.1 Implementation Guide
## From Zero to Revenue in 12 Weeks

This guide shows you how to use the **Sales Tech** modules we've built.

---

## 📁 File Structure

```
nati-commerce/
├── app/
│   ├── api/
│   │   └── og/
│   │       └── route.tsx          # Dynamic OG image generator
│   ├── products/[slug]/
│   │   └── page.tsx                # Product page (integrate OG images here)
│   └── shop/[...slug]/
│       └── page.tsx                # Programmatic SEO pages
├── lib/
│   ├── ai/
│   │   └── brain.ts                # AI Brain (Vercel AI SDK)
│   ├── queue/
│   │   ├── setup.ts                # BullMQ queues setup
│   │   └── workers/
│   │       ├── cart-recovery.ts    # Cart recovery worker
│   │       └── heat-score.ts       # Heat score calculator
│   └── seo/
│       └── programmatic.ts         # SEO route generator
└── docs/
    ├── NATI_ARCHITECTURE_V1.2.1_LEAN.md  # Architecture document
    └── SPRINT_PLAN_LEAN.md               # 12-week sprint plan
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install ai @ai-sdk/google @ai-sdk/openai bullmq ioredis
npm install @vercel/og            # For OG images
npm install @next/mdx remark rehype  # For MDX stories
```

### 2. Environment Variables

Create `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/nati"

# Redis (Google Memorystore or local)
REDIS_HOST="your-redis-host"
REDIS_PORT="6379"
REDIS_PASSWORD="your-redis-password"

# AI Providers
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-key"
OPENAI_API_KEY="your-openai-key"

# Email
RESEND_API_KEY="your-resend-key"

# SMS (optional)
GUPSHUP_API_KEY="your-gupshup-key"

# Payments
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# BigQuery (for analytics)
GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
```

---

## 🧠 Using the AI Brain

### Basic Usage

```typescript
// app/actions/product-recommendations.ts
'use server';

import { askGeminiBrain } from '@/lib/ai/brain';

export async function getRecommendations(userId: string) {
  const userProfile = await getUserProfile(userId);

  const prompt = `Recommend 5 products for a user who:
  - Recently viewed: ${userProfile.recentViews.join(', ')}
  - Prefers: ${userProfile.preferences.join(', ')}
  - Budget: ₹${userProfile.avgSpend}`;

  const recommendations = await askGeminiBrain(prompt, userId);

  return recommendations;
}
```

### Streaming (for Chatbot)

```typescript
// app/api/chat/route.ts
import { streamGeminiBrain } from '@/lib/ai/brain';

export async function POST(request: Request) {
  const { message } = await request.json();

  const prompt = `You are a helpful fashion advisor for NATI.
  User question: ${message}
  Provide a warm, culturally-informed answer.`;

  return await streamGeminiBrain(prompt);
}
```

### Generate Embeddings

```typescript
// app/actions/embed-products.ts
'use server';

import { generateEmbeddingsBatch } from '@/lib/ai/brain';

export async function embedAllProducts() {
  const products = await db.product.findMany();

  const texts = products.map(
    (p) => `${p.name} ${p.description} ${p.artForm}`
  );

  const embeddings = await generateEmbeddingsBatch(texts);

  // Store in pgvector
  await db.$executeRaw`
    UPDATE ai.product_embeddings
    SET combined_embedding = embeddings[i]
    FROM unnest(${embeddings}) WITH ORDINALITY AS t(embedding, i)
    WHERE product_id = ${products[i].id}
  `;
}
```

---

## 🛒 Cart Recovery Worker

### Step 1: Start the Worker

```typescript
// workers/index.ts
import cartRecoveryWorker from '@/lib/queue/workers/cart-recovery';

console.log('Workers started');

// Graceful shutdown
process.on('SIGTERM', async () => {
  await cartRecoveryWorker.close();
  process.exit(0);
});
```

Run with:
```bash
node workers/index.ts
```

Or use Vercel Cron (recommended):

```typescript
// app/api/cron/workers/route.ts
import { cartRecoveryWorker } from '@/lib/queue/workers/cart-recovery';

export async function GET(request: Request) {
  // Vercel Cron will call this every minute
  // Worker processes jobs from queue

  return Response.json({ status: 'ok' });
}
```

### Step 2: Schedule Recovery on Cart Update

```typescript
// app/actions/cart.ts
'use server';

import { scheduleCartRecovery } from '@/lib/queue/workers/cart-recovery';

export async function addToCart(productId: string) {
  const user = await getCurrentUser();
  const cart = await updateCart(user.id, productId);

  // Schedule recovery (1 hour delay)
  if (user.email) {
    await scheduleCartRecovery(
      cart.id,
      user.email,
      user.id,
      user.phone
    );
  }

  return cart;
}
```

### Step 3: Cancel Recovery on Checkout

```typescript
// app/actions/checkout.ts
'use server';

import { cancelCartRecovery } from '@/lib/queue/workers/cart-recovery';

export async function completeCheckout(cartId: string) {
  // Process order...

  // Cancel scheduled recovery
  await cancelCartRecovery(cartId);

  return order;
}
```

---

## 🔥 Heat Score System

### Step 1: Schedule Nightly Calculation

```typescript
// instrumentation.ts (runs on server start)
import { scheduleNightlyHeatScore } from '@/lib/queue/workers/heat-score';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await scheduleNightlyHeatScore();
    console.log('Heat score scheduled for 2 AM UTC daily');
  }
}
```

### Step 2: Use Heat Score in Queries

```typescript
// app/actions/products.ts
'use server';

export async function getHotProducts(limit = 20) {
  return db.product.findMany({
    where: { status: 'active', stock: { gt: 0 } },
    orderBy: { heat_score: 'desc' },
    take: limit,
  });
}
```

### Step 3: Manual Trigger (for testing)

```typescript
import { triggerHeatScoreCalculation } from '@/lib/queue/workers/heat-score';

// Dry run (doesn't update DB)
await triggerHeatScoreCalculation(true);

// Real calculation
await triggerHeatScoreCalculation(false);
```

---

## 🎨 Dynamic OG Images

### Step 1: Use in Product Page

```typescript
// app/products/[slug]/page.tsx
import { generateOGImageUrl } from '@/app/api/og/route';

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [generateOGImageUrl(product)],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [generateOGImageUrl(product)],
    },
  };
}
```

### Step 2: Test on Social Media

1. Deploy to production
2. Share a product URL on WhatsApp
3. You should see a dynamic image with:
   - Product photo
   - Price
   - Stock status ("Only 3 left")
   - Brand logo

### Step 3: A/B Test Urgency

Try different stock messages and track CTR:
- "Only 3 left" (scarcity)
- "Low Stock" (urgency)
- "Limited Edition" (exclusivity)
- "Drops in 2 hours" (FOMO)

---

## 📄 Programmatic SEO

### Step 1: Define Routes

```typescript
// lib/seo/programmatic.ts
export const curatedSEORoutes: SEORoute[] = [
  {
    slug: ['handloom', 'cotton', 'sarees'],
    title: 'Handloom Cotton Sarees | Pure Handwoven | NATI',
    h1: 'Authentic Handloom Cotton Sarees',
    metaDescription: 'Shop pure handloom cotton sarees...',
    filters: {
      artForm: 'handloom',
      fabric: 'cotton',
      category: 'saree',
    },
  },
  // Add 49 more...
];
```

### Step 2: Create Dynamic Page

```typescript
// app/shop/[...slug]/page.tsx
import {
  generateSEOStaticParams,
  getSEORoute,
  generateSEOContent,
} from '@/lib/seo/programmatic';

export function generateStaticParams() {
  return generateSEOStaticParams();
}

export default async function SEOPage({ params }) {
  const route = getSEORoute(params.slug);

  if (!route) {
    notFound();
  }

  // Fetch products matching filters
  const products = await getProductsByFilters(route.filters);

  // Generate SEO content (cached)
  const content = await generateSEOContent(route);

  return (
    <div>
      <h1>{route.h1}</h1>
      <p>{content.introduction}</p>

      {content.aboutArtForm && (
        <section>
          <h2>About {route.filters.artForm}</h2>
          <p>{content.aboutArtForm}</p>
        </section>
      )}

      <ProductGrid products={products} />

      <section>
        <h2>Buying Guide</h2>
        <div dangerouslySetInnerHTML={{ __html: content.buyingGuide }} />
      </section>

      <section>
        <h2>Frequently Asked Questions</h2>
        {content.faq.map((item, i) => (
          <details key={i}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
```

### Step 3: Generate Content

```bash
# Run a script to pre-generate all SEO content
node scripts/generate-seo-content.js
```

```javascript
// scripts/generate-seo-content.js
import { curatedSEORoutes, generateSEOContent } from '../lib/seo/programmatic';

for (const route of curatedSEORoutes) {
  console.log(`Generating content for: ${route.slug.join('/')}`);
  await generateSEOContent(route);
}

console.log('Done! All SEO content cached.');
```

---

## 🎯 Launch Control Panel

### Create Admin Page

```typescript
// app/admin/control/page.tsx
import { getQueueStats } from '@/lib/queue/setup';

export default async function ControlPanel() {
  const [transactional, analytics, aiJobs] = await Promise.all([
    getQueueStats('transactional'),
    getQueueStats('analytics'),
    getQueueStats('ai-jobs'),
  ]);

  const activeUsers = await getActiveUsers(); // Last 5 min
  const ordersPerHour = await getOrdersPerHour();
  const lowStockProducts = await getLowStockProducts();

  return (
    <div className="p-8">
      <h1>Launch Control Panel</h1>

      <div className="grid grid-cols-3 gap-4">
        {/* Real-time Metrics */}
        <Card>
          <h2>Active Users</h2>
          <p className="text-4xl">{activeUsers}</p>
        </Card>

        <Card>
          <h2>Orders/Hour</h2>
          <p className="text-4xl">{ordersPerHour}</p>
        </Card>

        <Card>
          <h2>Revenue/Hour</h2>
          <p className="text-4xl">₹{revenuePerHour.toLocaleString()}</p>
        </Card>
      </div>

      {/* Queue Stats */}
      <div>
        <h2>Queue Status</h2>
        <table>
          <thead>
            <tr>
              <th>Queue</th>
              <th>Waiting</th>
              <th>Active</th>
              <th>Failed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Transactional</td>
              <td>{transactional.waiting}</td>
              <td>{transactional.active}</td>
              <td>{transactional.failed}</td>
            </tr>
            <tr>
              <td>Analytics</td>
              <td>{analytics.waiting}</td>
              <td>{analytics.active}</td>
              <td>{analytics.failed}</td>
            </tr>
            <tr>
              <td>AI Jobs</td>
              <td>{aiJobs.waiting}</td>
              <td>{aiJobs.active}</td>
              <td>{aiJobs.failed}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Panic Button */}
      <div className="mt-8">
        <button
          className="bg-red-600 text-white px-6 py-3"
          onClick={enablePanicMode}
        >
          🚨 Panic Mode (Heavy Load)
        </button>
      </div>
    </div>
  );
}
```

---

## 📊 Monitoring Setup

### 1. Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 2. Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. Custom Metrics (for BigQuery)

```typescript
// lib/analytics.ts
export async function trackMetric(name: string, value: number, tags: Record<string, string> = {}) {
  await addAnalyticsJob('log-metric', {
    name,
    value,
    tags,
    timestamp: new Date(),
  });
}

// Usage
await trackMetric('checkout_completion_time', 15000, { userId: '123' });
```

---

## 🚨 Common Issues & Fixes

### Issue: Worker jobs not processing

**Symptoms:** Cart recovery emails not sending

**Fix:**
1. Check if worker process is running: `ps aux | grep node`
2. Check Redis connection: `redis-cli -h YOUR_HOST -p 6379 ping`
3. Check queue status:
   ```typescript
   import { getQueueStats } from '@/lib/queue/setup';
   const stats = await getQueueStats('transactional');
   console.log(stats);
   ```
4. Restart worker: `pm2 restart workers`

### Issue: AI API calls failing

**Symptoms:** Embeddings not generating, chatbot down

**Fix:**
1. Check API key validity
2. Check rate limits: Gemini (60 req/min), OpenAI (100 req/min)
3. Check fallback is working:
   ```typescript
   // Should fallback to OpenAI
   await askGeminiBrain('test prompt');
   ```
4. Check Redis cache (might be stale): `redis-cli FLUSHDB`

### Issue: OG images not showing on social media

**Symptoms:** Generic preview on WhatsApp/Twitter

**Fix:**
1. Verify route is deployed: `curl https://nati.in/api/og?title=Test`
2. Check meta tags in HTML:
   ```bash
   curl https://nati.in/products/test | grep "og:image"
   ```
3. Clear social media cache:
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
4. Verify image dimensions (should be 1200x630)

### Issue: Heat scores not updating

**Symptoms:** Products stuck in same order

**Fix:**
1. Check if cron job is running:
   ```typescript
   import { aiJobsQueue } from '@/lib/queue/setup';
   const jobs = await aiJobsQueue.getRepeatableJobs();
   console.log(jobs);
   ```
2. Manually trigger calculation:
   ```typescript
   import { triggerHeatScoreCalculation } from '@/lib/queue/workers/heat-score';
   await triggerHeatScoreCalculation();
   ```
3. Check event data exists:
   ```sql
   SELECT COUNT(*) FROM events.user_events
   WHERE timestamp > NOW() - INTERVAL '7 days';
   ```

---

## 📚 Next Steps

1. **Read the Sprint Plan:** `SPRINT_PLAN_LEAN.md`
2. **Review the Architecture:** `NATI_ARCHITECTURE_V1.2.1_LEAN.md`
3. **Start Sprint 1:** Set up infrastructure and database
4. **Ship fast, learn fast, iterate fast**

---

## 🎯 Success Metrics

Track these weekly:

| Metric | Week 1 | Week 4 | Week 8 | Week 12 |
|--------|--------|--------|--------|---------|
| Orders | - | - | - | 100+ |
| Conversion Rate | - | - | - | 60%+ |
| Cart Recovery | - | - | - | 15%+ |
| Page Load Time | - | - | - | <2s |
| Uptime | - | - | - | 99.9% |

---

**Remember:** This is not a tech demo. This is a revenue machine. Build for sales, not for your engineering portfolio.

Now go make it rain. 🚀💰
