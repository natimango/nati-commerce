# NATI (Native Art Textile India) - Technical Architecture v1.1
## AI-Native D2C Fashion Platform for Indian Folk Art Revival

**Version:** 1.1
**Last Updated:** 2025-10-28
**Status:** Design Phase - Enhanced Architecture
**Changes from v1.0:** Added Data Warehouse, CMS, CRM, Knowledge Graph, AI Event Router, Enhanced Models

---

## Executive Summary

NATI is not a traditional e-commerce platform - it's a **cultural technology platform** that uses commerce as a medium to revive Indian folk art traditions.

**v1.1 Enhancements:**
- **Data Warehouse Layer** - BigQuery for analytics & AI training
- **Content Management System** - Sanity CMS for storytelling
- **CRM Microservice** - Centralized customer engagement hub
- **AI Event Router** - Google Pub/Sub for intelligent event processing
- **Knowledge Graph** - Neo4j for relationship reasoning
- **Enhanced Product Models** - Split for performance and scalability
- **Supply Chain Tables** - Dedicated Supplier & Mill entities
- **Visual Similarity Engine** - CLIP embeddings for product recommendations
- **Edge Caching** - Cloudflare Workers for global performance
- **Enhanced Observability** - OpenTelemetry + Grafana

---

## 1. Enhanced System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              NATI ECOSYSTEM v1.1                                         │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  ┌──────────────────────┐   ┌────────────────────┐   ┌────────────────┐               │
│  │  Frontend (Edge)      │   │  Backend Services   │   │  AI Layer      │               │
│  │                       │   │                     │   │                │               │
│  │  Cloudflare Workers   │   │  Medusa Commerce    │   │  Gemini API    │               │
│  │  ├─ Edge Cache        │   │  ├─ PostgreSQL      │   │  ├─ Agents     │               │
│  │  ├─ Personalization   │   │  ├─ Redis Cache     │   │  ├─ LangChain  │               │
│  │  └─ CDN               │   │  └─ Job Queue       │   │  └─ RAG System │               │
│  │                       │   │                     │   │                │               │
│  │  Next.js 15           │◄──┤  API Gateway        │◄──┤  MCP Servers   │               │
│  │  ├─ App Router        │   │  ├─ REST API        │   │  ├─ Fabric     │               │
│  │  ├─ RSC               │   │  ├─ GraphQL         │   │  ├─ Content    │               │
│  │  └─ Server Actions    │   │  └─ WebSocket       │   │  └─ Search     │               │
│  └──────────────────────┘   └────────────────────┘   └────────────────┘               │
│           │                           │                         │                        │
│           │                           │                         │                        │
│  ┌────────▼───────────────────────────▼─────────────────────────▼─────────────────┐   │
│  │                           Event & Data Pipeline                                  │   │
│  │                                                                                   │   │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │   │
│  │  │ Event Router │───►│ PostgreSQL   │───►│ BigQuery     │───►│ AI Models    │ │   │
│  │  │ (Pub/Sub)    │    │ (OLTP)       │    │ (OLAP/DWH)   │    │ (Training)   │ │   │
│  │  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘ │   │
│  │                                                                                   │   │
│  └───────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                         Specialized Data Layers                                   │  │
│  │                                                                                    │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │  │
│  │  │ CMS (Sanity)    │  │ CRM Service     │  │ Knowledge Graph │                  │  │
│  │  │                 │  │                 │  │ (Neo4j)         │                  │  │
│  │  │ • Stories       │  │ • Customer Hub  │  │ • Art Relations │                  │  │
│  │  │ • Art Content   │  │ • Communications│  │ • Supply Chain  │                  │  │
│  │  │ • Media Assets  │  │ • Health Scores │  │ • Semantic Queries                 │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │  │
│  │                                                                                    │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │  │
│  │  │ Vector DB       │  │ Search Engine   │  │ ML Services     │                  │  │
│  │  │ (Pinecone)      │  │ (Typesense)     │  │ (FastAPI)       │                  │  │
│  │  │                 │  │                 │  │                 │                  │  │
│  │  │ • Product Embs  │  │ • Full-text     │  │ • Churn Model   │                  │  │
│  │  │ • Image Embs    │  │ • Faceted       │  │ • Demand Model  │                  │  │
│  │  │ • Semantic      │  │ • Real-time     │  │ • Visual Sim    │                  │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │  │
│  │                                                                                    │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                         Cultural Data Layer                                       │  │
│  │                                                                                    │  │
│  │  • Folk Art Taxonomy    • Artist Profiles       • Fabric Lineage                 │  │
│  │  • Drop Collections     • Story Content (CMS)   • Supply Chain (Mills/Suppliers) │  │
│  │  • Cultural Metadata    • Commission Tracking   • Provenance & Certifications    │  │
│  │  • Knowledge Graph      • Artist Collaborations • Sustainability Scoring         │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                         Integrations & External Services                          │  │
│  │                                                                                    │  │
│  │  Payment:    Razorpay, Stripe, Cashfree                                          │  │
│  │  Shipping:   Shiprocket, Delhivery                                               │  │
│  │  Marketing:  Klaviyo, Gupshup, Telegram                                          │  │
│  │  Analytics:  GA4, Meta Pixel, Amplitude                                          │  │
│  │  Monitoring: Sentry, Datadog, Grafana, OpenTelemetry                             │  │
│  │  AI:         Gemini, OpenAI (CLIP), Vertex AI                                    │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Enhanced Data Models (v1.1)

### 2.1 Split Product Model (Performance Optimized)

**Problem Solved:** The monolithic product model was too heavy for list queries.
**Solution:** Split into three specialized tables with clear responsibilities.

```typescript
// ============================================
// CORE PRODUCT MODEL (commerce essentials)
// ============================================
interface ProductCore {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;           // For list views

  // Pricing
  price: number;
  originalPrice: number;
  cost: number;
  currency: string;
  discount: number;

  // Inventory
  stock: number;
  reservedStock: number;
  isAvailable: boolean;

  // Relations (foreign keys only)
  categoryId: string;
  dropId?: string;

  // Images (thumbnails for lists)
  thumbnailImage: string;
  images: string[];                   // Full gallery loaded on demand

  // Status
  status: 'draft' | 'active' | 'sold_out' | 'archived';
  publishedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// CULTURAL METADATA (stories & provenance)
// ============================================
interface ProductCulturalMeta {
  productId: string;                  // Foreign key to ProductCore

  // Art & Artist
  artFormId: string;
  artForm: ArtForm;
  artistCredits: ArtistCredit[];

  // Story & Narrative (can be fetched from CMS)
  storyId?: string;                   // Reference to Sanity CMS story
  storyTitle: string;
  storyContent: string;               // Rich markdown/HTML
  culturalContext: string;
  artTechnique: string;
  inspirationSource: string;

  // Supply Chain & Ethics
  fabricLineageId: string;
  fabricLineage: FabricLineage;
  supplierId?: string;
  millId?: string;
  productionLocation: string;
  sustainabilityScore: number;        // 0-100
  certifications: string[];           // GOTS, Fair Trade, etc.
  certificationDocs: string[];        // URLs to PDF certificates

  // Limited Edition
  isLimitedEdition: boolean;
  totalUnitsProduced?: number;
  editionNumber?: string;             // "12/100"

  // Metadata for AI
  tags: string[];
  colorPalette: string[];             // Hex codes
  season: string;
  occasion: string[];
  fitType: string;
  careInstructions: string;

  updatedAt: Date;
}

// ============================================
// PRODUCT ANALYTICS (performance metrics)
// ============================================
interface ProductAnalytics {
  productId: string;                  // Foreign key to ProductCore

  // Engagement Metrics
  viewCount: number;
  uniqueViewCount: number;
  wishlistCount: number;
  shareCount: number;

  // Purchase Metrics
  purchaseCount: number;
  totalRevenue: number;
  conversionRate: number;             // views → purchases

  // Quality Metrics
  returnCount: number;
  returnRate: number;
  averageRating: number;
  reviewCount: number;

  // Drop Performance (if part of a drop)
  dropId?: string;
  dropConversionRate?: number;
  timeToSellOut?: number;             // minutes

  // AI-Generated Insights
  popularityScore: number;            // 0-100, calculated by AI
  recommendationScore: number;        // How often recommended
  crossSellScore: number;             // Frequently bought with others

  // Temporal Analytics
  peakViewHours: number[];            // [18, 19, 20] = 6-8 PM
  bestSellingDays: string[];          // ["Friday", "Saturday"]

  // Last Updated
  lastCalculatedAt: Date;
  updatedAt: Date;
}

// ============================================
// VISUAL EMBEDDINGS (for AI similarity)
// ============================================
interface ProductEmbedding {
  productId: string;

  // Text Embeddings
  descriptionEmbedding: number[];     // 768-dim vector from description
  storyEmbedding: number[];           // 768-dim vector from story

  // Image Embeddings (CLIP)
  imageEmbeddings: {
    imageUrl: string;
    embedding: number[];              // 512-dim CLIP vector
  }[];

  // Combined Multimodal Embedding
  multimodalEmbedding: number[];      // Fusion of text + image

  // Metadata
  embeddingModel: string;             // "CLIP-ViT-B-32", "text-embedding-3-small"
  generatedAt: Date;
}
```

**Query Optimization Examples:**

```typescript
// Fast list view (only ProductCore)
const productList = await db.productCore.findMany({
  where: { status: 'active' },
  select: { id: true, name: true, price: true, thumbnailImage: true }
});

// Full product detail (join all tables)
const productDetail = await db.productCore.findUnique({
  where: { id: productId },
  include: {
    culturalMeta: true,
    analytics: true,
    embedding: true
  }
});
```

---

### 2.2 Supplier & Mill Tables (Supply Chain Transparency)

**Problem Solved:** Fabric provenance was embedded as strings. Now it's relational and trackable.

```typescript
// ============================================
// MILL / WEAVER ENTITY
// ============================================
interface Mill {
  id: string;
  name: string;                       // "Suvetah Handlooms"
  slug: string;

  // Location
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: { lat: number; lng: number };

  // Type
  millType: 'handloom' | 'powerloom' | 'hybrid';
  weaverCommunity?: string;           // "Kota Doria weavers"

  // Capabilities
  fabricTypes: string[];              // ["Cotton", "Silk", "Linen"]
  productsPerMonth: number;
  minimumOrderQuantity: number;

  // Certifications
  certifications: string[];           // ["Handloom Mark", "GI Tag"]
  certificationDocs: string[];        // URLs
  auditedAt?: Date;
  auditedBy?: string;

  // Ethics & Sustainability
  fairTradeCompliant: boolean;
  organicCertified: boolean;
  carbonFootprintPerKg?: number;
  waterUsagePerKg?: number;

  // Collaboration History
  totalCollaborations: number;
  totalRevenue: number;

  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Media
  images: string[];
  videoUrl?: string;

  // Status
  isActive: boolean;
  partnerSince: Date;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SUPPLIER ENTITY (dye, fabric, raw material)
// ============================================
interface Supplier {
  id: string;
  name: string;
  slug: string;

  // Type
  supplierType: 'dye' | 'fabric' | 'raw_material' | 'accessory' | 'packaging';

  // Location
  address: string;
  city: string;
  state: string;
  country: string;

  // Products Supplied
  productsSupplied: string[];         // ["Natural Indigo", "Organic Cotton Yarn"]

  // Certifications
  certifications: string[];           // ["GOTS", "OEKO-TEX"]
  certificationDocs: string[];
  auditedAt?: Date;

  // Sustainability
  usesNaturalDyes: boolean;
  organicMaterials: boolean;
  sustainabilityScore: number;        // 0-100

  // Lead Times
  averageLeadTimeDays: number;
  minimumOrderValue: number;

  // Collaboration
  totalOrders: number;
  totalRevenue: number;

  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Status
  isActive: boolean;
  partnerSince: Date;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// ENHANCED FABRIC LINEAGE (with relations)
// ============================================
interface FabricLineage {
  id: string;

  // Basic Info
  fabricType: string;                 // Cotton, Linen, Silk, Hemp
  fabricWeight: number;               // GSM
  fabricComposition: string;          // "100% Organic Cotton"

  // Mill Relation
  millId?: string;
  mill?: Mill;

  // Raw Material Supplier
  rawMaterialSupplierId?: string;
  rawMaterialSupplier?: Supplier;
  rawMaterialOrigin: string;          // "Organic cotton from Gujarat"

  // Dye Process & Supplier
  dyeSupplierId?: string;
  dyeSupplier?: Supplier;
  dyeProcess: DyeProcess;

  // Processing
  processingMethod: string;           // Handloom, Powerloom, Organic
  finishing: string;                  // Enzyme wash, stone wash

  // Certifications
  certifications: string[];
  certificationDocs: string[];        // File URLs

  // Environmental Impact
  carbonFootprint?: number;           // kg CO2
  waterUsage?: number;                // Liters
  chemicalFree: boolean;
  sustainabilityScore: number;        // Calculated from above

  // Provenance QR Code (future: IoT tracking)
  provenanceQRCode?: string;          // Links to full journey
  blockchainRecord?: string;          // IPFS hash or blockchain TX

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface DyeProcess {
  type: 'natural' | 'azo_free_synthetic' | 'conventional';
  dyeIngredients: string[];           // ["Indigo", "Turmeric", "Pomegranate"]
  method: string;                     // "Hand-dyed", "Vat-dyed"
  waterUsage?: number;
  chemicalFree: boolean;
  supplierId?: string;                // Link to dye supplier
}
```

**Supply Chain Query Examples:**

```typescript
// Get full supply chain for a product
const supplyChain = await db.product.findUnique({
  where: { id: productId },
  include: {
    culturalMeta: {
      include: {
        fabricLineage: {
          include: {
            mill: true,
            rawMaterialSupplier: true,
            dyeSupplier: true
          }
        }
      }
    }
  }
});

// Find all products from a specific mill
const productsFromMill = await db.mill.findUnique({
  where: { id: millId },
  include: {
    fabricLineages: {
      include: {
        products: true
      }
    }
  }
});

// Calculate average sustainability score by mill
const millSustainability = await db.mill.findMany({
  include: {
    fabricLineages: {
      select: { sustainabilityScore: true }
    }
  }
});
```

---

### 2.3 Enhanced Event Model (with Source Platform & Journey Tracking)

```typescript
interface NATIEvent {
  id: string;

  // User Context
  userId?: string;
  sessionId: string;
  anonymousId?: string;
  journeyId?: string;                 // Groups related sessions across days

  // Event Details
  eventType: NATIEventType;
  eventName: string;
  eventCategory: 'product' | 'drop' | 'story' | 'checkout' | 'engagement' | 'ai';

  // Source Platform (NEW)
  sourcePlatform: 'web' | 'mobile' | 'telegram' | 'email' | 'sms' | 'api';

  // Context Objects
  productId?: string;
  dropId?: string;
  artistId?: string;
  artFormId?: string;
  orderId?: string;

  // Event Properties
  properties: Record<string, any>;

  // Device & Location
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browserName: string;
  osName: string;
  ipAddress: string;
  country: string;
  city: string;
  coordinates?: { lat: number; lng: number };

  // Referrer & Attribution
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  // Session Info
  pageUrl: string;
  pageTitle: string;
  timeOnPage?: number;
  scrollDepth?: number;
  clickPath?: string[];
  sessionDuration?: number;           // Total session length so far

  // Timing
  timestamp: Date;
  serverTimestamp: Date;

  // Integration Flags
  sentToAnalytics: boolean;
  sentToAI: boolean;
  sentToPubSub: boolean;              // NEW: routed to event queue

  // Data Retention (NEW)
  retentionPolicy: 'hot' | 'warm' | 'cold';  // hot=90d, warm=1yr, cold=archive
  archivedAt?: Date;

  createdAt: Date;
}

// Add new event types for artist follow feature
type NATIEventType =
  // ... (all previous event types) ...

  // NEW: Artist Engagement Events
  | 'artist_followed'
  | 'artist_unfollowed'
  | 'artist_profile_shared'
  | 'artist_collaboration_notified'

  // NEW: Art Mode Toggle
  | 'view_mode_switched'              // properties: { mode: 'art' | 'shop' }

  // NEW: Visual Search Events
  | 'visual_search_initiated'
  | 'visual_search_result_clicked';
```

---

### 2.4 Artist Follow Feature

```typescript
interface ArtistFollow {
  id: string;
  userId: string;
  user: User;
  artistId: string;
  artist: Artist;

  // Notification Preferences
  notifyOnNewDrop: boolean;
  notifyOnCollaboration: boolean;
  notifyOnStory: boolean;

  // Engagement
  dropsAttended: number;              // Drops featuring this artist
  productsOwned: number;              // Products by this artist

  followedAt: Date;
}

// Enhanced Artist Model
interface Artist {
  // ... (all previous fields) ...

  // NEW: Follower Metrics
  followerCount: number;
  averageEngagementRate: number;      // % of followers who buy

  // NEW: Upcoming Work
  upcomingDrops: string[];            // Drop IDs
  featuredIn: string[];               // Product IDs
}
```

---

## 3. New Architectural Layers (v1.1)

### 3.1 Data Warehouse Layer (BigQuery)

**Purpose:** Separate transactional (OLTP) from analytical (OLAP) workloads.

```typescript
// Daily ETL Pipeline Configuration
interface DataWarehouseETL {
  source: "PostgreSQL + Event Store";
  destination: "Google BigQuery";
  schedule: "Daily at 2 AM UTC";

  tables: [
    // Fact Tables
    "fact_orders",
    "fact_events",
    "fact_product_views",
    "fact_revenue",

    // Dimension Tables
    "dim_users",
    "dim_products",
    "dim_artists",
    "dim_art_forms",
    "dim_drops",
    "dim_dates",

    // Aggregated Tables
    "agg_daily_sales",
    "agg_user_cohorts",
    "agg_product_performance",
    "agg_drop_analytics"
  ];

  transformations: [
    "Anonymize PII (emails, phone numbers)",
    "Calculate derived metrics (CLV, churn risk)",
    "Create user cohorts (RFM segmentation)",
    "Aggregate event sequences"
  ];
}

// BigQuery Schema Example
interface FactOrders {
  order_id: string;
  order_date: Date;
  user_id: string;

  // Dimensions (foreign keys)
  product_ids: string[];
  drop_id: string;
  art_form_ids: string[];

  // Metrics
  total_amount: number;
  items_count: number;
  discount_amount: number;
  shipping_cost: number;

  // Attribution
  utm_source: string;
  utm_campaign: string;

  // Flags
  is_first_order: boolean;
  is_repeat_customer: boolean;
  is_high_value: boolean;

  // Timestamps
  created_at: Date;
  etl_loaded_at: Date;
}

// Analytics Use Cases
const analyticsQueries = {
  // RFM Segmentation
  rfmSegmentation: `
    SELECT user_id,
           RECENCY, FREQUENCY, MONETARY_VALUE,
           CASE
             WHEN RFM_SCORE >= 9 THEN 'VIP'
             WHEN RFM_SCORE >= 6 THEN 'Regular'
             ELSE 'At-Risk'
           END as segment
    FROM user_rfm_scores
  `,

  // Drop Performance Analysis
  dropPerformance: `
    SELECT drop_id, drop_name,
           COUNT(DISTINCT user_id) as unique_buyers,
           SUM(total_amount) as revenue,
           AVG(time_to_purchase_minutes) as avg_conversion_time
    FROM fact_orders
    GROUP BY drop_id, drop_name
    ORDER BY revenue DESC
  `,

  // Cohort Retention
  cohortRetention: `
    WITH first_purchase AS (
      SELECT user_id, MIN(order_date) as cohort_month
      FROM fact_orders
      GROUP BY user_id
    )
    SELECT cohort_month,
           COUNT(DISTINCT user_id) as cohort_size,
           COUNT(DISTINCT CASE WHEN order_date >= cohort_month + INTERVAL 1 MONTH THEN user_id END) as month_1,
           COUNT(DISTINCT CASE WHEN order_date >= cohort_month + INTERVAL 3 MONTH THEN user_id END) as month_3
    FROM fact_orders f
    JOIN first_purchase fp ON f.user_id = fp.user_id
    GROUP BY cohort_month
  `
};
```

**Benefits:**
- AI model training doesn't impact production DB
- Complex analytics queries run fast
- Historical data preserved for long-term analysis
- Cost-effective storage for cold data

---

### 3.2 Content Management System (Sanity CMS)

**Purpose:** Empower curators and artists to manage storytelling content without code.

```typescript
// Sanity Schema for NATI
const sanitySchema = {
  // Art Form Story
  artFormStory: {
    name: 'artFormStory',
    type: 'document',
    fields: [
      { name: 'artFormId', type: 'string', title: 'Art Form ID (from DB)' },
      { name: 'title', type: 'string' },
      { name: 'slug', type: 'slug' },
      { name: 'heroImage', type: 'image' },
      { name: 'content', type: 'array', of: [{ type: 'block' }] },  // Rich text
      { name: 'history', type: 'text' },
      { name: 'technique', type: 'text' },
      { name: 'gallery', type: 'array', of: [{ type: 'image' }] },
      { name: 'videoUrl', type: 'url' },
      { name: 'relatedArtists', type: 'array', of: [{ type: 'reference', to: [{ type: 'artist' }] }] }
    ]
  },

  // Artist Profile (extended)
  artist: {
    name: 'artist',
    type: 'document',
    fields: [
      { name: 'artistId', type: 'string', title: 'Artist ID (from DB)' },
      { name: 'name', type: 'string' },
      { name: 'slug', type: 'slug' },
      { name: 'bio', type: 'text' },
      { name: 'profileImage', type: 'image' },
      { name: 'storyContent', type: 'array', of: [{ type: 'block' }] },
      { name: 'portfolio', type: 'array', of: [{ type: 'image' }] },
      { name: 'videoInterview', type: 'url' },
      { name: 'location', type: 'string' },
      { name: 'artForms', type: 'array', of: [{ type: 'string' }] }
    ]
  },

  // Drop Story
  dropStory: {
    name: 'dropStory',
    type: 'document',
    fields: [
      { name: 'dropId', type: 'string', title: 'Drop ID (from DB)' },
      { name: 'title', type: 'string' },
      { name: 'slug', type: 'slug' },
      { name: 'theme', type: 'string' },
      { name: 'storyContent', type: 'array', of: [{ type: 'block' }] },
      { name: 'inspiration', type: 'text' },
      { name: 'curatedBy', type: 'string' },
      { name: 'heroImage', type: 'image' },
      { name: 'lookbook', type: 'array', of: [{ type: 'image' }] },
      { name: 'campaignVideo', type: 'file' },
      { name: 'behindTheScenes', type: 'array', of: [{ type: 'block' }] }
    ]
  },

  // Product Story (optional override)
  productStory: {
    name: 'productStory',
    type: 'document',
    fields: [
      { name: 'productId', type: 'string' },
      { name: 'storyTitle', type: 'string' },
      { name: 'storyContent', type: 'array', of: [{ type: 'block' }] },
      { name: 'culturalContext', type: 'text' },
      { name: 'artTechnique', type: 'text' },
      { name: 'inspirationSource', type: 'text' },
      { name: 'images', type: 'array', of: [{ type: 'image' }] }
    ]
  },

  // Blog / Editorial Content
  blogPost: {
    name: 'blogPost',
    type: 'document',
    fields: [
      { name: 'title', type: 'string' },
      { name: 'slug', type: 'slug' },
      { name: 'author', type: 'reference', to: [{ type: 'author' }] },
      { name: 'publishedAt', type: 'datetime' },
      { name: 'heroImage', type: 'image' },
      { name: 'excerpt', type: 'text' },
      { name: 'content', type: 'array', of: [{ type: 'block' }] },
      { name: 'categories', type: 'array', of: [{ type: 'string' }] },
      { name: 'relatedProducts', type: 'array', of: [{ type: 'string' }] }
    ]
  }
};

// Integration with Next.js
import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true
});

// Fetch art form story
async function getArtFormStory(artFormId: string) {
  return await sanity.fetch(
    `*[_type == "artFormStory" && artFormId == $artFormId][0]`,
    { artFormId }
  );
}
```

**Benefits:**
- Non-technical team members can manage content
- Version control for stories
- Rich media management (images, videos)
- Preview before publish
- Webhook integration for cache invalidation

---

### 3.3 CRM Microservice (Customer Hub)

**Purpose:** Centralize customer engagement data beyond just orders.

```typescript
// CRM Service Architecture
interface CRMService {
  database: "PostgreSQL (separate schema)";
  api: "FastAPI (Python) or Express (Node.js)";

  features: [
    "Customer 360 view",
    "Communication history (email, SMS, chat)",
    "Support ticket management",
    "Customer health scores",
    "AI-powered engagement suggestions",
    "Lifecycle stage tracking"
  ];
}

// CRM Data Models
interface CustomerProfile {
  userId: string;                     // Link to main User table

  // Health Score (AI-calculated)
  healthScore: number;                // 0-100
  healthTrend: 'improving' | 'stable' | 'declining';

  // Lifecycle Stage
  stage: 'prospect' | 'new' | 'active' | 'at_risk' | 'churned' | 'win_back';
  stageChangedAt: Date;

  // Communication History
  totalEmailsSent: number;
  emailOpenRate: number;
  emailClickRate: number;
  lastEmailOpenedAt?: Date;

  totalSMSSent: number;
  smsClickRate: number;
  lastSMSClickedAt?: Date;

  totalTelegramMessages: number;
  telegramEngaged: boolean;

  // Support Interactions
  supportTickets: number;
  openTickets: number;
  avgResolutionTime: number;          // hours
  lastTicketAt?: Date;

  // Engagement Signals
  lastActiveAt: Date;
  daysInactive: number;
  engagementScore: number;            // 0-100

  // AI Recommendations
  nextBestAction: string;             // "Send discount offer", "Personal outreach"
  predictedChurnDate?: Date;
  retentionStrategy?: string;

  updatedAt: Date;
}

interface CommunicationLog {
  id: string;
  userId: string;

  // Communication Details
  channel: 'email' | 'sms' | 'telegram' | 'whatsapp' | 'phone';
  direction: 'outbound' | 'inbound';
  campaignId?: string;

  // Content
  subject?: string;
  content: string;
  templateId?: string;

  // Engagement
  sent: boolean;
  delivered: boolean;
  opened: boolean;
  clicked: boolean;
  replied: boolean;

  openedAt?: Date;
  clickedAt?: Date;
  repliedAt?: Date;

  // Link Tracking
  linksClicked: string[];

  sentAt: Date;
  createdAt: Date;
}

interface SupportTicket {
  id: string;
  userId: string;
  orderId?: string;

  // Ticket Details
  subject: string;
  description: string;
  category: 'order' | 'product' | 'shipping' | 'return' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';

  // Assignment
  assignedTo?: string;                // Agent ID

  // Resolution
  resolutionTime?: number;            // minutes
  resolvedAt?: Date;
  resolution?: string;

  // AI Assistance
  aiSuggestedResponse?: string;
  aiCategorized: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// CRM API Endpoints
const crmEndpoints = {
  // Customer 360
  "GET /crm/customers/:id": "Get full customer profile with all interactions",
  "GET /crm/customers/:id/timeline": "Complete activity timeline",
  "GET /crm/customers/:id/health": "Health score and trends",

  // Communication
  "POST /crm/communications": "Log a communication",
  "GET /crm/communications/:userId": "Get communication history",
  "POST /crm/campaigns": "Trigger campaign for segment",

  // Support
  "POST /crm/tickets": "Create support ticket",
  "GET /crm/tickets/:id": "Get ticket details",
  "PATCH /crm/tickets/:id": "Update ticket status",
  "GET /crm/tickets/open": "List open tickets",

  // AI Insights
  "GET /crm/insights/at-risk": "List at-risk customers",
  "GET /crm/insights/recommendations/:userId": "Get engagement recommendations"
};
```

**Benefits:**
- Unified customer view across all touchpoints
- AI-powered engagement strategies
- Proactive customer retention
- Support ticket management
- Campaign effectiveness tracking

---

### 3.4 AI Event Router (Google Pub/Sub)

**Purpose:** Decouple event ingestion from processing for scalability and reliability.

```typescript
// Event Router Architecture
interface EventRouter {
  inbound: "REST API + WebSocket (from frontend)";
  queue: "Google Cloud Pub/Sub";
  consumers: [
    "PostgreSQL Writer (OLTP)",
    "BigQuery Streamer (OLAP)",
    "AI Model Feeder (real-time)",
    "Analytics Aggregator",
    "Notification Trigger",
    "CRM Sync"
  ];
}

// Pub/Sub Topics
const pubsubTopics = {
  "nati-events-product": "Product view, wishlist, cart events",
  "nati-events-checkout": "Checkout and payment events",
  "nati-events-engagement": "Email, SMS, social engagement",
  "nati-events-ai": "AI interactions (chat, recommendations)",
  "nati-events-drop": "Drop-specific events (waitlist, launch)",
  "nati-events-priority": "High-priority events (order placed, payment)"
};

// Event Processing Flow
const eventFlow = `
  Frontend/API
       │
       ▼
  Event Router Service
       │
       ▼
  Pub/Sub (multi-topic)
       │
       ├──────────┬──────────┬──────────┬──────────┬──────────┐
       ▼          ▼          ▼          ▼          ▼          ▼
  PostgreSQL  BigQuery   AI Models  Analytics  CRM Sync  Notifications
  (write)     (stream)   (predict)  (aggregate)          (trigger)
`;

// Subscriber Example (AI Model Feeder)
import { PubSub } from '@google-cloud/pubsub';

const pubsub = new PubSub();
const subscription = pubsub.subscription('nati-events-ai-sub');

subscription.on('message', async (message) => {
  const event = JSON.parse(message.data.toString());

  // Feed to recommendation engine
  if (event.eventType === 'product_viewed') {
    await recommendationEngine.updateUserPreferences(event.userId, event.productId);
  }

  // Feed to churn predictor
  if (event.eventType === 'cart_abandoned') {
    await churnPredictor.incrementRiskScore(event.userId);
  }

  message.ack();
});

// Event Deduplication & Batching
interface EventProcessor {
  deduplication: "Redis-based (5min window)";
  batching: "Group events by user/session every 30s";
  retry: "Exponential backoff (3 retries)";
  deadLetter: "Failed events → BigQuery for analysis";
}
```

**Benefits:**
- Handles millions of events per day
- Decouples producers from consumers
- Guaranteed delivery with retries
- Real-time + batch processing
- Scales independently

---

### 3.5 Knowledge Graph (Neo4j)

**Purpose:** Reason over complex relationships between art, artists, products, and supply chain.

```typescript
// Neo4j Graph Model
interface KnowledgeGraph {
  nodes: [
    "Product",
    "ArtForm",
    "Artist",
    "Drop",
    "Mill",
    "Supplier",
    "User",
    "Category",
    "Region"
  ];

  relationships: [
    "FEATURES (Product → ArtForm)",
    "CREATED_BY (Product → Artist)",
    "SOURCED_FROM (Product → Mill)",
    "USES_DYE_FROM (Product → Supplier)",
    "PART_OF (Product → Drop)",
    "PURCHASED (User → Product)",
    "FOLLOWS (User → Artist)",
    "COLLABORATED_WITH (Artist → Artist)",
    "ORIGINATED_IN (ArtForm → Region)",
    "PRACTICES (Artist → ArtForm)"
  ];
}

// Cypher Query Examples

// 1. Find all products connected to a specific region through art form
const regionalProducts = `
  MATCH (r:Region {name: "Andhra Pradesh"})<-[:ORIGINATED_IN]-(af:ArtForm)<-[:FEATURES]-(p:Product)
  RETURN p.name, af.name
`;

// 2. Discover artist collaboration network
const artistNetwork = `
  MATCH (a1:Artist)-[:COLLABORATED_WITH]-(a2:Artist)
  RETURN a1.name, collect(a2.name) as collaborators
`;

// 3. Supply chain traceability
const supplyChain = `
  MATCH (p:Product {sku: "NATI-KL-001"})
        -[:SOURCED_FROM]->(m:Mill)
        -[:USES_DYE_FROM]->(s:Supplier)
  RETURN p.name, m.name, s.name, s.sustainabilityScore
`;

// 4. User affinity to art forms (for recommendations)
const userAffinity = `
  MATCH (u:User {id: $userId})-[:PURCHASED]->(p:Product)-[:FEATURES]->(af:ArtForm)
  RETURN af.name, count(p) as purchase_count
  ORDER BY purchase_count DESC
`;

// 5. Cross-art-form recommendations
const crossArtFormRecs = `
  MATCH (u:User {id: $userId})-[:PURCHASED]->(:Product)-[:FEATURES]->(af1:ArtForm)
  MATCH (af1)<-[:PRACTICES]-(a:Artist)-[:PRACTICES]->(af2:ArtForm)
  MATCH (af2)<-[:FEATURES]-(p:Product)
  WHERE NOT (u)-[:PURCHASED]->(p)
  RETURN DISTINCT p.name, af2.name, a.name
  LIMIT 10
`;

// 6. Sustainability score path
const sustainabilityPath = `
  MATCH path = (p:Product)-[:SOURCED_FROM|USES_DYE_FROM*]->(entity)
  WHERE entity:Mill OR entity:Supplier
  RETURN p.name,
         avg(entity.sustainabilityScore) as avg_score,
         collect(entity.name) as supply_chain
`;

// Integration with Main API
class KnowledgeGraphService {
  async getProductSupplyChain(productId: string) {
    const result = await neo4jSession.run(
      `MATCH (p:Product {id: $productId})
             -[:SOURCED_FROM]->(m:Mill),
             (p)-[:USES_DYE_FROM]->(s:Supplier)
       RETURN m, s`,
      { productId }
    );
    return result.records;
  }

  async getArtistCollaborationNetwork(artistId: string) {
    const result = await neo4jSession.run(
      `MATCH (a:Artist {id: $artistId})-[:COLLABORATED_WITH*1..2]-(related:Artist)
       RETURN DISTINCT related`,
      { artistId }
    );
    return result.records;
  }

  async getUserArtFormAffinity(userId: string) {
    const result = await neo4jSession.run(
      `MATCH (u:User {id: $userId})-[:PURCHASED]->(:Product)-[:FEATURES]->(af:ArtForm)
       RETURN af.name, count(*) as affinity
       ORDER BY affinity DESC`,
      { userId }
    );
    return result.records;
  }
}
```

**Benefits:**
- Discover hidden patterns (e.g., artists who often collaborate)
- Semantic queries ("Show products using natural dyes from Gujarat")
- Supply chain visualization
- Recommendation engine powered by graph relationships
- Art form affinity mapping

---

### 3.6 Visual Similarity Recommendation Engine

**Purpose:** Recommend products based on visual similarity (color, pattern, style).

```typescript
// Visual Similarity Architecture
interface VisualSimilarityEngine {
  model: "OpenAI CLIP (ViT-B/32)";
  vectorDB: "Pinecone (512-dim embeddings)";

  pipeline: [
    "1. Extract product images",
    "2. Generate CLIP embeddings (512-dim)",
    "3. Store in Pinecone with metadata",
    "4. Query for similar vectors (cosine similarity)"
  ];
}

// CLIP Embedding Service
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

class VisualSimilarityService {
  private openai: OpenAI;
  private pinecone: Pinecone;

  async generateEmbedding(imageUrl: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "clip-vit-base-patch32",
      input: imageUrl
    });
    return response.data[0].embedding;
  }

  async indexProduct(productId: string, images: string[]) {
    const embeddings = await Promise.all(
      images.map(img => this.generateEmbedding(img))
    );

    // Average embeddings if multiple images
    const avgEmbedding = this.averageVectors(embeddings);

    // Store in Pinecone
    await this.pinecone.upsert({
      id: productId,
      values: avgEmbedding,
      metadata: {
        productId,
        images,
        indexedAt: Date.now()
      }
    });
  }

  async findSimilarProducts(productId: string, topK: number = 10) {
    // Get product's embedding from Pinecone
    const product = await this.pinecone.fetch([productId]);
    const embedding = product.records[productId].values;

    // Query for similar products
    const results = await this.pinecone.query({
      vector: embedding,
      topK: topK + 1,  // +1 to exclude self
      includeMetadata: true
    });

    // Filter out the query product itself
    return results.matches
      .filter(match => match.id !== productId)
      .map(match => ({
        productId: match.id,
        similarity: match.score,
        metadata: match.metadata
      }));
  }

  // Hybrid recommendation: combine visual + behavioral
  async getHybridRecommendations(
    userId: string,
    productId: string
  ): Promise<Recommendation[]> {
    // 1. Get visually similar products (50%)
    const visualSimilar = await this.findSimilarProducts(productId, 20);

    // 2. Get collaborative filtering recs (30%)
    const collaborative = await collaborativeFiltering.getRecommendations(userId, 15);

    // 3. Get content-based recs (20%)
    const contentBased = await contentBasedFiltering.getRecommendations(userId, 10);

    // 4. Blend and re-rank
    return this.blendRecommendations({
      visual: { recs: visualSimilar, weight: 0.5 },
      collaborative: { recs: collaborative, weight: 0.3 },
      contentBased: { recs: contentBased, weight: 0.2 }
    });
  }

  private averageVectors(vectors: number[][]): number[] {
    const dim = vectors[0].length;
    const avgVector = new Array(dim).fill(0);

    vectors.forEach(vec => {
      vec.forEach((val, idx) => {
        avgVector[idx] += val / vectors.length;
      });
    });

    return avgVector;
  }
}

// API Endpoint
app.get('/api/products/:id/visual-similar', async (req, res) => {
  const { id } = req.params;
  const { limit = 10 } = req.query;

  const similarProducts = await visualSimilarityService.findSimilarProducts(
    id,
    Number(limit)
  );

  res.json({ similarProducts });
});
```

**Benefits:**
- "Shop by look" feature
- Discover products with similar aesthetics
- Complements text-based search
- Works even for new products (cold start)
- Captures color, pattern, and style similarity

---

## 4. Enhanced Tech Stack (v1.1)

### 4.1 Complete Stack

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND                                                         │
├─────────────────────────────────────────────────────────────────┤
│ Framework:        Next.js 15 (App Router + RSC)                 │
│ Language:         TypeScript                                     │
│ UI:               React 19 + Tailwind CSS + shadcn/ui           │
│ State:            Zustand (client) + React Server Components    │
│ Forms:            React Hook Form + Zod                         │
│ API Layer:        Server Actions + tRPC                         │
│ Real-time:        WebSockets (drop countdown)                   │
│ CDN:              Cloudflare (with Workers for edge logic)      │
│ Analytics:        GA4, Meta Pixel, Amplitude                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ BACKEND                                                          │
├─────────────────────────────────────────────────────────────────┤
│ E-commerce:       Medusa.js 2.0                                 │
│ Database (OLTP):  PostgreSQL 16                                 │
│ ORM:              Prisma                                         │
│ Cache:            Redis 7                                       │
│ Search:           Typesense (open-source Algolia alternative)   │
│ Job Queue:        BullMQ (Redis-based)                          │
│ File Storage:     Google Cloud Storage                          │
│ Event Queue:      Google Cloud Pub/Sub                          │
│ API Gateway:      Kong or custom (Express middleware)           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ CONTENT & CUSTOMER DATA                                          │
├─────────────────────────────────────────────────────────────────┤
│ CMS:              Sanity (headless CMS for stories)             │
│ CRM:              Custom microservice (FastAPI)                 │
│ Email:            Klaviyo (campaigns) + Resend (transactional)  │
│ SMS:              Gupshup                                        │
│ Notifications:    Firebase Cloud Messaging                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ AI & MACHINE LEARNING                                            │
├─────────────────────────────────────────────────────────────────┤
│ LLM:              Google Gemini 2.0 Flash (primary)             │
│ Framework:        LangChain + LangGraph                         │
│ Vector DB:        Pinecone (product + text embeddings)          │
│ Embeddings:       OpenAI CLIP (visual) + text-embedding-3      │
│ ML Platform:      Google Vertex AI (model training & serving)   │
│ ML Ops:           MLflow (experiment tracking)                  │
│ Graph DB:         Neo4j (knowledge graph)                       │
│ ML Services:      Python + FastAPI microservices               │
│                   - Recommendation Engine                        │
│                   - Churn Prediction (XGBoost)                  │
│                   - Demand Forecasting (Prophet)                │
│                   - Visual Similarity (CLIP)                    │
│                   - Sentiment Analysis                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ANALYTICS & DATA WAREHOUSE                                       │
├─────────────────────────────────────────────────────────────────┤
│ Data Warehouse:   Google BigQuery                               │
│ ETL:              Apache Airflow or dbt Cloud                   │
│ BI:               Metabase or Looker                            │
│ Real-time:        Google Cloud Dataflow (stream processing)     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ INFRASTRUCTURE & DEVOPS                                          │
├─────────────────────────────────────────────────────────────────┤
│ Frontend Host:    Vercel                                         │
│ Backend Host:     Google Cloud Run (containers)                 │
│ Database:         Google Cloud SQL (PostgreSQL)                 │
│ Cache/Queue:      Google Cloud Memorystore (Redis)              │
│ Storage:          Google Cloud Storage                          │
│ CDN:              Cloudflare                                     │
│ Monitoring:       Sentry + Google Cloud Monitoring              │
│ Logging:          Google Cloud Logging                          │
│ Observability:    OpenTelemetry + Grafana + Prometheus          │
│ CI/CD:            GitHub Actions                                │
│ IaC:              Terraform                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PAYMENTS & LOGISTICS                                             │
├─────────────────────────────────────────────────────────────────┤
│ Payments (IN):    Razorpay                                       │
│ Payments (Intl):  Stripe                                         │
│ Payouts:          Cashfree (artist commissions)                 │
│ Shipping:         Shiprocket + Delhivery                        │
│ Logistics:        ShipRocket API                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Updated Implementation Roadmap

### Phase 1: MVP (Months 1-3) - **Enhanced**
**Goal:** Launch first drop with AI + CMS

**Backend:**
- ✅ Medusa.js + PostgreSQL
- ✅ Core models (split Product model)
- ✅ Supplier & Mill tables
- ✅ Enhanced event tracking
- ✅ Google Pub/Sub event router
- ✅ Razorpay integration
- ✅ Shiprocket integration
- ✅ Basic ETL to BigQuery

**Content:**
- ✅ Sanity CMS setup
- ✅ Art form story templates
- ✅ Artist profile management
- ✅ Drop story editor

**Frontend:**
- ✅ Next.js 15 with RSC
- ✅ Product pages (with CMS stories)
- ✅ Drop landing pages
- ✅ Artist follow feature
- ✅ Art Mode / Shop Mode toggle

**AI (Basic):**
- ✅ Event tracking → Pub/Sub → BigQuery
- ✅ Basic recommendations (collaborative)
- ✅ Simple chatbot
- ✅ GA4 + Meta Pixel

**Launch Target:** Drop 1 (December 2025)

---

### Phase 2: Scale & Intelligence (Months 4-6) - **Enhanced**
**Goal:** Full AI stack + CRM + Knowledge Graph

**AI Enhanced:**
- 🔄 Visual similarity engine (CLIP)
- 🔄 Hybrid recommendation engine
- 🔄 Churn prediction model
- 🔄 Demand forecasting
- 🔄 Virtual stylist (Gemini + RAG)
- 🔄 Content generation agent

**Data & Analytics:**
- 🔄 Knowledge Graph (Neo4j)
- 🔄 CRM microservice launch
- 🔄 MLflow for model tracking
- 🔄 BI dashboard (Metabase)

**Features:**
- 🔄 NATI Circle loyalty
- 🔄 Referral program
- 🔄 Advanced search (Typesense)
- 🔄 SMS campaigns
- 🔄 Telegram bot

**Infrastructure:**
- 🔄 Edge caching (Cloudflare Workers)
- 🔄 OpenTelemetry + Grafana
- 🔄 Automated ETL (daily)

**Launch Target:** Drops 2 & 3, 50K users/month

---

### Phase 3: Global & Advanced (Months 7-12) - **Enhanced**
**Goal:** International, marketplace, advanced AI

**International:**
- ⏳ Multi-currency
- ⏳ Stripe global
- ⏳ International shipping
- ⏳ Multi-language (i18n)

**Marketplace:**
- ⏳ NATI.Collective platform
- ⏳ Artist onboarding portal
- ⏳ Commission marketplace
- ⏳ NFT-style COA (certificate of authenticity)

**AI Advanced:**
- ⏳ Dynamic pricing
- ⏳ AR try-on
- ⏳ Predictive inventory
- ⏳ Fraud detection
- ⏳ Reinforcement learning for personalization

**Supply Chain:**
- ⏳ QR code provenance tracking
- ⏳ Blockchain integration (optional)
- ⏳ IoT integration (RFID for garments)

**Mobile:**
- ⏳ React Native app
- ⏳ Push notifications
- ⏳ Mobile-optimized checkout

**Launch Target:** 1M+ users globally

---

## 6. Key Improvements Summary (v1.0 → v1.1)

| Component | v1.0 | v1.1 Enhancement |
|-----------|------|------------------|
| **Product Model** | Monolithic | Split into Core, Cultural, Analytics, Embeddings |
| **Supply Chain** | Strings | Dedicated Supplier & Mill tables with certifications |
| **Events** | Direct to DB | Pub/Sub event router with multiple consumers |
| **Analytics** | PostgreSQL only | BigQuery data warehouse + ETL |
| **Content** | Hardcoded | Sanity CMS for storytelling |
| **Customer Data** | User table only | CRM microservice with 360 view |
| **AI Recommendations** | Text-based | Hybrid (text + visual similarity via CLIP) |
| **Knowledge** | Relational only | Neo4j knowledge graph for relationships |
| **Observability** | Basic logging | OpenTelemetry + Grafana + distributed tracing |
| **Edge Performance** | None | Cloudflare Workers for caching + personalization |

---

## 7. Architecture Benefits

**Scalability:**
- Event-driven with Pub/Sub handles millions of events
- Split product model optimizes queries
- Edge caching reduces backend load
- Data warehouse separates analytics from transactions

**AI-Readiness:**
- All events flow to BigQuery for training
- Knowledge graph enables semantic reasoning
- Visual embeddings for "shop by look"
- MLflow tracks experiment history

**Operational Excellence:**
- CRM centralizes customer engagement
- CMS empowers non-technical team
- Observability with OpenTelemetry
- Automated ETL keeps warehouse fresh

**Cultural Integrity:**
- Supply chain transparency with dedicated entities
- Artist attribution and commission automation
- Story-first with CMS integration
- Provenance tracking (future: blockchain/QR)

---

## 8. Next Steps

With this v1.1 architecture, NATI is positioned as a **world-class AI-native cultural commerce platform**.

**What should we build first?**

1. **Database Schema v1.1** - Implement split product model + supply chain tables
2. **Event Router Setup** - Configure Pub/Sub with topics and subscriptions
3. **Sanity CMS** - Set up content models and integration
4. **BigQuery ETL** - Create initial ETL pipeline
5. **Visual Similarity Service** - Implement CLIP embeddings + Pinecone

**Your call - what's the priority?**
