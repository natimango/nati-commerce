
# NATI "Sales-First" Sprint Plan
## 12 Weeks to Launch - Lean & Mean

**Objective:** Ship a high-performance, high-converting store in 12 weeks.
**Mantra:** "If it doesn't help sell a shirt or tell a story, it goes in the backlog for 2026."

---

## Sprint Overview

| Sprint | Duration | Focus | Key Deliverable |
|--------|----------|-------|-----------------|
| Sprint 1 | Weeks 1-2 | The "Naked Store" | Working checkout flow |
| Sprint 2 | Weeks 3-4 | The "Growth Skeleton" | Async jobs & analytics |
| Sprint 3 | Weeks 5-6 | The Content Engine | Traffic & storytelling |
| Sprint 4 | Weeks 7-8 | The Engagement Loop | Retention & loyalty |
| Sprint 5 | Weeks 9-10 | The AI Brain | Smart merchandising |
| Sprint 6 | Weeks 11-12 | The Launchpad | Production-ready |

---

## Sprint 1 (Weeks 1-2): The "Naked Store"
### Goal: A working checkout flow. No bells, no whistles.

**Philosophy:** Get to revenue as fast as possible. Everything else is secondary.

### Tasks

#### Infrastructure Setup
- [ ] Create Next.js 15 project with App Router
  - TypeScript configuration
  - ESLint + Prettier
  - Tailwind CSS + shadcn/ui
- [ ] Set up Google Cloud project
  - Cloud SQL PostgreSQL 16 instance
  - Memorystore Redis instance
  - IAM and service accounts
- [ ] Deploy to Vercel
  - Connect to GitHub
  - Environment variables
  - Custom domain setup

#### Database & Backend
- [ ] Create PostgreSQL schema
  - Core tables: products, orders, users, carts
  - Cultural tables: artists, art_forms (basic)
  - Migrations with Prisma
- [ ] Integrate Medusa.js 2.0
  - Embedded mode (same process as Next.js)
  - Product catalog
  - Cart management
  - Order processing
- [ ] Basic authentication
  - Email/password (next-auth)
  - Email OTP (Resend)
  - Session management (Redis)

#### Frontend Pages
- [ ] Home page (minimal, single hero + 12 products)
- [ ] Product listing page
  - Simple grid
  - No filters yet (just sort by newest)
  - Pagination
- [ ] Product detail page
  - Image gallery
  - Price, description
  - "Add to Cart" button
  - **NO** artist story yet (Sprint 3)
- [ ] Cart page (Redis-backed)
  - Line items
  - Quantity update
  - Remove item
  - Total calculation
- [ ] Checkout flow
  - Shipping address form
  - Razorpay integration
  - Order confirmation

#### The "Quick Buy" Optimization
- [ ] Direct "Buy Now" button on product page
  - Bypass cart
  - Single-click purchase flow
  - Pre-fill shipping from last order
- **Impact:** Reduce friction for impulse purchases

### Definition of Done
✅ A user can browse products, add to cart, and complete checkout
✅ Payment goes through Razorpay
✅ Order is recorded in database
✅ User receives email confirmation (Resend)
✅ Site deployed to production on custom domain

### Metrics
- Checkout completion rate >60%
- Page load time <2s (Lighthouse)

---

## Sprint 2 (Weeks 3-4): The "Growth Skeleton"
### Goal: System can remember and act asynchronously.

**Philosophy:** Don't just log data. Use data to sell more.

### Tasks

#### Redis + BullMQ Setup
- [ ] Redis connection module (`lib/redis.ts`)
- [ ] BullMQ queue setup (`lib/queue/setup.ts`)
  - Three queues: transactional, analytics, ai-jobs
  - Connection pooling
  - Error handling
- [ ] Worker processes
  - Separate worker process or use Vercel Cron
  - Health checks
  - Graceful shutdown

#### Event Tracking
- [ ] Event tracking system
  - Server Action: `trackEvent(type, data)`
  - Store in `events.user_events` table
  - Capture: product views, cart actions, purchases
- [ ] Intent-based tracking (not just "page view")
  - Time on page
  - Scroll depth
  - Click patterns
  - Session journey mapping

#### BigQuery Setup
- [ ] Create BigQuery dataset
  - Events table (raw)
  - Orders table (fact)
  - Products table (dimension)
  - Users table (dimension)
- [ ] BigQuery ingestion worker
  - BullMQ job: batch insert every 5 minutes
  - Buffer 100 events, then bulk insert
  - Error handling and retry

#### The "Invisible Salesman" (Cart Recovery)
- [ ] Cart recovery worker (`lib/queue/workers/cart-recovery.ts`)
- [ ] Email template (Resend + React Email)
  - Personalized: "Your [product] is waiting"
  - Show cart items with images
  - Discount code: COMEBACK10
- [ ] Schedule cart recovery on cart update
  - 1 hour delay
  - Cancel if they checkout
- [ ] SMS recovery (optional, Gupshup)

#### Analytics Dashboard (Basic)
- [ ] Set up Metabase (self-hosted on Cloud Run)
- [ ] Create 5 essential dashboards:
  1. Daily revenue & orders
  2. Top products by revenue
  3. Cart abandonment rate
  4. Traffic sources
  5. User cohorts

### Definition of Done
✅ Events are flowing to BigQuery
✅ Cart abandonment emails send automatically
✅ Analytics dashboard shows real data
✅ Background workers are stable

### Metrics
- Cart recovery rate >15%
- Event ingestion latency <5min
- Worker uptime >99%

---

## Sprint 3 (Weeks 5-6): The Content Engine
### Goal: Traffic acquisition and brand building.

**Philosophy:** Your website is your marketing team. Make it work 24/7.

### Tasks

#### MDX Story Engine
- [ ] Set up MDX support in Next.js
  - Install `@next/mdx`, `remark`, `rehype`
  - Configure `next.config.js`
- [ ] Create story template (`stories/[slug]/page.tsx`)
  - Hero image
  - Rich text content
  - Image gallery
  - Related products
  - CTA: "Shop this story"
- [ ] Write 3 launch stories (as MDX files)
  - "The Journey of Kalamkari"
  - "Meet Master Weaver Lakshmi"
  - "Sustainable Cotton: From Farm to Fabric"

#### Dynamic OG Images
- [ ] OG image API route (`app/api/og/route.tsx`)
  - Product image + price + stock status
  - Dynamic urgency badges
  - Brand logo
- [ ] Integrate OG images in product pages
  - Update `generateMetadata()`
  - Test on WhatsApp, Twitter, LinkedIn
- [ ] A/B test urgency messages
  - "Only 3 left" vs "Limited Stock"
  - Track CTR from social shares

#### Programmatic SEO
- [ ] Define 50 high-intent routes
  - Research keywords (Google Keyword Planner)
  - Identify product-route matches
  - Curate list (quality over quantity)
- [ ] Implement dynamic route (`app/shop/[...slug]/page.tsx`)
  - Parse slug to filters
  - Query products
  - Generate SEO content with AI
- [ ] Generate SEO content for all 50 routes
  - Cache in database
  - Structured data (JSON-LD)
  - Internal linking
- [ ] Submit sitemap to Google Search Console
- [ ] Test indexing (Google Search Console)

#### Cloudflare Optimization
- [ ] Set up Cloudflare (free tier)
- [ ] Enable caching rules
  - Static assets: 7 days
  - Product images: 30 days
  - API routes: no cache
- [ ] Page Rules
  - Cache HTML for story pages (1 hour)
  - Purge on new content deploy

### Definition of Done
✅ 3 stories published and looking beautiful
✅ Every product share shows dynamic OG image
✅ 50 SEO pages live and indexed by Google
✅ Static assets served from Cloudflare CDN

### Metrics
- Social share CTR >5% (test with small audience)
- SEO pages indexed within 1 week
- Page load time <1.5s (with CDN)

---

## Sprint 4 (Weeks 7-8): The Engagement Loop
### Goal: Stop leaking users. Bring them back.

**Philosophy:** Acquisition is expensive. Retention is cheap.

### Tasks

#### Waitlist System
- [ ] "Notify Me" modal for out-of-stock products
  - Capture email + optional phone
  - Store in `drops.waitlist` table
- [ ] Waitlist notification worker
  - Trigger when product back in stock
  - Email: "It's back! [Product name]"
  - Track conversion from waitlist

#### Drop System MVP
- [ ] Drop landing page template (`app/drops/[slug]/page.tsx`)
  - Hero image with countdown
  - Drop story (MDX)
  - Product grid (locked until launch)
  - "Join Waitlist" CTA
- [ ] Real-time countdown
  - Server-Sent Events (SSE)
  - Or client-side with React
  - Show: Days, Hours, Minutes, Seconds
- [ ] Drop launch automation
  - Scheduled job (BullMQ)
  - Send emails to waitlist
  - Unlock products at exact time
  - Track conversion rate

#### NATI Circle (Loyalty MVP)
- [ ] Add points system to users table
  - `loyalty_points` integer
  - `loyalty_tier` enum (Bronze, Silver, Gold)
- [ ] Points calculation
  - 1 point = ₹1 spent
  - Bonus: 100 points on signup
  - Bonus: 50 points on first purchase
  - Bonus: 200 points on referral purchase
- [ ] Loyalty rewards page
  - Show current points and tier
  - Explain benefits:
    - Bronze: 5% off
    - Silver: 10% off + early drop access (1 hour)
    - Gold: 15% off + early access (3 hours) + exclusive drops
- [ ] Apply discount at checkout
  - Automatic based on tier
  - Show savings

#### Email Campaigns (Transactional)
- [ ] Order confirmation email
- [ ] Shipping notification
- [ ] Delivery confirmation
- [ ] Review request (7 days post-delivery)

#### SMS Integration (Optional)
- [ ] Gupshup setup
- [ ] SMS templates
  - Order confirmation
  - Shipping update
  - Drop launch alert (for VIP)

### Definition of Done
✅ Users can join waitlists and get notified
✅ Drop pages have live countdown
✅ Loyalty points accumulate automatically
✅ Tier-based discounts work at checkout
✅ All transactional emails sending reliably

### Metrics
- Waitlist → purchase conversion >25%
- Drop launch email open rate >40%
- Loyalty program signup rate >30% of buyers

---

## Sprint 5 (Weeks 9-10): The AI Brain
### Goal: Smart product positioning and search.

**Philosophy:** Let data decide what sells, not your gut.

### Tasks

#### Vercel AI SDK Integration
- [ ] AI Brain module (`lib/ai/brain.ts`)
  - Gemini 2.0 Flash (primary)
  - OpenAI GPT-4o-mini (fallback)
  - Redis caching (1 hour TTL)
  - Cost tracking
- [ ] Server Actions using AI
  - `getProductRecommendations(userId)`
  - `generateProductDescription(images)`
  - `answerProductQuestion(question, productId)`

#### Product Embeddings
- [ ] Add `ai.product_embeddings` table
  - `product_id`
  - `description_embedding` (vector 768)
  - `image_embedding` (vector 768)
  - `combined_embedding` (vector 768)
- [ ] Embedding generation worker
  - BullMQ job: process all products
  - Generate embeddings with Gemini
  - Store in pgvector
  - HNSW index for fast search
- [ ] Semantic search API
  - `/api/search/semantic`
  - Query: natural language ("red silk saree for wedding")
  - Return: top 20 similar products

#### The "Heat Score" Merchandiser
- [ ] Heat score calculator worker
  - SQL query calculating heat scores
  - Weight: views (1), carts (5), purchases (10), shares (3)
  - Time decay: exponential (recent worth more)
  - Update `products.heat_score` nightly
- [ ] Schedule nightly calculation (2 AM UTC)
- [ ] Update collection pages to sort by heat
  - Default sort: heat_score DESC
  - User can change to: newest, price, etc.
- [ ] "Trending" badge for top 10 heat scores

#### Visual Similarity Search
- [ ] "Similar products" section on product page
  - Query pgvector by image embedding
  - Show top 6 similar products
  - Track clicks for relevance tuning

#### AI Chatbot (Basic)
- [ ] Chatbot UI component
  - Fixed bottom-right corner
  - Minimizable
  - Streaming responses
- [ ] Chatbot API (`app/api/chat/route.ts`)
  - System prompt: "You are a helpful fashion advisor for NATI"
  - Context: product catalog, art forms, care instructions
  - Streaming with Vercel AI SDK
- [ ] Suggested questions
  - "What's the difference between Kalamkari and Ajrakh?"
  - "How do I care for silk sarees?"
  - "Show me sustainable cotton kurtas"

### Definition of Done
✅ All products have embeddings in pgvector
✅ Semantic search returns relevant results
✅ Heat scores update nightly
✅ Collection pages sorted by heat by default
✅ Chatbot gives helpful answers

### Metrics
- Semantic search relevance (manual review: >80% relevant)
- Heat score correlation with conversion (test with A/B)
- Chatbot engagement (>10% of visitors interact)
- Chatbot → purchase conversion (track with events)

---

## Sprint 6 (Weeks 11-12): The Launchpad
### Goal: Production-ready for Drop 1.

**Philosophy:** You can't control everything, but you can be prepared.

### Tasks

#### Launch Control Panel
- [ ] Protected admin page (`/admin/control`)
  - Authentication (admin-only)
  - Simple, focused dashboard
- [ ] Real-time metrics
  - Active users (last 5 minutes)
  - Orders per minute
  - Revenue per hour
  - Cart abandonment rate (live)
  - Top products (last 1 hour)
- [ ] Stock monitor
  - Products with low stock (<5)
  - Out-of-stock alerts
  - Bestsellers with high velocity
- [ ] "Panic Button" features
  - Enable aggressive caching (10min TTL on HTML)
  - Disable heavy features (chatbot, recommendations)
  - Queue jobs to process later
  - Show maintenance message

#### Performance Optimization
- [ ] Core Web Vitals audit (Lighthouse)
  - LCP <2.5s
  - FID <100ms
  - CLS <0.1
- [ ] Image optimization
  - Cloudflare Images (resize, compress, WebP)
  - Or Next.js Image component with optimization
  - Lazy loading for below-the-fold
- [ ] Code splitting
  - Dynamic imports for heavy components
  - Route-based splitting (automatic with App Router)
- [ ] Database query optimization
  - Add indexes for hot queries
  - Use `EXPLAIN ANALYZE` to identify slow queries
  - Materialized views for complex aggregations

#### Load Testing
- [ ] Set up Artillery or k6
- [ ] Test scenarios:
  1. **Normal traffic:** 100 concurrent users
  2. **Drop launch:** 1000 concurrent users
  3. **Checkout flow:** 50 concurrent checkouts
- [ ] Identify bottlenecks
  - Database connection pool size
  - Redis connection limits
  - API route performance
- [ ] Fix critical bottlenecks
- [ ] Re-test until passing

#### Security Audit
- [ ] Rate limiting
  - API routes: 100 req/min per IP
  - Checkout: 10 req/min per user
  - Search: 30 req/min per user
- [ ] Input validation
  - Zod schemas for all forms
  - SQL injection prevention (use ORM)
  - XSS prevention (sanitize user input)
- [ ] CSRF protection
  - Use Next.js built-in protection
  - Verify in checkout flow
- [ ] Environment secrets audit
  - No secrets in code
  - Use Vercel environment variables
  - Rotate API keys

#### Monitoring & Alerting
- [ ] Sentry error tracking
  - JavaScript errors
  - API errors
  - Worker errors
  - Alert on >10 errors/min
- [ ] Vercel Analytics
  - Core Web Vitals
  - Real User Monitoring
- [ ] Google Cloud Monitoring
  - Database CPU/memory
  - Redis memory
  - Alert on >80% utilization
- [ ] Cost alerts
  - GCP budget alert at ₹30k/month
  - Vercel usage alert at 80% of limit
  - AI API spend alert at ₹10k/month

#### Documentation
- [ ] README with setup instructions
- [ ] Architecture diagram
- [ ] Runbook for common issues
  - Worker not processing jobs
  - Database connection errors
  - Out of memory errors
  - Payment gateway failures
- [ ] Deployment checklist
- [ ] Rollback procedure

#### Launch Checklist
- [ ] Domain configured and SSL working
- [ ] Analytics tracking (GA4, Plausible)
- [ ] Meta Pixel for Facebook ads
- [ ] All email templates tested
- [ ] SMS templates tested (if using)
- [ ] Payment gateway in production mode
- [ ] Shipping integration tested
- [ ] Tax calculation configured
- [ ] Return/refund policy page
- [ ] Privacy policy + Terms of Service
- [ ] Contact page with support email
- [ ] Social media accounts linked
- [ ] OG images working on all platforms
- [ ] Sitemap submitted to Google
- [ ] Backup strategy tested
- [ ] Disaster recovery plan documented

### Definition of Done
✅ Site handles 1000 concurrent users without crashing
✅ Core Web Vitals pass on mobile and desktop
✅ Zero critical security vulnerabilities
✅ Monitoring and alerts configured
✅ Launch checklist 100% complete
✅ Team trained on Launch Control Panel

### Metrics
- Load test: >1000 concurrent users supported
- Lighthouse score: >90 on mobile
- Mean Time To Recovery (MTTR) < 5 minutes
- Error rate <0.1%

---

## Post-Launch (Weeks 13+): Iterate & Optimize

### Week 13-14: Observe & Fix
- Monitor all metrics daily
- Fix critical bugs within 4 hours
- Respond to user feedback
- Optimize checkout flow based on drop-off data

### Week 15-16: Double Down on What Works
- Analyze which acquisition channels convert best
- Create more content in successful formats
- Expand SEO pages to top 100 (from 50)
- A/B test pricing strategies

### Week 17-20: Build Moat
- Improve AI recommendations (collaborative filtering)
- Add user reviews and ratings
- Build referral program
- Launch ambassador program

### 2026 Backlog (Don't Build Now!)
- Mobile app
- AR try-on
- Neo4j knowledge graph
- Multi-region deployment
- Separate vector database
- Advanced ML models
- Blockchain provenance
- Multi-language support

**Remember:** Resist the urge to build these until you have proven product-market fit and steady revenue.

---

## Team Velocity Tracking

Use this table to track actual vs. planned:

| Sprint | Planned Story Points | Actual Completed | Velocity |
|--------|---------------------|------------------|----------|
| Sprint 1 | TBD | - | - |
| Sprint 2 | TBD | - | - |
| Sprint 3 | TBD | - | - |
| Sprint 4 | TBD | - | - |
| Sprint 5 | TBD | - | - |
| Sprint 6 | TBD | - | - |

---

## Success Criteria

### Technical Success
- [ ] System handles 1000 concurrent users
- [ ] 99.9% uptime during launch month
- [ ] <2s average page load time
- [ ] Zero data breaches
- [ ] <0.1% error rate

### Business Success
- [ ] 100 orders in first month
- [ ] >60% checkout completion rate
- [ ] >15% cart recovery rate
- [ ] >30% repeat purchase rate (by month 3)
- [ ] Profitable unit economics (LTV > CAC)

### User Experience Success
- [ ] >4.5/5 average rating (from reviews)
- [ ] >40% organic traffic (by month 3)
- [ ] >10% social share rate
- [ ] <2% return rate
- [ ] Net Promoter Score (NPS) >50

---

## Emergency Contacts & Runbooks

### Critical Issues Playbook

#### Issue: Site Down
1. Check Vercel status page
2. Check GCP Cloud SQL status
3. Review Sentry for errors
4. Check recent deployments (rollback if needed)
5. Escalate to Vercel support if infrastructure issue

#### Issue: Payment Failures
1. Check Razorpay dashboard
2. Verify webhook endpoint responding
3. Check recent order logs
4. Test payment flow manually
5. Contact Razorpay support if systemic

#### Issue: Worker Jobs Stuck
1. Check Redis connection
2. Review BullMQ dashboard
3. Check worker process logs
4. Restart worker process
5. Drain and re-queue if needed

#### Issue: Out of Database Connections
1. Check active connections count
2. Kill long-running queries
3. Restart PgBouncer
4. Increase connection pool temporarily
5. Investigate query causing leak

---

## Final Thoughts

**This is a 12-week sprint to revenue, not perfection.**

- Every feature should answer: "Does this help sell a shirt or tell a story?"
- If the answer is no, it goes in the 2026 backlog.
- Ship fast. Learn fast. Iterate fast.
- The goal is not to build the perfect tech stack. The goal is to build a money-printing brand.

**Now go build.** 🚀
