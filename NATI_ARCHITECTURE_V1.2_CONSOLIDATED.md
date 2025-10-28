# NATI Architecture v1.2: "Gemini Brain" Consolidated
## Lean, AI-Native, Production-Ready for Drop 1 Launch

**Version:** 1.2 (Consolidated)
**Philosophy:** Pragmatic over Perfect, Lean over Complex, Fast over Feature-Complete
**Last Updated:** 2025-10-28
**Target Launch:** Drop 1 - December 2025

---

## Executive Summary

NATI v1.2 adopts a **consolidated "Gemini Brain" architecture** - a lean, AI-native stack that prioritizes speed to market while maintaining future flexibility.

**Core Principle:** Single source of truth (PostgreSQL + pgvector) with strategic services, not sprawling microservices.

**Why Consolidated?**
- **Speed:** Launch Drop 1 in 6-8 weeks, not 6 months
- **Cost:** ₹40-90k/mo vs ₹150k+/mo for best-of-breed
- **Simplicity:** Fewer services = less to break, faster to debug
- **Future-Proof:** AI Gateway + BigQuery enable painless migration later

---

## Version Evolution

| Version | Approach | Services | Monthly Cost | Best For |
|---------|----------|----------|--------------|----------|
| v1.0 | Basic | 8-10 | ₹60-100k | MVP concept |
| v1.1 | Best-of-Breed | 15-20 | ₹150-250k | Enterprise scale |
| **v1.2** | **Consolidated** | **6-8** | **₹40-90k** | **NATI Now** ✅ |

**Migration Path:** v1.2 → Semi-Modular → Best-of-Breed (as needed)

---

## 1. Consolidated Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     NATI v1.2: GEMINI BRAIN ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │                          EDGE LAYER                                     │    │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │    │
│  │  │  Cloudflare Workers + KV                                          │  │    │
│  │  │  • Journey-aware recommendations                                  │  │    │
│  │  │  • Story page caching                                             │  │    │
│  │  │  • Precomputed product cards                                      │  │    │
│  │  └──────────────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                        ↓                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │                        FRONTEND LAYER                                   │    │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │    │
│  │  │  Next.js 15 (App Router + RSC) on Vercel                         │  │    │
│  │  │  • Server Components for story pages                              │  │    │
│  │  │  • Client Components for interactive features                     │  │    │
│  │  │  • tRPC for type-safe APIs                                        │  │    │
│  │  └──────────────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                        ↓                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │                    APPLICATION LAYER                                    │    │
│  │                                                                          │    │
│  │  ┌────────────────────┐           ┌────────────────────┐               │    │
│  │  │  Medusa.js API     │           │  AI Gateway        │               │    │
│  │  │  (E-commerce Core) │◄──────────┤  (Provider Router) │               │    │
│  │  │                    │           │                    │               │    │
│  │  │  • Products        │           │  • Gemini (primary)│               │    │
│  │  │  • Orders          │           │  • OpenAI (fallback│               │    │
│  │  │  • Cart/Checkout   │           │  • Feature flags   │               │    │
│  │  │  • Auth            │           │  • Usage tracking  │               │    │
│  │  └────────────────────┘           └────────────────────┘               │    │
│  │                                                                          │    │
│  │  ┌────────────────────┐           ┌────────────────────┐               │    │
│  │  │  Event Router      │           │  CMS (Sanity)      │               │    │
│  │  │  (Pub/Sub)         │           │  (Headless)        │               │    │
│  │  │                    │           │                    │               │    │
│  │  │  • Event ingestion │           │  • Art stories     │               │    │
│  │  │  • Feature compute │           │  • Artist profiles │               │    │
│  │  │  • Multi-sink      │           │  • Drop content    │               │    │
│  │  └────────────────────┘           └────────────────────┘               │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                        ↓                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │                      DATA LAYER (SINGLE SOURCE OF TRUTH)                │    │
│  │                                                                          │    │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │    │
│  │  │  PostgreSQL 16 + pgvector (AlloyDB on GCP)                       │  │    │
│  │  │                                                                    │  │    │
│  │  │  Logical Schemas:                                                 │  │    │
│  │  │  ├─ core_*          (products, orders, users, inventory)         │  │    │
│  │  │  ├─ cultural_*      (art_forms, artists, fabric_lineage)         │  │    │
│  │  │  ├─ drops_*         (drop_collections, waitlists)                │  │    │
│  │  │  ├─ ai_*            (embeddings, recs, predictions)              │  │    │
│  │  │  ├─ events_*        (user_events, tracking)                      │  │    │
│  │  │  ├─ crm_*           (customer_profile, communications)           │  │    │
│  │  │  └─ warehouse_staging_* (ETL buffer)                             │  │    │
│  │  │                                                                    │  │    │
│  │  │  Performance Features:                                            │  │    │
│  │  │  ├─ pgvector 0.7+ with HNSW indexing                             │  │    │
│  │  │  ├─ Table partitioning (by month/drop)                           │  │    │
│  │  │  ├─ Materialized views for heavy joins                           │  │    │
│  │  │  ├─ Read replicas for AI workloads                               │  │    │
│  │  │  └─ Connection pooling (PgBouncer)                               │  │    │
│  │  └──────────────────────────────────────────────────────────────────┘  │    │
│  │                                                                          │    │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │    │
│  │  │  Redis 7 (Google Memorystore)                                    │  │    │
│  │  │  • Session storage                                                │  │    │
│  │  │  • Cart management                                                │  │    │
│  │  │  • Real-time drop countdown                                      │  │    │
│  │  │  • Event deduplication (5min window)                             │  │    │
│  │  │  • Rate limiting                                                  │  │    │
│  │  └──────────────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                        ↓                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │                    ANALYTICS LAYER (SAFETY NET)                         │    │
│  │                                                                          │    │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │    │
│  │  │  Google BigQuery (Data Warehouse)                                │  │    │
│  │  │                                                                    │  │    │
│  │  │  Daily ETL (2 AM UTC):                                            │  │    │
│  │  │  ├─ Fact tables (orders, events, revenue)                        │  │    │
│  │  │  ├─ Dimension tables (users, products, artists, drops)           │  │    │
│  │  │  ├─ Aggregated tables (daily_sales, cohorts, performance)        │  │    │
│  │  │  └─ Cold embeddings (historical, for training)                   │  │    │
│  │  │                                                                    │  │    │
│  │  │  Use Cases:                                                       │  │    │
│  │  │  ├─ Complex analytics (RFM, cohorts, attribution)                │  │    │
│  │  │  ├─ AI model training (without hitting prod DB)                  │  │    │
│  │  │  ├─ Historical trend analysis                                    │  │    │
│  │  │  └─ BI dashboards (Metabase/Looker)                              │  │    │
│  │  └──────────────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │                    INTEGRATIONS & EXTERNAL SERVICES                     │    │
│  │                                                                          │    │
│  │  Payments:      Razorpay (India), Stripe (global), Cashfree (payouts) │    │
│  │  Shipping:      Shiprocket, Delhivery                                  │    │
│  │  Marketing:     Klaviyo (email), Gupshup (SMS), Telegram Bot API      │    │
│  │  Analytics:     GA4, Meta Pixel, Amplitude                             │    │
│  │  Monitoring:    Sentry (errors), Google Cloud Monitoring               │    │
│  │  Storage:       Google Cloud Storage (images, docs)                    │    │
│  │  CDN:           Cloudflare (assets + edge functions)                   │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Technology Stack (v1.2)

### 2.1 Frontend
```yaml
Framework:       Next.js 15 (App Router + React Server Components)
Language:        TypeScript
UI:              React 19 + Tailwind CSS + shadcn/ui
State:           Zustand (client state) + RSC (server state)
Forms:           React Hook Form + Zod validation
API:             tRPC (type-safe) + Server Actions
Real-time:       WebSockets (drop countdown)
Edge:            Cloudflare Workers + KV
Analytics:       GA4, Meta Pixel
Hosting:         Vercel
```

### 2.2 Backend
```yaml
E-commerce:      Medusa.js 2.0
Database:        PostgreSQL 16 + pgvector 0.7+
               (Google Cloud SQL or AlloyDB)
Cache:           Redis 7 (Google Memorystore)
Queue:           BullMQ (Redis-based)
Event Stream:    Google Cloud Pub/Sub
API Gateway:     Custom (Express middleware)
File Storage:    Google Cloud Storage
Email:           Klaviyo (marketing) + Resend (transactional)
SMS:             Gupshup
Payments:        Razorpay, Stripe, Cashfree
Shipping:        Shiprocket
```

### 2.3 AI Layer (Consolidated)
```yaml
Primary LLM:     Google Gemini 2.0 Flash
Vision:          Gemini Vision (instead of CLIP)
Embeddings:      Gemini text-embedding-004
Vector Storage:  pgvector (in PostgreSQL)
AI Gateway:      Custom FastAPI microservice
                 - Provider routing (Gemini → OpenAI → Claude)
                 - Usage tracking & cost monitoring
                 - Rate limiting & caching
                 - Feature flags for A/B testing
Framework:       LangChain (agent orchestration)
```

### 2.4 Content & Analytics
```yaml
CMS:             Sanity (headless for storytelling)
Data Warehouse:  Google BigQuery
ETL:             Cloud Functions (nightly)
BI:              Metabase (open-source)
Monitoring:      Sentry + Google Cloud Monitoring
Logging:         Google Cloud Logging
CI/CD:           GitHub Actions
IaC:             Terraform (infrastructure as code)
```

---

## 3. PostgreSQL Schema Design (Consolidated)

### 3.1 Schema Organization

```sql
-- Logical separation within single database
CREATE SCHEMA core;           -- Commerce essentials
CREATE SCHEMA cultural;       -- Art, artists, provenance
CREATE SCHEMA drops;          -- Drop collections
CREATE SCHEMA ai;             -- AI features & embeddings
CREATE SCHEMA events;         -- Event tracking
CREATE SCHEMA crm;            -- Customer relationship
CREATE SCHEMA warehouse_staging;  -- ETL buffer
```

### 3.2 Core Schema (Commerce)

```sql
-- ============================================
-- PRODUCTS (Split for Performance)
-- ============================================

-- Product Core (fast queries for list views)
CREATE TABLE core.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  cost DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'INR',
  discount_percentage DECIMAL(5,2) DEFAULT 0,

  -- Inventory
  stock INTEGER DEFAULT 0,
  reserved_stock INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,

  -- Relations
  category_id UUID REFERENCES core.categories(id),
  drop_id UUID REFERENCES drops.collections(id),

  -- Images (minimal for lists)
  thumbnail_image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',

  -- Status
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes for performance
  CONSTRAINT price_check CHECK (price > 0)
);

CREATE INDEX idx_products_status ON core.products(status) WHERE status = 'active';
CREATE INDEX idx_products_drop ON core.products(drop_id) WHERE drop_id IS NOT NULL;
CREATE INDEX idx_products_slug ON core.products(slug);
CREATE INDEX idx_products_created ON core.products(created_at DESC);

-- Product Cultural Metadata (loaded on demand)
CREATE TABLE cultural.product_meta (
  product_id UUID PRIMARY KEY REFERENCES core.products(id) ON DELETE CASCADE,

  -- Art & Artist
  art_form_id UUID REFERENCES cultural.art_forms(id),

  -- Story (can reference Sanity CMS)
  story_id VARCHAR(255),              -- Sanity document ID
  story_title VARCHAR(255),
  story_content TEXT,
  cultural_context TEXT,
  art_technique TEXT,
  inspiration_source TEXT,

  -- Supply Chain
  fabric_lineage_id UUID REFERENCES cultural.fabric_lineages(id),
  mill_id UUID REFERENCES cultural.mills(id),
  production_location VARCHAR(255),
  sustainability_score INTEGER CHECK (sustainability_score BETWEEN 0 AND 100),
  certifications TEXT[] DEFAULT '{}',
  certification_docs TEXT[] DEFAULT '{}',

  -- Limited Edition
  is_limited_edition BOOLEAN DEFAULT false,
  total_units_produced INTEGER,
  edition_number VARCHAR(20),

  -- AI Tags
  tags TEXT[] DEFAULT '{}',
  color_palette TEXT[] DEFAULT '{}',
  season VARCHAR(50),
  occasion TEXT[] DEFAULT '{}',
  fit_type VARCHAR(50),
  care_instructions TEXT,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_meta_art_form ON cultural.product_meta(art_form_id);
CREATE INDEX idx_product_meta_mill ON cultural.product_meta(mill_id);
CREATE INDEX idx_product_meta_tags ON cultural.product_meta USING GIN(tags);

-- Product Analytics (aggregated metrics)
CREATE TABLE ai.product_analytics (
  product_id UUID PRIMARY KEY REFERENCES core.products(id) ON DELETE CASCADE,

  -- Engagement
  view_count INTEGER DEFAULT 0,
  unique_view_count INTEGER DEFAULT 0,
  wishlist_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,

  -- Purchase
  purchase_count INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  conversion_rate DECIMAL(5,4) DEFAULT 0,

  -- Quality
  return_count INTEGER DEFAULT 0,
  return_rate DECIMAL(5,4) DEFAULT 0,
  average_rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,

  -- Drop Performance
  drop_id UUID,
  drop_conversion_rate DECIMAL(5,4),
  time_to_sellout_minutes INTEGER,

  -- AI Scores (calculated nightly)
  popularity_score INTEGER CHECK (popularity_score BETWEEN 0 AND 100),
  recommendation_score INTEGER,
  cross_sell_score INTEGER,

  -- Temporal Patterns
  peak_view_hours INTEGER[] DEFAULT '{}',
  best_selling_days TEXT[] DEFAULT '{}',

  -- Timestamps
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_popularity ON ai.product_analytics(popularity_score DESC);
CREATE INDEX idx_analytics_conversion ON ai.product_analytics(conversion_rate DESC);

-- Product Embeddings (for AI similarity)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE ai.product_embeddings (
  product_id UUID PRIMARY KEY REFERENCES core.products(id) ON DELETE CASCADE,

  -- Text Embeddings (Gemini text-embedding-004, 768 dims)
  description_embedding vector(768),
  story_embedding vector(768),

  -- Visual Embeddings (Gemini Vision multimodal, 768 dims)
  image_embedding vector(768),

  -- Combined Multimodal
  combined_embedding vector(768),

  -- Metadata
  embedding_model VARCHAR(100) DEFAULT 'gemini-text-embedding-004',
  generated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Hot/Cold separation
  is_hot BOOLEAN DEFAULT true,       -- Recent/popular products
  archived_to_bigquery BOOLEAN DEFAULT false
);

-- HNSW index for fast similarity search (only on hot embeddings)
CREATE INDEX idx_embedding_combined_hnsw ON ai.product_embeddings
  USING hnsw (combined_embedding vector_cosine_ops)
  WHERE is_hot = true;

-- Keep cold embeddings without index (save memory)
-- Archive to BigQuery after 90 days
```

### 3.3 Cultural Schema (Art, Artists, Supply Chain)

```sql
-- ============================================
-- ART FORMS
-- ============================================
CREATE TABLE cultural.art_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255),          -- "కలంకారి (Kalamkari)"
  slug VARCHAR(100) UNIQUE NOT NULL,

  -- Content (can sync with Sanity CMS)
  cms_id VARCHAR(255),                -- Reference to Sanity
  description TEXT,
  history TEXT,
  region VARCHAR(100),
  technique TEXT,
  traditional_use TEXT,
  modern_adaptation TEXT,
  artisan_communities TEXT[] DEFAULT '{}',

  -- Media
  images TEXT[] DEFAULT '{}',
  video_url TEXT,

  -- Stats
  product_count INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_art_forms_slug ON cultural.art_forms(slug);

-- ============================================
-- ARTISTS
-- ============================================
CREATE TABLE cultural.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- Profile
  bio TEXT,
  profile_image TEXT,
  location VARCHAR(255),
  years_of_experience INTEGER,
  art_forms TEXT[] DEFAULT '{}',

  -- Story (can sync with Sanity)
  cms_id VARCHAR(255),
  story_content TEXT,
  portfolio_images TEXT[] DEFAULT '{}',
  video_interview_url TEXT,

  -- Social
  instagram VARCHAR(255),
  website TEXT,

  -- Collaboration Metrics
  total_collaborations INTEGER DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,

  -- Payout Info
  bank_account_name VARCHAR(255),
  bank_account_number VARCHAR(50),
  bank_ifsc VARCHAR(20),
  pan_number VARCHAR(20),
  gstin VARCHAR(20),

  -- Follower Feature
  allow_follow BOOLEAN DEFAULT true,
  follower_count INTEGER DEFAULT 0,
  average_engagement_rate DECIMAL(5,4) DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,
  partner_since DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_artists_slug ON cultural.artists(slug);
CREATE INDEX idx_artists_follower_count ON cultural.artists(follower_count DESC);

-- Artist Credits (many-to-many with products)
CREATE TABLE cultural.artist_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES core.products(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES cultural.artists(id) ON DELETE RESTRICT,

  role VARCHAR(100),                  -- "Pattern Designer", "Block Maker", etc.
  contribution_percentage DECIMAL(5,2) DEFAULT 100.00,
  credit_text VARCHAR(255),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(product_id, artist_id)
);

CREATE INDEX idx_artist_credits_product ON cultural.artist_credits(product_id);
CREATE INDEX idx_artist_credits_artist ON cultural.artist_credits(artist_id);

-- Artist Follows (for notifications)
CREATE TABLE cultural.artist_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES cultural.artists(id) ON DELETE CASCADE,

  -- Notification Preferences
  notify_on_new_drop BOOLEAN DEFAULT true,
  notify_on_collaboration BOOLEAN DEFAULT true,
  notify_on_story BOOLEAN DEFAULT true,

  -- Engagement
  drops_attended INTEGER DEFAULT 0,
  products_owned INTEGER DEFAULT 0,

  followed_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, artist_id)
);

CREATE INDEX idx_artist_follows_user ON cultural.artist_follows(user_id);
CREATE INDEX idx_artist_follows_artist ON cultural.artist_follows(artist_id);

-- ============================================
-- MILLS & SUPPLIERS
-- ============================================
CREATE TABLE cultural.mills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- Location
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(50) DEFAULT 'India',
  coordinates POINT,

  -- Type
  mill_type VARCHAR(50) CHECK (mill_type IN ('handloom', 'powerloom', 'hybrid')),
  weaver_community VARCHAR(255),

  -- Capabilities
  fabric_types TEXT[] DEFAULT '{}',
  production_capacity_per_month INTEGER,
  minimum_order_quantity INTEGER,

  -- Certifications
  certifications TEXT[] DEFAULT '{}',
  certification_docs TEXT[] DEFAULT '{}',
  audited_at DATE,
  audited_by VARCHAR(255),

  -- Sustainability
  fair_trade_compliant BOOLEAN DEFAULT false,
  organic_certified BOOLEAN DEFAULT false,
  carbon_footprint_per_kg DECIMAL(8,4),
  water_usage_per_kg DECIMAL(8,4),
  sustainability_score INTEGER CHECK (sustainability_score BETWEEN 0 AND 100),

  -- Collaboration
  total_collaborations INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,

  -- Contact
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),

  -- Media
  images TEXT[] DEFAULT '{}',
  video_url TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,
  partner_since DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mills_slug ON cultural.mills(slug);
CREATE INDEX idx_mills_sustainability ON cultural.mills(sustainability_score DESC);

CREATE TABLE cultural.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- Type
  supplier_type VARCHAR(50) CHECK (supplier_type IN ('dye', 'fabric', 'raw_material', 'accessory', 'packaging')),

  -- Location
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(50) DEFAULT 'India',

  -- Products
  products_supplied TEXT[] DEFAULT '{}',

  -- Certifications
  certifications TEXT[] DEFAULT '{}',
  certification_docs TEXT[] DEFAULT '{}',
  audited_at DATE,

  -- Sustainability
  uses_natural_dyes BOOLEAN DEFAULT false,
  organic_materials BOOLEAN DEFAULT false,
  sustainability_score INTEGER CHECK (sustainability_score BETWEEN 0 AND 100),

  -- Lead Times
  average_lead_time_days INTEGER,
  minimum_order_value DECIMAL(10,2),

  -- Collaboration
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,

  -- Contact
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),

  -- Status
  is_active BOOLEAN DEFAULT true,
  partner_since DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_suppliers_slug ON cultural.suppliers(slug);
CREATE INDEX idx_suppliers_type ON cultural.suppliers(supplier_type);

-- ============================================
-- FABRIC LINEAGE (with relations)
-- ============================================
CREATE TABLE cultural.fabric_lineages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  fabric_type VARCHAR(100),           -- Cotton, Linen, Silk, Hemp
  fabric_weight INTEGER,              -- GSM
  fabric_composition VARCHAR(255),    -- "100% Organic Cotton"

  -- Relations
  mill_id UUID REFERENCES cultural.mills(id),
  raw_material_supplier_id UUID REFERENCES cultural.suppliers(id),
  raw_material_origin VARCHAR(255),

  -- Dye Process
  dye_supplier_id UUID REFERENCES cultural.suppliers(id),
  dye_type VARCHAR(50) CHECK (dye_type IN ('natural', 'azo_free_synthetic', 'conventional')),
  dye_ingredients TEXT[] DEFAULT '{}',
  dye_method VARCHAR(100),
  dye_water_usage_liters INTEGER,
  chemical_free BOOLEAN DEFAULT false,

  -- Processing
  processing_method VARCHAR(100),     -- Handloom, Powerloom, Organic
  finishing VARCHAR(100),             -- Enzyme wash, stone wash

  -- Certifications
  certifications TEXT[] DEFAULT '{}',
  certification_docs TEXT[] DEFAULT '{}',

  -- Environmental Impact
  carbon_footprint_kg DECIMAL(8,4),
  water_usage_liters INTEGER,
  sustainability_score INTEGER CHECK (sustainability_score BETWEEN 0 AND 100),

  -- Provenance Tracking (future)
  provenance_qr_code VARCHAR(255),
  blockchain_record VARCHAR(255),     -- IPFS hash or TX

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fabric_mill ON cultural.fabric_lineages(mill_id);
CREATE INDEX idx_fabric_dye_supplier ON cultural.fabric_lineages(dye_supplier_id);
CREATE INDEX idx_fabric_sustainability ON cultural.fabric_lineages(sustainability_score DESC);
```

### 3.4 Drops Schema

```sql
CREATE TABLE drops.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  season VARCHAR(100),
  drop_number INTEGER,

  -- Theme & Story
  theme VARCHAR(255),
  story_content TEXT,
  inspiration TEXT,
  curated_by VARCHAR(255),
  cms_id VARCHAR(255),                -- Reference to Sanity

  -- Timing
  launch_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  pre_access_date TIMESTAMPTZ,

  -- Media
  hero_image TEXT,
  lookbook_images TEXT[] DEFAULT '{}',
  campaign_video TEXT,

  -- Limited Edition
  is_limited_edition BOOLEAN DEFAULT false,
  total_pieces_produced INTEGER,

  -- Marketing
  teaser_campaign BOOLEAN DEFAULT false,
  waitlist_enabled BOOLEAN DEFAULT true,

  -- Performance Metrics
  view_count INTEGER DEFAULT 0,
  waitlist_count INTEGER DEFAULT 0,
  unique_buyers INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  conversion_rate DECIMAL(5,4),
  sold_out_date TIMESTAMPTZ,

  -- AI Insights
  predicted_demand INTEGER,
  target_audience TEXT[] DEFAULT '{}',
  recommended_price_min DECIMAL(10,2),
  recommended_price_max DECIMAL(10,2),

  -- Status
  status VARCHAR(20) CHECK (status IN ('draft', 'teaser', 'live', 'sold_out', 'archived')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drops_status ON drops.collections(status);
CREATE INDEX idx_drops_launch ON drops.collections(launch_date DESC);
CREATE INDEX idx_drops_slug ON drops.collections(slug);

-- Waitlist
CREATE TABLE drops.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id UUID REFERENCES drops.collections(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,

  -- Notifications
  notified_at TIMESTAMPTZ,
  opened_notification BOOLEAN DEFAULT false,
  converted BOOLEAN DEFAULT false,

  joined_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(drop_id, user_id)
);

CREATE INDEX idx_waitlist_drop ON drops.waitlist(drop_id);
CREATE INDEX idx_waitlist_user ON drops.waitlist(user_id);
```

### 3.5 Events Schema

```sql
CREATE TABLE events.user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User Context
  user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255) NOT NULL,
  anonymous_id VARCHAR(255),
  journey_id VARCHAR(255),            -- Groups sessions across days

  -- Event Details
  event_type VARCHAR(100) NOT NULL,
  event_name VARCHAR(255),
  event_category VARCHAR(50) CHECK (event_category IN ('product', 'drop', 'story', 'checkout', 'engagement', 'ai')),

  -- Source Platform
  source_platform VARCHAR(20) CHECK (source_platform IN ('web', 'mobile', 'telegram', 'email', 'sms', 'api')),

  -- Context Objects
  product_id UUID,
  drop_id UUID,
  artist_id UUID,
  art_form_id UUID,
  order_id UUID,

  -- Event Properties (JSONB for flexibility)
  properties JSONB DEFAULT '{}',

  -- Device & Location
  device_type VARCHAR(20),
  browser_name VARCHAR(100),
  os_name VARCHAR(100),
  ip_address INET,
  country VARCHAR(100),
  city VARCHAR(100),

  -- Referrer & Attribution
  referrer TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_content VARCHAR(255),
  utm_term VARCHAR(255),

  -- Session Info
  page_url TEXT,
  page_title VARCHAR(255),
  time_on_page_seconds INTEGER,
  scroll_depth_percentage INTEGER,
  session_duration_seconds INTEGER,

  -- Timestamps
  timestamp TIMESTAMPTZ NOT NULL,
  server_timestamp TIMESTAMPTZ DEFAULT NOW(),

  -- Integration Flags
  sent_to_analytics BOOLEAN DEFAULT false,
  sent_to_ai BOOLEAN DEFAULT false,
  sent_to_pubsub BOOLEAN DEFAULT false,

  -- Data Retention
  retention_policy VARCHAR(10) CHECK (retention_policy IN ('hot', 'warm', 'cold')),
  archived_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partition by month for performance
CREATE TABLE events.user_events_2025_11 PARTITION OF events.user_events
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

CREATE TABLE events.user_events_2025_12 PARTITION OF events.user_events
  FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- Indexes
CREATE INDEX idx_events_user ON events.user_events(user_id, timestamp DESC);
CREATE INDEX idx_events_session ON events.user_events(session_id);
CREATE INDEX idx_events_journey ON events.user_events(journey_id);
CREATE INDEX idx_events_type ON events.user_events(event_type, timestamp DESC);
CREATE INDEX idx_events_product ON events.user_events(product_id) WHERE product_id IS NOT NULL;
CREATE INDEX idx_events_timestamp ON events.user_events(timestamp DESC);
```

### 3.6 CRM Schema

```sql
CREATE TABLE crm.customer_profiles (
  user_id UUID PRIMARY KEY REFERENCES core.users(id) ON DELETE CASCADE,

  -- Health Score (AI-calculated nightly)
  health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
  health_trend VARCHAR(20) CHECK (health_trend IN ('improving', 'stable', 'declining')),

  -- Lifecycle Stage
  stage VARCHAR(20) CHECK (stage IN ('prospect', 'new', 'active', 'at_risk', 'churned', 'win_back')),
  stage_changed_at TIMESTAMPTZ,

  -- Communication History
  total_emails_sent INTEGER DEFAULT 0,
  email_open_rate DECIMAL(5,4),
  email_click_rate DECIMAL(5,4),
  last_email_opened_at TIMESTAMPTZ,

  total_sms_sent INTEGER DEFAULT 0,
  sms_click_rate DECIMAL(5,4),
  last_sms_clicked_at TIMESTAMPTZ,

  total_telegram_messages INTEGER DEFAULT 0,
  telegram_engaged BOOLEAN DEFAULT false,

  -- Support
  support_tickets_count INTEGER DEFAULT 0,
  open_tickets_count INTEGER DEFAULT 0,
  avg_resolution_time_hours DECIMAL(8,2),
  last_ticket_at TIMESTAMPTZ,

  -- Engagement
  last_active_at TIMESTAMPTZ,
  days_inactive INTEGER DEFAULT 0,
  engagement_score INTEGER CHECK (engagement_score BETWEEN 0 AND 100),

  -- AI Recommendations
  next_best_action TEXT,
  predicted_churn_date DATE,
  retention_strategy TEXT,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crm_health ON crm.customer_profiles(health_score DESC);
CREATE INDEX idx_crm_stage ON crm.customer_profiles(stage);
CREATE INDEX idx_crm_at_risk ON crm.customer_profiles(stage) WHERE stage = 'at_risk';

CREATE TABLE crm.communication_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,

  -- Communication Details
  channel VARCHAR(20) CHECK (channel IN ('email', 'sms', 'telegram', 'whatsapp', 'phone')),
  direction VARCHAR(10) CHECK (direction IN ('outbound', 'inbound')),
  campaign_id VARCHAR(255),

  -- Content
  subject VARCHAR(500),
  content TEXT,
  template_id VARCHAR(255),

  -- Engagement
  sent BOOLEAN DEFAULT false,
  delivered BOOLEAN DEFAULT false,
  opened BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,

  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,

  -- Link Tracking
  links_clicked TEXT[] DEFAULT '{}',

  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comm_log_user ON crm.communication_log(user_id, sent_at DESC);
CREATE INDEX idx_comm_log_campaign ON crm.communication_log(campaign_id);
CREATE INDEX idx_comm_log_channel ON crm.communication_log(channel, sent_at DESC);
```

---

## 4. AI Gateway Microservice

**Purpose:** Provider-agnostic AI interface with fallback, usage tracking, and cost control.

```python
# ai-gateway/main.py
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import google.generativeai as genai
import openai
from anthropic import Anthropic
import redis
import hashlib
import json

app = FastAPI(title="NATI AI Gateway")

# Initialize clients
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
openai.api_key = os.getenv("OPENAI_API_KEY")
anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Redis for caching
redis_client = redis.Redis(host='redis', port=6379, db=0)

# ============================================
# Provider Configuration
# ============================================
PROVIDERS = {
    "gemini": {
        "priority": 1,
        "models": {
            "chat": "gemini-2.0-flash-exp",
            "embedding": "text-embedding-004",
            "vision": "gemini-2.0-flash-exp"
        },
        "rate_limit": 60,  # requests per minute
        "cost_per_1k_tokens": 0.00015  # INR
    },
    "openai": {
        "priority": 2,
        "models": {
            "chat": "gpt-4o-mini",
            "embedding": "text-embedding-3-small",
            "vision": "gpt-4o-mini"
        },
        "rate_limit": 100,
        "cost_per_1k_tokens": 0.005
    },
    "anthropic": {
        "priority": 3,
        "models": {
            "chat": "claude-3-5-sonnet-20241022"
        },
        "rate_limit": 50,
        "cost_per_1k_tokens": 0.01
    }
}

# ============================================
# Request Models
# ============================================
class ChatRequest(BaseModel):
    messages: List[dict]
    user_id: Optional[str] = None
    provider: str = "gemini"  # Default provider
    temperature: float = 0.7
    max_tokens: int = 1000
    use_cache: bool = True

class EmbeddingRequest(BaseModel):
    text: str
    provider: str = "gemini"
    use_cache: bool = True

class VisionRequest(BaseModel):
    image_url: str
    prompt: str
    provider: str = "gemini"
    use_cache: bool = True

# ============================================
# Chat Completion
# ============================================
@app.post("/ai/chat")
async def chat_completion(request: ChatRequest):
    """
    Route chat requests to configured provider with fallback.
    """
    # Check cache
    if request.use_cache:
        cache_key = f"chat:{hashlib.md5(json.dumps(request.messages).encode()).hexdigest()}"
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached)

    # Try primary provider
    try:
        response = await _call_provider_chat(request.provider, request)

        # Cache response
        if request.use_cache:
            redis_client.setex(cache_key, 3600, json.dumps(response))  # 1 hour

        # Track usage
        await track_usage(request.provider, "chat", response["usage"])

        return response

    except Exception as e:
        # Fallback to next provider
        next_provider = _get_fallback_provider(request.provider)
        if next_provider:
            return await chat_completion(ChatRequest(**{**request.dict(), "provider": next_provider}))
        else:
            raise HTTPException(status_code=500, detail=f"All providers failed: {str(e)}")

async def _call_provider_chat(provider: str, request: ChatRequest):
    if provider == "gemini":
        model = genai.GenerativeModel(PROVIDERS["gemini"]["models"]["chat"])
        response = model.generate_content(
            [msg["content"] for msg in request.messages],
            generation_config=genai.types.GenerationConfig(
                temperature=request.temperature,
                max_output_tokens=request.max_tokens
            )
        )
        return {
            "provider": "gemini",
            "content": response.text,
            "usage": {
                "input_tokens": response.usage_metadata.prompt_token_count,
                "output_tokens": response.usage_metadata.candidates_token_count,
                "total_tokens": response.usage_metadata.total_token_count
            }
        }

    elif provider == "openai":
        response = openai.chat.completions.create(
            model=PROVIDERS["openai"]["models"]["chat"],
            messages=request.messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        return {
            "provider": "openai",
            "content": response.choices[0].message.content,
            "usage": {
                "input_tokens": response.usage.prompt_tokens,
                "output_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
        }

    elif provider == "anthropic":
        response = anthropic.messages.create(
            model=PROVIDERS["anthropic"]["models"]["chat"],
            messages=request.messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        return {
            "provider": "anthropic",
            "content": response.content[0].text,
            "usage": {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
                "total_tokens": response.usage.input_tokens + response.usage.output_tokens
            }
        }

# ============================================
# Embeddings
# ============================================
@app.post("/ai/embeddings")
async def create_embedding(request: EmbeddingRequest):
    """
    Generate text embeddings with caching.
    """
    # Check cache
    if request.use_cache:
        cache_key = f"embedding:{hashlib.md5(request.text.encode()).hexdigest()}"
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached)

    try:
        if request.provider == "gemini":
            result = genai.embed_content(
                model=PROVIDERS["gemini"]["models"]["embedding"],
                content=request.text,
                task_type="retrieval_document"
            )
            embedding = result['embedding']

        elif request.provider == "openai":
            result = openai.embeddings.create(
                model=PROVIDERS["openai"]["models"]["embedding"],
                input=request.text
            )
            embedding = result.data[0].embedding

        response = {
            "provider": request.provider,
            "embedding": embedding,
            "dimensions": len(embedding)
        }

        # Cache
        if request.use_cache:
            redis_client.setex(cache_key, 86400, json.dumps(response))  # 24 hours

        # Track usage
        await track_usage(request.provider, "embedding", {"tokens": len(request.text.split())})

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# Vision
# ============================================
@app.post("/ai/vision")
async def analyze_image(request: VisionRequest):
    """
    Analyze image with vision model.
    """
    # Check cache
    if request.use_cache:
        cache_key = f"vision:{hashlib.md5(f'{request.image_url}:{request.prompt}'.encode()).hexdigest()}"
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached)

    try:
        if request.provider == "gemini":
            model = genai.GenerativeModel(PROVIDERS["gemini"]["models"]["vision"])

            # Download image
            import requests
            from PIL import Image
            from io import BytesIO

            response_img = requests.get(request.image_url)
            img = Image.open(BytesIO(response_img.content))

            response = model.generate_content([request.prompt, img])
            result = {
                "provider": "gemini",
                "analysis": response.text,
                "usage": {
                    "input_tokens": response.usage_metadata.prompt_token_count,
                    "output_tokens": response.usage_metadata.candidates_token_count
                }
            }

        elif request.provider == "openai":
            response = openai.chat.completions.create(
                model=PROVIDERS["openai"]["models"]["vision"],
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": request.prompt},
                            {"type": "image_url", "image_url": {"url": request.image_url}}
                        ]
                    }
                ]
            )
            result = {
                "provider": "openai",
                "analysis": response.choices[0].message.content,
                "usage": {
                    "input_tokens": response.usage.prompt_tokens,
                    "output_tokens": response.usage.completion_tokens
                }
            }

        # Cache
        if request.use_cache:
            redis_client.setex(cache_key, 86400, json.dumps(result))  # 24 hours

        # Track usage
        await track_usage(request.provider, "vision", result["usage"])

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# Usage Tracking
# ============================================
async def track_usage(provider: str, operation: str, usage: dict):
    """
    Track API usage for cost monitoring.
    """
    # Store in PostgreSQL for analytics
    import asyncpg

    conn = await asyncpg.connect(os.getenv("DATABASE_URL"))
    await conn.execute("""
        INSERT INTO ai.usage_log (provider, operation, tokens_input, tokens_output, total_tokens, cost_inr, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
    """,
        provider,
        operation,
        usage.get("input_tokens", 0),
        usage.get("output_tokens", 0),
        usage.get("total_tokens", 0),
        calculate_cost(provider, usage.get("total_tokens", 0))
    )
    await conn.close()

def calculate_cost(provider: str, tokens: int) -> float:
    cost_per_1k = PROVIDERS[provider]["cost_per_1k_tokens"]
    return (tokens / 1000) * cost_per_1k

def _get_fallback_provider(current_provider: str) -> Optional[str]:
    """
    Get next provider by priority.
    """
    current_priority = PROVIDERS[current_provider]["priority"]
    fallbacks = sorted(
        [(k, v) for k, v in PROVIDERS.items() if v["priority"] > current_priority],
        key=lambda x: x[1]["priority"]
    )
    return fallbacks[0][0] if fallbacks else None

# ============================================
# Health & Monitoring
# ============================================
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "providers": {
            name: {"available": await check_provider(name)}
            for name in PROVIDERS.keys()
        }
    }

async def check_provider(provider: str) -> bool:
    """
    Check if provider is responding.
    """
    try:
        if provider == "gemini":
            genai.list_models()
            return True
        # Add checks for other providers
        return True
    except:
        return False

@app.get("/usage/summary")
async def usage_summary():
    """
    Get usage summary for cost tracking.
    """
    import asyncpg

    conn = await asyncpg.connect(os.getenv("DATABASE_URL"))
    rows = await conn.fetch("""
        SELECT provider, operation,
               SUM(total_tokens) as total_tokens,
               SUM(cost_inr) as total_cost,
               COUNT(*) as request_count
        FROM ai.usage_log
        WHERE timestamp >= NOW() - INTERVAL '24 hours'
        GROUP BY provider, operation
    """)
    await conn.close()

    return [dict(row) for row in rows]
```

---

## 5. Event Router with Feature Engineering

```python
# event-router/main.py
from google.cloud import pubsub_v1
import json
import redis

publisher = pubsub_v1.PublisherClient()
redis_client = redis.Redis()

# Topic paths
PROJECT_ID = "nati-commerce"
TOPICS = {
    "postgres": f"projects/{PROJECT_ID}/topics/nati-events-postgres",
    "bigquery": f"projects/{PROJECT_ID}/topics/nati-events-bigquery",
    "ai": f"projects/{PROJECT_ID}/topics/nati-events-ai",
    "crm": f"projects/{PROJECT_ID}/topics/nati-events-crm"
}

def route_event(event: dict):
    """
    Route events to appropriate topics with feature engineering.
    """
    # Deduplicate (5min window)
    event_id = event.get("id")
    dedup_key = f"event:{event_id}"
    if redis_client.exists(dedup_key):
        return  # Already processed
    redis_client.setex(dedup_key, 300, "1")  # 5 minutes

    # Feature engineering
    if event["event_type"] in ["product_viewed", "add_to_cart", "wishlist"]:
        enrich_product_event(event)

    if event["event_type"] in ["checkout_started", "checkout_completed"]:
        enrich_checkout_event(event)

    # Route to multiple sinks
    publisher.publish(TOPICS["postgres"], json.dumps(event).encode())
    publisher.publish(TOPICS["bigquery"], json.dumps(event).encode())

    # AI-relevant events
    if event["event_category"] in ["product", "ai"]:
        publisher.publish(TOPICS["ai"], json.dumps(event).encode())

    # CRM-relevant events
    if event["event_category"] in ["engagement", "checkout"]:
        publisher.publish(TOPICS["crm"], json.dumps(event).encode())

def enrich_product_event(event: dict):
    """
    Add computed features for product events.
    """
    user_id = event.get("user_id")
    product_id = event.get("product_id")

    if user_id and product_id:
        # Compute art interest score
        art_form_id = get_product_art_form(product_id)
        if art_form_id:
            event["properties"]["art_interest_score"] = compute_art_interest(user_id, art_form_id)

        # Time on product
        session_id = event["session_id"]
        last_view = redis_client.get(f"session:{session_id}:last_product")
        if last_view:
            time_diff = event["timestamp"] - float(last_view)
            event["properties"]["time_since_last_view"] = time_diff

def enrich_checkout_event(event: dict):
    """
    Add computed features for checkout events.
    """
    user_id = event.get("user_id")

    if user_id:
        # Compute urgency score
        event["properties"]["urgency_score"] = compute_urgency_score(user_id)

        # Drop engagement score
        drop_id = event.get("drop_id")
        if drop_id:
            event["properties"]["drop_engagement_score"] = compute_drop_engagement(user_id, drop_id)

def compute_art_interest(user_id: str, art_form_id: str) -> float:
    """
    Calculate user's interest in specific art form (0-1).
    """
    # Query from PostgreSQL or cache
    # (views + purchases + time_spent) / max_possible
    return 0.75  # Placeholder

def compute_urgency_score(user_id: str) -> float:
    """
    Calculate purchase urgency (0-1).
    """
    # Based on: cart abandonment history, time in session, drop countdown
    return 0.6  # Placeholder

def compute_drop_engagement(user_id: str, drop_id: str) -> float:
    """
    Calculate user engagement with specific drop (0-1).
    """
    # (waitlist joined + pre-access used + product views) / max_possible
    return 0.8  # Placeholder
```

---

## 6. Consolidated vs Modular Comparison

| Component | v1.2 Consolidated | Semi-Modular | Best-of-Breed (v1.1) |
|-----------|-------------------|--------------|----------------------|
| **Vector Storage** | pgvector in PostgreSQL | pgvector | Pinecone |
| **Search** | PostgreSQL full-text | Typesense/Meilisearch | Algolia/Elastic |
| **Graph** | SQL joins + materialized views | Deferred | Neo4j |
| **Vision** | Gemini Vision | Gemini Vision | OpenAI CLIP |
| **Embeddings** | Gemini text-embedding-004 | Gemini | OpenAI + Gemini |
| **LLM** | Gemini (via AI Gateway) | Gemini (via AI Gateway) | Multi-provider |
| **Cost (12mo)** | ₹40-90k/mo | ₹60-120k/mo | ₹150-250k/mo |
| **Ops Complexity** | Low | Medium | High |
| **Time to MVP** | 6-8 weeks | 8-10 weeks | 12-16 weeks |
| **Scalability** | Good (with tuning) | Very Good | Excellent |

---

## 7. Cost Breakdown (12 Months, INR)

### v1.2 Consolidated Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ MONTHLY COSTS (Early Stage - Months 1-6)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Infrastructure:                                              │
│   Vercel (Frontend)                      ₹8,000 - ₹12,000  │
│   Cloudflare (CDN + Workers)             ₹2,000 - ₹5,000   │
│   Google Cloud SQL (PostgreSQL)          ₹12,000 - ₹20,000 │
│   Google Cloud Memorystore (Redis)       ₹5,000 - ₹8,000   │
│   Google Cloud Storage                   ₹1,000 - ₹3,000   │
│   Google Cloud Run (AI Gateway + APIs)   ₹3,000 - ₹6,000   │
│                                                              │
│ AI & Data:                                                   │
│   Gemini API (LLM + Vision + Embeddings) ₹10,000 - ₹25,000 │
│   BigQuery (storage + queries)           ₹3,000 - ₹8,000   │
│   Pub/Sub (event streaming)              ₹1,000 - ₹2,000   │
│                                                              │
│ SaaS Services:                                               │
│   Sanity CMS                             ₹2,000 - ₹6,000   │
│   Klaviyo (email marketing)              ₹3,000 - ₹8,000   │
│   Gupshup (SMS)                          ₹2,000 - ₹5,000   │
│   Sentry (error tracking)                ₹1,000 - ₹2,000   │
│                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ TOTAL (Early Stage):             ₹53,000 - ₹110,000/month  │
│ AVERAGE:                                 ~₹75,000/month     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│ 12-Month Total:                          ₹6.5L - ₹13L      │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SCALING COSTS (Months 7-12, 50K users/month)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Infrastructure:                   ₹30,000 - ₹50,000/month  │
│ AI & Data:                        ₹40,000 - ₹80,000/month  │
│ SaaS Services:                    ₹15,000 - ₹30,000/month  │
│                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ TOTAL (Scaling):                 ₹85,000 - ₹160,000/month  │
│ AVERAGE:                                ~₹120,000/month     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
└─────────────────────────────────────────────────────────────┘
```

**Cost Control Strategies:**
1. **AI Gateway** - Cache responses (3 hour TTL), deduplicate requests
2. **BigQuery** - Partition tables, use clustering, set query budgets
3. **Pub/Sub** - Batch messages, compress payloads
4. **Gemini** - Use Flash model (cheaper), enable response streaming
5. **Cloudflare** - Cache static assets, precompute story pages

---

## 8. Migration Path (Consolidated → Modular)

```
Phase 1: Consolidated (v1.2)         [Months 1-6]
┌──────────────────────────────────────────────┐
│ PostgreSQL + pgvector                         │
│ Gemini (via AI Gateway)                       │
│ SQL-based queries                             │
│ Pub/Sub event router                          │
│ BigQuery (nightly ETL)                        │
└──────────────────────────────────────────────┘
                    ↓
           When to migrate?
    - pgvector queries slow (>500ms p95)
    - Search needs advanced features
    - Graph queries too complex
                    ↓
Phase 2: Semi-Modular                [Months 7-12]
┌──────────────────────────────────────────────┐
│ PostgreSQL + pgvector                         │
│ + Typesense (search)  ← UPGRADE              │
│ Gemini (via AI Gateway)                       │
│ SQL + materialized views                      │
│ Pub/Sub + BigQuery                            │
└──────────────────────────────────────────────┘
                    ↓
           When to migrate?
    - 100K+ products with complex attributes
    - Need graph algorithms (PageRank, etc.)
    - Multi-hop queries common
                    ↓
Phase 3: Best-of-Breed              [Year 2+]
┌──────────────────────────────────────────────┐
│ PostgreSQL (transactions)                     │
│ + Pinecone (vectors)          ← UPGRADE      │
│ + Neo4j (knowledge graph)     ← UPGRADE      │
│ + Algolia (search)            ← UPGRADE      │
│ Multi-provider AI (via Gateway)               │
│ Pub/Sub + BigQuery + Dataflow                 │
└──────────────────────────────────────────────┘
```

**Migration is Painless Because:**
1. **AI Gateway** - Swap providers without code changes
2. **Event Router** - Add new consumers (Neo4j, Pinecone) without touching producers
3. **BigQuery** - Already has full historical data for backfill
4. **API Contracts** - GraphQL/REST stable, backends swappable

---

## 9. 6-Sprint Implementation Roadmap (12 Weeks)

### Sprint 1 (Weeks 1-2): Foundation
**Goal:** Working database + authentication + basic API

**Tasks:**
- [ ] Set up Google Cloud project + Terraform
- [ ] Create PostgreSQL database (AlloyDB or Cloud SQL)
- [ ] Implement Prisma schema (core, cultural, drops, events)
- [ ] Enable pgvector extension
- [ ] Set up Medusa.js with custom models
- [ ] Implement authentication (JWT + sessions)
- [ ] Deploy to Cloud Run
- [ ] Set up Sanity CMS

**Deliverables:**
- Working API (products, orders, users)
- Admin panel (Medusa Admin)
- Database seeded with sample data

---

### Sprint 2 (Weeks 3-4): Event Router + AI Gateway
**Goal:** Event pipeline + AI foundation

**Tasks:**
- [ ] Set up Google Pub/Sub topics & subscriptions
- [ ] Implement event router (Cloud Functions)
- [ ] Build AI Gateway (FastAPI)
  - [ ] Gemini integration (chat, vision, embeddings)
  - [ ] OpenAI fallback
  - [ ] Caching with Redis
  - [ ] Usage tracking
- [ ] Create user_events table with partitioning
- [ ] Implement GA4 + Meta Pixel integration
- [ ] Set up Redis (Memorystore)

**Deliverables:**
- Event ingestion API
- AI Gateway deployed
- Basic recommendation engine (hot products)

---

### Sprint 3 (Weeks 5-6): Frontend + CMS Integration
**Goal:** Launch-ready storefront

**Tasks:**
- [ ] Next.js 15 project setup (Vercel)
- [ ] Product listing page (with filters)
- [ ] Product detail page (with story from CMS)
- [ ] Shopping cart (Redis-backed)
- [ ] Checkout flow (Razorpay integration)
- [ ] Drop landing page template
- [ ] Artist profile page
- [ ] Art form story page
- [ ] Responsive design (mobile-first)
- [ ] Cloudflare CDN setup

**Deliverables:**
- Fully functional storefront
- Mobile-optimized
- Story pages powered by Sanity

---

### Sprint 4 (Weeks 7-8): Drop System + NATI Circle
**Goal:** Drop management + loyalty

**Tasks:**
- [ ] Drop management admin UI
- [ ] Waitlist system
- [ ] Pre-access for NATI Circle tiers
- [ ] Real-time countdown (WebSockets)
- [ ] NATI Circle loyalty system
  - [ ] Points calculation
  - [ ] Tier management
  - [ ] Achievements & badges
- [ ] Email notifications (Klaviyo)
- [ ] SMS notifications (Gupshup)
- [ ] Artist follow feature

**Deliverables:**
- Complete drop lifecycle
- Loyalty program live
- Notification system working

---

### Sprint 5 (Weeks 9-10): AI Features + CRM
**Goal:** Intelligent recommendations + customer insights

**Tasks:**
- [ ] Embed all products (Gemini embeddings → pgvector)
- [ ] Similarity search (HNSW index)
- [ ] Hybrid recommendation engine
  - [ ] Collaborative filtering
  - [ ] Content-based
  - [ ] Visual similarity
- [ ] AI chatbot (Gemini + LangChain)
- [ ] CRM microservice
  - [ ] Customer health scores
  - [ ] Lifecycle stages
  - [ ] Communication log
- [ ] BigQuery ETL (nightly)
  - [ ] Fact tables
  - [ ] Dimension tables
  - [ ] Aggregations

**Deliverables:**
- Personalized recommendations
- AI stylist chatbot
- CRM dashboard
- BigQuery analytics

---

### Sprint 6 (Weeks 11-12): Polish + Launch Prep
**Goal:** Production-ready for Drop 1

**Tasks:**
- [ ] Performance optimization
  - [ ] Query optimization
  - [ ] Caching strategy
  - [ ] Image optimization
- [ ] Edge caching (Cloudflare Workers)
  - [ ] Story pages cached
  - [ ] Product cards precomputed
  - [ ] Journey-aware recs in KV
- [ ] Monitoring & alerting
  - [ ] Sentry error tracking
  - [ ] Google Cloud Monitoring
  - [ ] Cost alerts
  - [ ] Usage dashboards
- [ ] Security audit
  - [ ] Rate limiting
  - [ ] Input validation
  - [ ] SQL injection prevention
- [ ] Load testing
- [ ] Documentation
- [ ] Launch checklist

**Deliverables:**
- Production-ready platform
- Monitoring dashboards
- Launch playbook
- 🚀 **Ready for Drop 1!**

---

## 10. Key Takeaways

### Why v1.2 Consolidated is Best for NATI Now:

✅ **Speed to Market:** 12 weeks to launch vs 16+ weeks
✅ **Cost Effective:** ₹75k/mo vs ₹150k+/mo
✅ **Operationally Simple:** 6-8 services vs 15-20
✅ **AI-Native:** Full AI capabilities with Gemini Brain
✅ **Future-Proof:** AI Gateway + BigQuery enable painless migration
✅ **Risk Mitigation:** Provider fallback, caching, cost controls

### When to Graduate to Semi-Modular:

- Search quality becomes critical (typo tolerance, autocomplete)
- Need advanced faceting or multi-tenancy
- Traffic scales beyond PostgreSQL capacity

### When to Graduate to Best-of-Breed:

- 100K+ products with complex queries
- Need graph algorithms (PageRank, community detection)
- Multi-region deployment
- Enterprise SLAs

---

## 11. Final Recommendation

**Adopt v1.2 Consolidated Architecture NOW.**

**With Two Critical Guardrails:**
1. **AI Gateway** - Ensures provider flexibility
2. **BigQuery** - Safety net for analytics + training

**Start Building:**
1. Sprint 1: Foundation (database + API)
2. Sprint 2: Event Router + AI Gateway
3. Sprint 3: Frontend + CMS
4. Sprint 4: Drop System + Loyalty
5. Sprint 5: AI Features + CRM
6. Sprint 6: Polish + Launch

**12 weeks → Drop 1 Launch → NATI goes live! 🚀**

Ready to start implementation?
