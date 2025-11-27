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
CREATE SCHEMA analytics;      -- Analytics & conversion tracking
CREATE SCHEMA experiments;    -- A/B testing framework
CREATE SCHEMA marketing;      -- Marketing automation
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

### 3.7 Analytics Schema (Conversion & Attribution)

```sql
-- ============================================
-- CONVERSION FUNNELS
-- ============================================
CREATE TABLE analytics.conversion_funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL,
  journey_id VARCHAR(255),
  funnel_type VARCHAR(50) CHECK (funnel_type IN ('purchase', 'drop_waitlist', 'artist_follow', 'newsletter_signup')),

  -- Funnel Steps with Timestamps
  step_1_awareness_at TIMESTAMPTZ,        -- Landing/Product view
  step_2_interest_at TIMESTAMPTZ,         -- Scroll >50%, time >30s
  step_3_consideration_at TIMESTAMPTZ,    -- Multiple views, size guide, story read
  step_4_intent_at TIMESTAMPTZ,           -- Add to cart, join waitlist
  step_5_action_at TIMESTAMPTZ,           -- Checkout start, form fill
  step_6_conversion_at TIMESTAMPTZ,       -- Purchase complete, signup complete

  -- Drop-off Analysis
  dropped_at_step INTEGER,
  drop_reason VARCHAR(100),               -- 'price', 'shipping', 'payment_error', 'stock', 'other'
  drop_reason_detail TEXT,

  -- Context
  product_id UUID,
  drop_id UUID,
  source_channel VARCHAR(50),
  device_type VARCHAR(20),

  -- Timing
  total_time_to_convert_seconds INTEGER,
  time_at_each_step INTEGER[],            -- Array of seconds at each step

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_funnel_user ON analytics.conversion_funnels(user_id);
CREATE INDEX idx_funnel_session ON analytics.conversion_funnels(session_id);
CREATE INDEX idx_funnel_dropped ON analytics.conversion_funnels(dropped_at_step);
CREATE INDEX idx_funnel_product ON analytics.conversion_funnels(product_id);
CREATE INDEX idx_funnel_type ON analytics.conversion_funnels(funnel_type, created_at DESC);

-- ============================================
-- ATTRIBUTION TOUCHPOINTS (Multi-Touch Attribution)
-- ============================================
CREATE TABLE analytics.attribution_touchpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES core.orders(id) ON DELETE CASCADE,

  -- Touchpoint Details
  touchpoint_number INTEGER,              -- 1, 2, 3... (chronological)
  total_touchpoints INTEGER,              -- Total in journey

  -- Channel Attribution
  channel VARCHAR(50),                    -- 'organic_social', 'paid_search', 'email', 'direct', 'telegram'
  channel_category VARCHAR(50),           -- 'paid', 'organic', 'owned', 'earned'
  campaign_name VARCHAR(255),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_content VARCHAR(255),
  utm_term VARCHAR(255),

  -- Timing
  touchpoint_at TIMESTAMPTZ NOT NULL,
  days_before_conversion DECIMAL(8,2),
  hours_before_conversion DECIMAL(8,2),

  -- Attribution Credits (Multiple Models)
  credit_last_touch DECIMAL(5,4) DEFAULT 0,      -- 1.0 for last touch, 0 for others
  credit_first_touch DECIMAL(5,4) DEFAULT 0,     -- 1.0 for first touch, 0 for others
  credit_linear DECIMAL(5,4) DEFAULT 0,          -- 1/N for all N touches
  credit_time_decay DECIMAL(5,4) DEFAULT 0,      -- Exponential decay (more recent = more credit)
  credit_position_based DECIMAL(5,4) DEFAULT 0,  -- 40% first, 40% last, 20% middle
  credit_data_driven DECIMAL(5,4) DEFAULT 0,     -- ML-based attribution (calculated nightly)

  -- Revenue Attribution
  attributed_revenue_last_touch DECIMAL(12,2),
  attributed_revenue_linear DECIMAL(12,2),
  attributed_revenue_time_decay DECIMAL(12,2),
  attributed_revenue_data_driven DECIMAL(12,2),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attribution_user ON analytics.attribution_touchpoints(user_id);
CREATE INDEX idx_attribution_order ON analytics.attribution_touchpoints(order_id);
CREATE INDEX idx_attribution_channel ON analytics.attribution_touchpoints(channel);
CREATE INDEX idx_attribution_touchpoint_at ON analytics.attribution_touchpoints(touchpoint_at DESC);

-- Materialized View: Channel Performance by Attribution Model
CREATE MATERIALIZED VIEW analytics.mv_channel_performance AS
SELECT
  channel,
  DATE_TRUNC('day', touchpoint_at) as date,
  COUNT(DISTINCT order_id) as attributed_orders,
  COUNT(DISTINCT user_id) as attributed_users,
  SUM(attributed_revenue_last_touch) as revenue_last_touch,
  SUM(attributed_revenue_linear) as revenue_linear,
  SUM(attributed_revenue_time_decay) as revenue_time_decay,
  SUM(attributed_revenue_data_driven) as revenue_data_driven
FROM analytics.attribution_touchpoints
GROUP BY channel, date;

CREATE INDEX idx_mv_channel_date ON analytics.mv_channel_performance(date DESC);
```

### 3.8 Experiments Schema (A/B Testing)

```sql
-- ============================================
-- A/B TESTS
-- ============================================
CREATE TABLE experiments.ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  hypothesis TEXT,

  -- Test Configuration
  test_type VARCHAR(50) CHECK (test_type IN ('UI', 'pricing', 'email', 'recommendation', 'checkout', 'personalization')),

  -- Variants Configuration (JSONB)
  variants JSONB NOT NULL,                -- [{"name": "control", "config": {...}}, {"name": "variant_a", "config": {...}}]
  traffic_split JSONB NOT NULL,           -- {"control": 0.5, "variant_a": 0.5}

  -- Targeting
  audience_filter JSONB,                  -- {"segment": "new_users", "country": "India", "ltv_segment": "high_value"}

  -- Metrics
  primary_metric VARCHAR(100) NOT NULL,   -- 'conversion_rate', 'aov', 'engagement_time', 'click_rate'
  secondary_metrics TEXT[] DEFAULT '{}',
  minimum_detectable_effect DECIMAL(5,4), -- 0.05 = 5% improvement
  confidence_level DECIMAL(5,4) DEFAULT 0.95,

  -- Sample Size & Duration
  minimum_sample_size INTEGER,
  expected_duration_days INTEGER,

  -- Status
  status VARCHAR(20) CHECK (status IN ('draft', 'running', 'paused', 'completed', 'winner_declared', 'inconclusive')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,

  -- Results
  winner_variant VARCHAR(100),
  statistical_significance DECIMAL(5,4),  -- p-value
  results_summary JSONB,                  -- Detailed results per variant

  -- Metadata
  created_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ab_tests_status ON experiments.ab_tests(status);
CREATE INDEX idx_ab_tests_started ON experiments.ab_tests(started_at DESC);

-- ============================================
-- A/B TEST ASSIGNMENTS
-- ============================================
CREATE TABLE experiments.ab_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES experiments.ab_tests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  variant VARCHAR(100) NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(test_id, user_id)
);

CREATE INDEX idx_ab_assignments_test ON experiments.ab_assignments(test_id, variant);
CREATE INDEX idx_ab_assignments_user ON experiments.ab_assignments(user_id);

-- ============================================
-- A/B TEST EVENTS
-- ============================================
CREATE TABLE experiments.ab_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES experiments.ab_tests(id) ON DELETE CASCADE,
  user_id UUID,
  variant VARCHAR(100) NOT NULL,

  -- Event Details
  event_type VARCHAR(100) NOT NULL,       -- 'impression', 'click', 'conversion', 'engagement'
  metric_name VARCHAR(100),               -- Maps to primary/secondary metrics
  metric_value DECIMAL(12,4),             -- Numeric value (revenue, time, count, etc.)

  -- Context
  session_id VARCHAR(255),
  product_id UUID,

  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ab_events_test ON experiments.ab_events(test_id, event_type);
CREATE INDEX idx_ab_events_variant ON experiments.ab_events(test_id, variant);
CREATE INDEX idx_ab_events_timestamp ON experiments.ab_events(timestamp DESC);

-- Materialized View: A/B Test Results Summary
CREATE MATERIALIZED VIEW experiments.mv_test_results AS
SELECT
  ae.test_id,
  ae.variant,
  COUNT(DISTINCT ae.user_id) as users,
  COUNT(*) FILTER (WHERE ae.event_type = 'impression') as impressions,
  COUNT(*) FILTER (WHERE ae.event_type = 'click') as clicks,
  COUNT(*) FILTER (WHERE ae.event_type = 'conversion') as conversions,
  AVG(ae.metric_value) FILTER (WHERE ae.event_type = 'conversion') as avg_metric_value,
  SUM(ae.metric_value) FILTER (WHERE ae.event_type = 'conversion') as total_metric_value,
  (COUNT(*) FILTER (WHERE ae.event_type = 'conversion')::DECIMAL /
   NULLIF(COUNT(DISTINCT ae.user_id), 0)) as conversion_rate
FROM experiments.ab_events ae
GROUP BY ae.test_id, ae.variant;

CREATE INDEX idx_mv_test_results_test ON experiments.mv_test_results(test_id);
```

### 3.9 Marketing Automation Schema

```sql
-- ============================================
-- AUTOMATION RULES
-- ============================================
CREATE TABLE marketing.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Trigger Conditions
  trigger_event VARCHAR(100) NOT NULL,    -- 'cart_abandoned', 'drop_launched', 'order_delivered', 'user_inactive'
  trigger_filters JSONB,                  -- {"cart_value": {"min": 1000}, "segment": "vip", "days_inactive": {"min": 7}}

  -- Actions (Sequential Workflow)
  actions JSONB NOT NULL,  -- [
                           --   {"type": "send_email", "delay_minutes": 120, "template_id": "cart_abandon_v2", "personalization": {...}},
                           --   {"type": "send_sms", "delay_minutes": 1440, "template_id": "cart_final_reminder"}
                           -- ]

  -- AI Optimization
  ai_optimized BOOLEAN DEFAULT false,     -- Let AI choose timing/content/channel
  ai_model_id VARCHAR(100),
  optimization_metric VARCHAR(50),        -- 'conversion_rate', 'revenue', 'engagement'

  -- Frequency Capping
  max_triggers_per_user_per_day INTEGER DEFAULT 3,
  min_hours_between_triggers INTEGER DEFAULT 24,

  -- Performance Metrics
  times_triggered INTEGER DEFAULT 0,
  times_sent INTEGER DEFAULT 0,
  times_opened INTEGER DEFAULT 0,
  times_clicked INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,4),
  total_revenue DECIMAL(12,2) DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 50,            -- 0-100, higher = execute first

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_automation_trigger ON marketing.automation_rules(trigger_event, is_active);
CREATE INDEX idx_automation_priority ON marketing.automation_rules(priority DESC, is_active);

-- ============================================
-- AUTOMATION EXECUTIONS
-- ============================================
CREATE TABLE marketing.automation_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES marketing.automation_rules(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,

  -- Trigger Context
  trigger_event VARCHAR(100),
  trigger_data JSONB,                     -- Event-specific data

  -- Execution Status
  status VARCHAR(20) CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Actions Executed
  actions_completed INTEGER DEFAULT 0,
  actions_total INTEGER,
  last_action_at TIMESTAMPTZ,

  -- Results
  email_sent BOOLEAN DEFAULT false,
  email_opened BOOLEAN DEFAULT false,
  email_clicked BOOLEAN DEFAULT false,
  sms_sent BOOLEAN DEFAULT false,
  sms_clicked BOOLEAN DEFAULT false,
  converted BOOLEAN DEFAULT false,
  conversion_value DECIMAL(12,2),

  -- Errors
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_automation_exec_rule ON marketing.automation_executions(rule_id);
CREATE INDEX idx_automation_exec_user ON marketing.automation_executions(user_id);
CREATE INDEX idx_automation_exec_status ON marketing.automation_executions(status);
CREATE INDEX idx_automation_exec_created ON marketing.automation_executions(created_at DESC);
```

### 3.10 Enhanced AI Schema (Customer Intelligence)

```sql
-- ============================================
-- CUSTOMER LIFETIME VALUE (CLV)
-- ============================================
CREATE TABLE ai.customer_ltv (
  user_id UUID PRIMARY KEY REFERENCES core.users(id) ON DELETE CASCADE,

  -- Historical Value
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  avg_order_value DECIMAL(10,2),
  first_purchase_date DATE,
  last_purchase_date DATE,
  days_since_first_purchase INTEGER,
  days_since_last_purchase INTEGER,
  purchase_frequency DECIMAL(8,4),        -- Purchases per month

  -- RFM Scores
  recency_score INTEGER CHECK (recency_score BETWEEN 1 AND 5),
  frequency_score INTEGER CHECK (frequency_score BETWEEN 1 AND 5),
  monetary_score INTEGER CHECK (monetary_score BETWEEN 1 AND 5),
  rfm_segment VARCHAR(20),                -- 'Champions', 'Loyal', 'At Risk', 'Hibernating'

  -- Predicted Value (ML Model)
  predicted_ltv_12_months DECIMAL(12,2),
  predicted_ltv_24_months DECIMAL(12,2),
  predicted_ltv_lifetime DECIMAL(12,2),
  prediction_confidence DECIMAL(5,4),

  -- Segmentation
  ltv_segment VARCHAR(20) CHECK (ltv_segment IN ('whale', 'high_value', 'mid_value', 'low_value', 'new')),
  ltv_percentile INTEGER CHECK (ltv_percentile BETWEEN 0 AND 100),

  -- Purchase Patterns
  preferred_categories TEXT[] DEFAULT '{}',
  preferred_art_forms TEXT[] DEFAULT '{}',
  preferred_artists TEXT[] DEFAULT '{}',
  avg_discount_used DECIMAL(5,2),
  price_sensitivity VARCHAR(20) CHECK (price_sensitivity IN ('high', 'medium', 'low')),

  -- Retention Metrics
  retention_probability DECIMAL(5,4),     -- 0-1
  churn_probability DECIMAL(5,4),         -- 0-1
  next_purchase_date_predicted DATE,
  days_until_next_purchase INTEGER,

  -- Marketing Efficiency
  customer_acquisition_cost DECIMAL(10,2),
  ltv_to_cac_ratio DECIMAL(8,2),
  total_marketing_spend DECIMAL(10,2),
  marketing_roi DECIMAL(8,2),

  last_calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ltv_segment ON ai.customer_ltv(ltv_segment);
CREATE INDEX idx_ltv_predicted ON ai.customer_ltv(predicted_ltv_12_months DESC);
CREATE INDEX idx_ltv_percentile ON ai.customer_ltv(ltv_percentile DESC);
CREATE INDEX idx_ltv_rfm ON ai.customer_ltv(rfm_segment);
CREATE INDEX idx_ltv_churn ON ai.customer_ltv(churn_probability DESC);

-- ============================================
-- PRODUCT AFFINITY (Market Basket Analysis)
-- ============================================
CREATE TABLE ai.product_affinity (
  product_a_id UUID REFERENCES core.products(id) ON DELETE CASCADE,
  product_b_id UUID REFERENCES core.products(id) ON DELETE CASCADE,

  -- Co-occurrence Metrics
  times_viewed_together INTEGER DEFAULT 0,
  times_carted_together INTEGER DEFAULT 0,
  times_purchased_together INTEGER DEFAULT 0,

  -- Association Rules (Apriori Algorithm)
  support DECIMAL(8,6),                   -- P(A ∩ B) - How often A and B appear together
  confidence DECIMAL(8,6),                -- P(B|A) - If A bought, probability of B
  lift DECIMAL(8,4),                      -- Confidence / P(B) - How much more likely B is when A is present
  conviction DECIMAL(8,4),                -- (1 - support_B) / (1 - confidence)

  -- Recommendation Strength
  affinity_score DECIMAL(5,4),            -- 0-1 (weighted combination of metrics)
  affinity_type VARCHAR(50),              -- 'complement', 'substitute', 'upgrade', 'cross_category'

  -- Context
  typical_purchase_order VARCHAR(20),     -- 'A_then_B', 'B_then_A', 'simultaneous'
  avg_time_between_purchases_days INTEGER,

  -- Performance Tracking
  recommendation_shown_count INTEGER DEFAULT 0,
  recommendation_click_count INTEGER DEFAULT 0,
  recommendation_conversion_count INTEGER DEFAULT 0,
  recommendation_ctr DECIMAL(5,4),
  recommendation_conversion_rate DECIMAL(5,4),
  recommendation_revenue DECIMAL(12,2) DEFAULT 0,

  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (product_a_id, product_b_id),
  CHECK (product_a_id != product_b_id)
);

CREATE INDEX idx_affinity_score ON ai.product_affinity(affinity_score DESC);
CREATE INDEX idx_affinity_product_a ON ai.product_affinity(product_a_id, affinity_score DESC);
CREATE INDEX idx_affinity_lift ON ai.product_affinity(lift DESC);

-- ============================================
-- CUSTOMER EMBEDDINGS (Behavioral Similarity)
-- ============================================
CREATE TABLE ai.customer_embeddings (
  user_id UUID PRIMARY KEY REFERENCES core.users(id) ON DELETE CASCADE,

  -- Behavioral Embedding (768 dims - Gemini)
  behavior_embedding vector(768),         -- Purchase history + browsing + engagement

  -- Preference Embeddings
  art_preference_embedding vector(768),   -- Art form & artist preferences
  style_preference_embedding vector(768), -- Visual style preferences (colors, patterns)

  -- Journey Embedding
  typical_journey_embedding vector(768),  -- Common paths to purchase

  -- Similarity Cache (Precomputed)
  similar_customers UUID[],               -- Top 10 similar users
  similar_customers_scores DECIMAL(5,4)[], -- Similarity scores

  -- Metadata
  embedding_model VARCHAR(100) DEFAULT 'gemini-text-embedding-004',
  generated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Hot/Cold separation
  is_hot BOOLEAN DEFAULT true,            -- Active customers
  archived_to_bigquery BOOLEAN DEFAULT false
);

CREATE INDEX idx_customer_behavior_embedding ON ai.customer_embeddings
  USING hnsw (behavior_embedding vector_cosine_ops)
  WHERE is_hot = true;

CREATE INDEX idx_customer_art_embedding ON ai.customer_embeddings
  USING hnsw (art_preference_embedding vector_cosine_ops)
  WHERE is_hot = true;

-- ============================================
-- TREND DETECTION
-- ============================================
CREATE TABLE ai.trend_detection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) CHECK (entity_type IN ('product', 'art_form', 'artist', 'color', 'style', 'category')),
  entity_id UUID,
  entity_name VARCHAR(255),

  -- Trend Metrics
  current_popularity_score DECIMAL(8,4),
  popularity_7d_ago DECIMAL(8,4),
  popularity_30d_ago DECIMAL(8,4),
  popularity_90d_ago DECIMAL(8,4),

  -- Trend Analysis
  trend_direction VARCHAR(20) CHECK (trend_direction IN ('viral', 'rising', 'stable', 'declining', 'dormant')),
  trend_velocity DECIMAL(8,4),           -- Rate of change (% per day)
  trend_acceleration DECIMAL(8,4),       -- Change in rate of change

  -- Predictions
  predicted_peak_date DATE,
  predicted_peak_score DECIMAL(8,4),
  predicted_duration_days INTEGER,

  -- Classification
  trend_category VARCHAR(50),            -- 'viral', 'seasonal', 'evergreen', 'fad', 'declining'
  confidence DECIMAL(5,4),
  seasonality_detected BOOLEAN DEFAULT false,

  -- Business Impact
  estimated_demand_increase_pct DECIMAL(5,2),
  recommended_action TEXT,               -- 'increase_inventory', 'launch_campaign', 'create_drop'

  last_calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trend_entity ON ai.trend_detection(entity_type, entity_id);
CREATE INDEX idx_trend_direction ON ai.trend_detection(trend_direction);
CREATE INDEX idx_trend_velocity ON ai.trend_detection(trend_velocity DESC);

-- ============================================
-- INVENTORY INTELLIGENCE
-- ============================================
CREATE TABLE ai.inventory_intelligence (
  product_id UUID PRIMARY KEY REFERENCES core.products(id) ON DELETE CASCADE,

  -- Current State
  current_stock INTEGER,
  reserved_stock INTEGER,
  available_stock INTEGER,               -- current - reserved
  warehouse_locations TEXT[] DEFAULT '{}',

  -- Velocity Metrics
  daily_sales_avg_7d DECIMAL(8,2),
  daily_sales_avg_30d DECIMAL(8,2),
  daily_sales_avg_90d DECIMAL(8,2),
  sales_acceleration DECIMAL(8,4),       -- 7d vs 30d growth rate

  -- Predictions (ML Model)
  predicted_stockout_date DATE,
  days_until_stockout INTEGER,
  stockout_probability DECIMAL(5,4),     -- 0-1
  predicted_demand_7d INTEGER,
  predicted_demand_30d INTEGER,
  predicted_demand_90d INTEGER,

  -- Reorder Intelligence
  reorder_recommended BOOLEAN DEFAULT false,
  recommended_reorder_quantity INTEGER,
  recommended_reorder_date DATE,
  reorder_lead_time_days INTEGER,
  safety_stock_level INTEGER,

  -- Lost Sales (Opportunity Cost)
  lost_sales_count_7d INTEGER DEFAULT 0, -- Attempts to buy when out of stock
  lost_sales_count_30d INTEGER DEFAULT 0,
  lost_revenue_7d DECIMAL(12,2) DEFAULT 0,
  lost_revenue_30d DECIMAL(12,2) DEFAULT 0,

  -- Alerts & Risk
  stockout_risk_level VARCHAR(20) CHECK (stockout_risk_level IN ('none', 'low', 'medium', 'high', 'critical')),
  overstock_risk_level VARCHAR(20) CHECK (overstock_risk_level IN ('none', 'low', 'medium', 'high')),
  slow_moving BOOLEAN DEFAULT false,     -- Sales velocity below threshold

  -- Optimization Suggestions
  dynamic_pricing_suggested BOOLEAN DEFAULT false,
  suggested_discount_pct DECIMAL(5,2),
  bundle_opportunity BOOLEAN DEFAULT false,

  last_calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_stockout ON ai.inventory_intelligence(days_until_stockout);
CREATE INDEX idx_inventory_risk ON ai.inventory_intelligence(stockout_risk_level);
CREATE INDEX idx_inventory_reorder ON ai.inventory_intelligence(reorder_recommended) WHERE reorder_recommended = true;
CREATE INDEX idx_inventory_overstock ON ai.inventory_intelligence(overstock_risk_level);

-- ============================================
-- PERSONALIZATION CACHE (Real-Time)
-- ============================================
CREATE TABLE ai.personalization_cache (
  user_id UUID PRIMARY KEY REFERENCES core.users(id) ON DELETE CASCADE,

  -- Precomputed Recommendations
  recommended_products JSONB,            -- [{"product_id": "...", "score": 0.95, "reason": "Similar to products you viewed"}]
  trending_for_you JSONB,                -- Trending items based on preferences
  complete_the_look JSONB,               -- Complementary products
  new_drops_for_you JSONB,               -- Upcoming drops matching preferences
  artists_you_follow_drops JSONB,        -- New drops from followed artists

  -- Dynamic Content Personalization
  hero_banner_variant VARCHAR(50),
  featured_collection_id UUID,
  personalized_tagline TEXT,
  email_subject_line TEXT,

  -- Behavioral Signals (Session Context)
  last_viewed_products UUID[] DEFAULT '{}',
  last_viewed_art_forms UUID[] DEFAULT '{}',
  last_viewed_artists UUID[] DEFAULT '{}',
  last_search_queries TEXT[] DEFAULT '{}',
  current_session_intent VARCHAR(50),    -- 'browsing', 'purchasing', 'researching', 'comparing'

  -- A/B Test Assignments (Cached)
  active_experiments JSONB,              -- {"test_1": "variant_a", "test_2": "control"}

  -- Urgency & FOMO
  show_cart_abandonment_popup BOOLEAN DEFAULT false,
  cart_abandonment_discount_pct DECIMAL(5,2),
  cart_abandonment_expires_at TIMESTAMPTZ,
  show_low_stock_badge BOOLEAN DEFAULT false,
  low_stock_products UUID[] DEFAULT '{}',

  -- Next Best Action (Cached from CRM)
  next_best_action JSONB,                -- {"action": "send_email", "template": "..."}

  last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Also cache in Redis with 5-minute TTL:
-- Key: personalization:{user_id}
-- TTL: 300 seconds

CREATE INDEX idx_personalization_updated ON ai.personalization_cache(last_updated_at);
```

### 3.11 Enhanced Events Schema (Search & Micro-Conversions)

```sql
-- ============================================
-- SEARCH EVENTS
-- ============================================
CREATE TABLE events.search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255) NOT NULL,

  -- Search Details
  search_query VARCHAR(500) NOT NULL,
  search_query_normalized VARCHAR(500),  -- Lowercase, stemmed, stop words removed
  search_type VARCHAR(50) CHECK (search_type IN ('text', 'visual', 'filter', 'voice')),

  -- Results
  results_count INTEGER,
  results_shown INTEGER,                 -- Limited by pagination
  results_page INTEGER DEFAULT 1,

  -- Filters Applied
  filters_applied JSONB,                 -- {"art_form": ["Kalamkari"], "price_max": 5000, "color": ["blue"]}
  sort_by VARCHAR(50),                   -- 'relevance', 'price_low', 'price_high', 'newest', 'popularity'

  -- Engagement
  result_clicked BOOLEAN DEFAULT false,
  clicked_result_position INTEGER,       -- Position in results (1-based)
  clicked_product_id UUID,
  time_to_first_click_seconds INTEGER,
  total_clicks INTEGER DEFAULT 0,

  -- Conversion
  converted BOOLEAN DEFAULT false,
  conversion_product_id UUID,
  conversion_order_id UUID,
  time_to_conversion_seconds INTEGER,

  -- Abandonment & Refinement
  zero_results BOOLEAN DEFAULT false,
  refinement_count INTEGER DEFAULT 0,    -- How many times user modified search
  abandoned BOOLEAN DEFAULT false,
  session_ended BOOLEAN DEFAULT false,

  -- Device & Context
  device_type VARCHAR(20),
  source_page VARCHAR(255),              -- Where search was initiated

  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_query ON events.search_events(search_query_normalized);
CREATE INDEX idx_search_zero_results ON events.search_events(zero_results) WHERE zero_results = true;
CREATE INDEX idx_search_conversion ON events.search_events(converted) WHERE converted = true;
CREATE INDEX idx_search_session ON events.search_events(session_id);
CREATE INDEX idx_search_timestamp ON events.search_events(timestamp DESC);

-- Materialized View: Popular Search Queries
CREATE MATERIALIZED VIEW events.mv_popular_searches AS
SELECT
  search_query_normalized,
  COUNT(*) as search_count,
  COUNT(*) FILTER (WHERE zero_results = true) as zero_result_count,
  COUNT(*) FILTER (WHERE result_clicked = true) as clicks,
  COUNT(*) FILTER (WHERE converted = true) as conversions,
  AVG(results_count) as avg_results,
  (COUNT(*) FILTER (WHERE converted = true)::DECIMAL / NULLIF(COUNT(*), 0)) as conversion_rate
FROM events.search_events
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY search_query_normalized
ORDER BY search_count DESC;
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

## 7. Cost Breakdown (12 Months, INR) - Enhanced Analytics Edition

### v1.2 Consolidated Architecture + Advanced Analytics

```
┌─────────────────────────────────────────────────────────────┐
│ MONTHLY COSTS (Early Stage - Months 1-6)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Infrastructure:                                              │
│   Vercel (Frontend)                      ₹8,000 - ₹12,000  │
│   Cloudflare (CDN + Workers)             ₹2,000 - ₹5,000   │
│   Google Cloud SQL (PostgreSQL)          ₹15,000 - ₹25,000 │ ⬆️ +20% (larger DB)
│   Google Cloud Memorystore (Redis)       ₹7,000 - ₹10,000  │ ⬆️ +40% (personalization cache)
│   Google Cloud Storage                   ₹1,000 - ₹3,000   │
│   Google Cloud Run (AI Gateway + APIs)   ₹3,000 - ₹6,000   │
│   Cloud Functions (ML jobs, automation)  ₹3,000 - ₹7,000   │ 🆕 NEW
│                                                              │
│ AI & Data:                                                   │
│   Gemini API (LLM + Vision + Embeddings) ₹15,000 - ₹35,000 │ ⬆️ +50% (customer embeddings)
│   BigQuery (storage + queries)           ₹5,000 - ₹12,000  │ ⬆️ +60% (more analytics)
│   Pub/Sub (event streaming)              ₹1,500 - ₹3,000   │ ⬆️ +50% (more events)
│   Vertex AI (ML training)                ₹2,000 - ₹5,000   │ 🆕 NEW (CLV, attribution)
│                                                              │
│ SaaS Services:                                               │
│   Sanity CMS                             ₹2,000 - ₹6,000   │
│   Klaviyo (email marketing)              ₹3,000 - ₹8,000   │
│   Gupshup (SMS)                          ₹2,000 - ₹5,000   │
│   Sentry (error tracking)                ₹1,000 - ₹2,000   │
│   Metabase (BI dashboards) - self-hosted ₹0 - ₹8,000      │ 🆕 NEW (optional cloud)
│                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ TOTAL (Early Stage):             ₹70,500 - ₹152,000/month  │
│ AVERAGE:                                 ~₹105,000/month    │ ⬆️ +40% vs base v1.2
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│ 12-Month Total:                          ₹8.5L - ₹18.2L    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SCALING COSTS (Months 7-12, 50K users/month)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Infrastructure:                   ₹40,000 - ₹65,000/month  │
│ AI & Data:                        ₹60,000 - ₹120,000/month │
│ SaaS Services:                    ₹15,000 - ₹30,000/month  │
│                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ TOTAL (Scaling):                 ₹115,000 - ₹215,000/month │
│ AVERAGE:                                ~₹165,000/month     │ ⬆️ +37% vs base v1.2
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ EXPECTED ROI (at ₹2M/month revenue baseline)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Revenue Improvements:                                        │
│   ✅ Conversion rate uplift (+15-20%)    +₹300K - ₹400K    │
│   ✅ AOV increase (+15%)                 +₹300K            │
│   ✅ Churn reduction (-20%)              +₹100K - ₹200K    │
│   ✅ Cart abandonment recovery (+25%)    +₹150K - ₹250K    │
│                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ TOTAL EXPECTED INCREASE:          +₹850K - ₹1.15M/month    │
│                                                              │
│ Additional Cost:                  ₹30K - ₹55K/month        │
│                                                              │
│ NET GAIN:                         ₹820K - ₹1.1M/month      │
│ ROI MULTIPLE:                     27x - 37x                │ 🔥
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
└─────────────────────────────────────────────────────────────┘
```

### Analytics Cost Justification

**What the Additional ₹30-55K/month Gets You:**

1. **Conversion Funnel Tracking** → Identify drop-offs, optimize each step
2. **CLV Prediction** → Know customer value, prevent high-value churn
3. **Product Affinity Analysis** → "Complete the Look" cross-sells
4. **A/B Testing Framework** → Data-driven optimization of everything
5. **Real-Time Personalization** → Show right products to right people
6. **Advanced Attribution** → Know true ROAS, optimize marketing spend
7. **Search Analytics** → Fix zero-results, improve discoverability
8. **Inventory Intelligence** → Prevent stockouts, reduce lost sales
9. **Marketing Automation** → Recover abandoned carts automatically
10. **Customer Embeddings** → Find similar customers, better recommendations
11. **Trend Detection** → Catch viral products early, optimize inventory

**Conservative Estimate:** Even at 10% improvement across metrics = 15-20x ROI
**Realistic Estimate:** 15-20% improvement across metrics = 27-37x ROI
**Optimistic Estimate:** 25-30% improvement across metrics = 50-70x ROI

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

### Sprint 1 (Weeks 1-2): Foundation + Analytics Schema
**Goal:** Working database + authentication + basic API + analytics foundation

**Tasks:**
- [ ] Set up Google Cloud project + Terraform
- [ ] Create PostgreSQL database (AlloyDB or Cloud SQL)
- [ ] Implement Prisma schema (core, cultural, drops, events, **analytics, experiments**)
- [ ] Enable pgvector extension
- [ ] Set up Medusa.js with custom models
- [ ] Implement authentication (JWT + sessions)
- [ ] Deploy to Cloud Run
- [ ] Set up Sanity CMS
- [ ] **🆕 Create analytics schema (conversion_funnels, attribution_touchpoints)**
- [ ] **🆕 Create experiments schema (ab_tests, ab_assignments, ab_events)**
- [ ] **🆕 Set up Metabase (self-hosted) for BI dashboards**

**Deliverables:**
- Working API (products, orders, users)
- Admin panel (Medusa Admin)
- Database seeded with sample data
- **Analytics tables ready for data collection**

---

### Sprint 2 (Weeks 3-4): Event Router + AI Gateway + Funnel Tracking
**Goal:** Event pipeline + AI foundation + conversion tracking

**Tasks:**
- [ ] Set up Google Pub/Sub topics & subscriptions
- [ ] Implement event router (Cloud Functions)
- [ ] Build AI Gateway (FastAPI)
  - [ ] Gemini integration (chat, vision, embeddings)
  - [ ] OpenAI fallback
  - [ ] Caching with Redis
  - [ ] Usage tracking
- [ ] Create user_events table with partitioning
- [ ] **🆕 Create search_events table for search analytics**
- [ ] Implement GA4 + Meta Pixel integration
- [ ] Set up Redis (Memorystore)
- [ ] **🆕 Implement funnel tracking (frontend + backend)**
  - [ ] **Track funnel steps (awareness → conversion)**
  - [ ] **Track drop-off reasons**
- [ ] **🆕 Build initial attribution tracking (UTM capture)**
- [ ] **🆕 Create funnel visualization dashboard in Metabase**

**Deliverables:**
- Event ingestion API
- AI Gateway deployed
- Basic recommendation engine (hot products)
- **Funnel tracking active**
- **Initial funnel dashboard live**

---

### Sprint 3 (Weeks 5-6): Frontend + CMS Integration + A/B Testing
**Goal:** Launch-ready storefront with experimentation framework

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
- [ ] **🆕 Implement A/B testing SDK (frontend + backend)**
  - [ ] **Variant assignment logic**
  - [ ] **Event tracking for experiments**
- [ ] **🆕 Launch first A/B test (pricing or layout)**
- [ ] **🆕 Add search bar with analytics tracking**
- [ ] **🆕 Instrument all funnel events in frontend**

**Deliverables:**
- Fully functional storefront
- Mobile-optimized
- Story pages powered by Sanity
- **A/B testing framework live**
- **First experiment running**

---

### Sprint 4 (Weeks 7-8): Drop System + NATI Circle + Marketing Automation
**Goal:** Drop management + loyalty + automated campaigns

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
- [ ] **🆕 Implement marketing automation engine**
  - [ ] **Cart abandonment workflow (email + SMS)**
  - [ ] **Drop launch sequence (waitlist → launch)**
  - [ ] **Post-purchase follow-up**
- [ ] **🆕 Build automation rules UI (admin panel)**
- [ ] **🆕 Track automation performance metrics**

**Deliverables:**
- Complete drop lifecycle
- Loyalty program live
- Notification system working
- **Marketing automation live (cart abandonment, drop sequences)**

---

### Sprint 5 (Weeks 9-10): AI Features + CRM + Advanced Analytics
**Goal:** Intelligent recommendations + customer insights + predictive models

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
- [ ] **🆕 Train CLV prediction model (Vertex AI)**
  - [ ] **Collect features (RFM, engagement, art preferences)**
  - [ ] **Train model on historical data**
  - [ ] **Schedule nightly CLV updates**
- [ ] **🆕 Build product affinity calculator**
  - [ ] **Calculate association rules (support, confidence, lift)**
  - [ ] **Generate "Complete the Look" recommendations**
- [ ] **🆕 Implement customer embeddings**
  - [ ] **Generate behavior embeddings**
  - [ ] **Find similar customers**
- [ ] **🆕 Build real-time personalization API**
  - [ ] **Precompute recommendations**
  - [ ] **Cache in Redis + Cloudflare KV**

**Deliverables:**
- Personalized recommendations
- AI stylist chatbot
- CRM dashboard
- BigQuery analytics
- **CLV prediction model live**
- **Product affinity recommendations working**
- **Real-time personalization API**

---

### Sprint 6 (Weeks 11-12): Polish + Launch Prep + Analytics Intelligence
**Goal:** Production-ready for Drop 1 with complete analytics suite

**Tasks:**
- [ ] Performance optimization
  - [ ] Query optimization
  - [ ] Caching strategy
  - [ ] Image optimization
- [ ] Edge caching (Cloudflare Workers)
  - [ ] Story pages cached
  - [ ] Product cards precomputed
  - [ ] Journey-aware recs in KV
  - [ ] **🆕 Personalization data in edge KV**
- [ ] Monitoring & alerting
  - [ ] Sentry error tracking
  - [ ] Google Cloud Monitoring
  - [ ] Cost alerts
  - [ ] Usage dashboards
  - [ ] **🆕 Analytics data quality monitoring**
  - [ ] **🆕 Model performance alerts (CLV, affinity)**
- [ ] Security audit
  - [ ] Rate limiting
  - [ ] Input validation
  - [ ] SQL injection prevention
- [ ] **🆕 Implement advanced attribution models**
  - [ ] **Multi-touch attribution (time-decay, position-based)**
  - [ ] **Train data-driven attribution model**
  - [ ] **Build channel performance dashboard**
- [ ] **🆕 Implement inventory intelligence**
  - [ ] **Demand forecasting model**
  - [ ] **Stockout prediction**
  - [ ] **Reorder recommendations**
  - [ ] **Lost sales tracking**
- [ ] **🆕 Build trend detection system**
  - [ ] **Identify viral products**
  - [ ] **Seasonal pattern detection**
  - [ ] **Demand surge alerts**
- [ ] **🆕 Create comprehensive analytics dashboards**
  - [ ] **Executive dashboard (KPIs)**
  - [ ] **Funnel analysis dashboard**
  - [ ] **CLV & cohort analysis**
  - [ ] **A/B test results dashboard**
  - [ ] **Attribution dashboard**
  - [ ] **Search analytics dashboard**
- [ ] Load testing
- [ ] Documentation
- [ ] Launch checklist

**Deliverables:**
- Production-ready platform
- Monitoring dashboards
- Launch playbook
- **Complete analytics intelligence system**
- **All predictive models deployed**
- **Real-time personalization active**
- **Marketing automation workflows live**
- 🚀 **Ready for Drop 1 with AI-powered insights!**

---

## 10. Key Takeaways - Enhanced Analytics Edition

### Why v1.2 Consolidated + Advanced Analytics is Best for NATI Now:

✅ **Speed to Market:** 12 weeks to launch vs 16+ weeks
✅ **Cost Effective:** ~₹105k/mo vs ₹150k+/mo (Best-of-Breed) - 40% savings
✅ **Operationally Simple:** 6-8 core services vs 15-20
✅ **AI-Native:** Full AI capabilities with Gemini Brain
✅ **Future-Proof:** AI Gateway + BigQuery enable painless migration
✅ **Risk Mitigation:** Provider fallback, caching, cost controls
✅ **🆕 Data-Driven:** Complete analytics suite for maximum consumer insights
✅ **🆕 Predictive Intelligence:** CLV, churn, demand forecasting, trend detection
✅ **🆕 Real-Time Personalization:** Sub-50ms personalized experiences
✅ **🆕 Marketing Automation:** Automated cart recovery, lifecycle campaigns
✅ **🆕 Experimentation Framework:** A/B test everything, data-driven decisions
✅ **🆕 27-37x ROI:** Analytics investment pays for itself 30x over

### Advanced Analytics Capabilities:

🎯 **Conversion Optimization**
- Funnel tracking with drop-off analysis
- A/B testing framework
- Real-time personalization
- Search analytics & optimization

💰 **Revenue Maximization**
- Customer Lifetime Value (CLV) prediction
- Product affinity & cross-sell recommendations
- Dynamic pricing suggestions
- Inventory intelligence & stockout prevention

📊 **Customer Intelligence**
- 360° customer profiles
- Behavioral embeddings & similarity matching
- Churn prediction & prevention
- RFM segmentation & health scoring

🚀 **Marketing Automation**
- Cart abandonment recovery
- Lifecycle email/SMS campaigns
- Drop launch sequences
- Next best action recommendations

📈 **Attribution & Analytics**
- Multi-touch attribution (6 models)
- Channel performance tracking
- Trend detection & viral alerts
- Executive dashboards & BI

### When to Graduate to Semi-Modular:

- Search quality becomes critical (typo tolerance, autocomplete)
- Need advanced faceting or multi-tenancy
- Traffic scales beyond PostgreSQL capacity (>100K queries/sec)

### When to Graduate to Best-of-Breed:

- 100K+ products with complex queries
- Need graph algorithms (PageRank, community detection)
- Multi-region deployment
- Enterprise SLAs
- Budget allows for 2-3x higher infrastructure costs

---

## 11. Final Recommendation

**Adopt v1.2 Consolidated Architecture + Advanced Analytics NOW.**

**With Three Critical Guardrails:**
1. **AI Gateway** - Ensures provider flexibility for all AI/ML workloads
2. **BigQuery** - Safety net for analytics + training data
3. **Analytics-First Instrumentation** - Track everything from day 1

**Enhanced 12-Week Roadmap:**

**Phase 1: Foundation (Weeks 1-4)**
1. ✅ Sprint 1: Database + API + Analytics Schema
2. ✅ Sprint 2: Event Router + AI Gateway + Funnel Tracking

**Phase 2: Storefront & Experimentation (Weeks 5-8)**
3. ✅ Sprint 3: Frontend + CMS + A/B Testing Framework
4. ✅ Sprint 4: Drop System + Loyalty + Marketing Automation

**Phase 3: Intelligence & Launch (Weeks 9-12)**
5. ✅ Sprint 5: AI Features + CRM + CLV/Affinity Models
6. ✅ Sprint 6: Polish + Attribution + Inventory Intelligence

**12 weeks → Drop 1 Launch → NATI goes live with AI-powered marketing brain! 🚀**

---

### What You Get at Launch:

**🎯 Complete Consumer Insights:**
- Every interaction tracked (web, mobile, telegram, email, SMS)
- Full conversion funnel visibility
- Drop-off reason analysis
- Search behavior analytics

**💰 Revenue Optimization:**
- Customer Lifetime Value predictions
- Product affinity recommendations
- Real-time personalization (sub-50ms)
- Automated cart recovery

**📊 Predictive Intelligence:**
- Churn prediction & prevention
- Demand forecasting
- Stockout prevention
- Trend detection (viral products)

**🚀 Marketing Automation:**
- Cart abandonment workflows
- Drop launch sequences
- Lifecycle campaigns
- Next best action engine

**📈 Data-Driven Optimization:**
- A/B testing framework
- Multi-touch attribution (6 models)
- Executive dashboards
- Real-time alerts

---

### Investment vs Returns:

**Additional Cost:** +₹30-55K/month (~40% increase)
**Expected Revenue Uplift:** +₹850K-1.15M/month
**ROI Multiple:** 27-37x
**Payback Period:** <1 week

**At ₹2M/month baseline revenue:**
- 15-20% conversion improvement → +₹300-400K
- 15% AOV increase → +₹300K
- 20% churn reduction → +₹100-200K
- 25% cart recovery → +₹150-250K

**Conservative estimate delivers 5-10x ROI.**
**Realistic estimate delivers 27-37x ROI.**
**This is not an expense - it's a force multiplier.**

---

### Ready to Start Implementation?

**Immediate Next Steps:**
1. ✅ Review D2C_ANALYTICS_REVIEW.md for detailed implementation guide
2. ✅ Set up dev environment (Google Cloud project)
3. ✅ Create database with all schemas (including analytics/experiments/marketing)
4. ✅ Implement event tracking (frontend + backend)
5. ✅ Set up Metabase for dashboards
6. ✅ Start Sprint 1 tasks

**You now have a world-class D2C architecture that rivals Warby Parker, Allbirds, and Glossier - but tailored for Indian folk art! 🚀**

Ready to build?
