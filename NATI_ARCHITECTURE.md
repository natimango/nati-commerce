# NATI (Native Art Textile India) - Technical Architecture
## AI-Native D2C Fashion Platform for Indian Folk Art Revival

**Version:** 1.0
**Last Updated:** 2025-10-28
**Status:** Design Phase

---

## Executive Summary

NATI is not a traditional e-commerce platform - it's a **cultural technology platform** that uses commerce as a medium to revive Indian folk art traditions. The architecture must support:

- **Art-First Product Model** - Products are carriers of cultural stories
- **Drop-Based Release System** - Scarcity, storytelling, and community engagement
- **AI-Native Operations** - Intelligence embedded from day 1, not bolted on
- **Artist Collaboration Layer** - Fair attribution, commission tracking, future marketplace
- **Ethical Supply Chain** - Full fabric and artist provenance tracking

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            NATI ECOSYSTEM                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         ┌─────────────┐ │
│  │   Frontend        │         │   Backend API     │         │   AI Layer  │ │
│  │                   │         │                   │         │             │ │
│  │ Next.js 15        │ ◄─────► │ Medusa Commerce  │ ◄─────► │ Gemini API  │ │
│  │ App Router        │         │ Custom Extensions │         │ MCP Servers │ │
│  │ React Server      │         │ PostgreSQL        │         │ LangChain   │ │
│  │ Components        │         │ Redis Cache       │         │ RAG System  │ │
│  └──────────────────┘         └──────────────────┘         └─────────────┘ │
│          │                              │                          │         │
│          │                              │                          │         │
│  ┌───────▼──────────┐         ┌────────▼─────────┐      ┌────────▼───────┐│
│  │ User Experience  │         │ Integrations      │      │ AI Agents      ││
│  │                  │         │                   │      │                ││
│  │ • Product Browse │         │ • Razorpay        │      │ • Stylist Bot  ││
│  │ • AI Stylist Chat│         │ • Stripe          │      │ • Content Gen  ││
│  │ • Drop Calendar  │         │ • Shiprocket      │      │ • Demand Pred  ││
│  │ • Story Pages    │         │ • Klaviyo         │      │ • Churn Pred   ││
│  │ • NATI Circle    │         │ • Meta/GA4        │      │ • Fabric Agent ││
│  └──────────────────┘         └───────────────────┘      └────────────────┘│
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     Cultural Data Layer                               │  │
│  │                                                                        │  │
│  │  • Folk Art Taxonomy      • Artist Profiles     • Fabric Lineage     │  │
│  │  • Drop Collections       • Story Content       • Supply Chain       │  │
│  │  • Cultural Metadata      • Commission Tracking • Provenance         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Data Models (NATI-Specific)

### 2.1 Extended Product Model

Unlike standard e-commerce, NATI products carry **cultural and artistic metadata**.

```typescript
interface NATIProduct {
  // Standard E-commerce Fields
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  variants: ProductVariant[];

  // NATI-Specific: Cultural Layer
  artForm: ArtForm;                    // Kalamkari, Ikat, Gond, etc.
  artFormId: string;
  artistCredit: ArtistCredit[];        // Multiple artists may collaborate
  fabricLineage: FabricLineage;        // Complete fabric journey
  dropCollection: DropCollection;      // Which drop/release

  // Story & Narrative
  storyTitle: string;
  storyContent: string;                // Rich markdown/HTML
  culturalContext: string;             // Historical background
  artTechnique: string;                // How it was made
  inspirationSource: string;           // What inspired this piece

  // Limited Edition Tracking
  isLimitedEdition: boolean;
  totalUnitsProduced: number;
  unitsRemaining: number;
  editionNumber?: string;              // "12/100"

  // Supply Chain Transparency
  fabricSource: string;                // Mill/weaver location
  dyeProcess: string;                  // Natural dyes used
  productionLocation: string;          // Where assembled
  sustainabilityScore: number;         // 0-100

  // Metadata for AI
  tags: string[];                      // Searchable tags
  colorPalette: string[];              // Hex codes
  season: string;                      // Summer, Winter, All-season
  occasion: string[];                  // Casual, Festive, Formal
  fitType: string;                     // Relaxed, Slim, Oversized

  // Performance Metrics
  viewCount: number;
  wishlistCount: number;
  purchaseCount: number;
  returnRate: number;
  averageRating: number;

  // SEO & Discovery
  slug: string;
  seoKeywords: string[];
  searchKeywords: string[];            // AI-optimized

  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  dropDate: Date;                      // When it went live
}

interface ArtForm {
  id: string;
  name: string;                        // "Kalamkari"
  displayName: string;                 // "కలంకారి (Kalamkari)"
  description: string;
  history: string;                     // Rich cultural history
  region: string;                      // Andhra Pradesh, Telangana
  technique: string;                   // Block-printing, hand-painting
  traditionalUse: string;              // Temple hangings, sarees
  modernAdaptation: string;            // How NATI uses it
  artisanCommunities: string[];        // Communities that practice
  images: string[];
  videoUrl?: string;
  slug: string;
}

interface ArtistCredit {
  artistId: string;
  artist: Artist;
  role: string;                        // "Pattern Designer", "Block Maker", "Textile Artist"
  contributionPercentage: number;      // For commission calculation
  creditText: string;                  // "Pattern by Ramesh Kumar"
}

interface Artist {
  id: string;
  name: string;
  bio: string;
  profileImage: string;
  artForm: string[];                   // May practice multiple forms
  location: string;
  yearsOfExperience: number;
  storyContent: string;                // Artist's story
  portfolioImages: string[];
  socialLinks?: {
    instagram?: string;
    website?: string;
  };
  totalCollaborations: number;
  totalEarnings: number;               // For transparency
  commissionRate: number;              // Percentage per sale
  payoutDetails: PayoutDetails;
  createdAt: Date;
}

interface FabricLineage {
  fabricType: string;                  // Cotton, Linen, Silk, Hemp
  fabricWeight: number;                // GSM
  source: FabricSource;
  dyeProcess: DyeProcess;
  finishing: string;                   // Enzyme wash, stone wash, etc.
  certifications: string[];            // GOTS, OEKO-TEX, etc.
  carbonFootprint?: number;            // Optional: kg CO2
}

interface FabricSource {
  millName: string;                    // "Suvetah Handlooms"
  location: string;
  weaverCommunity?: string;            // If handloom
  processingMethod: string;            // Handloom, Powerloom, Organic
  rawMaterialOrigin: string;           // "Organic cotton from Gujarat"
}

interface DyeProcess {
  type: string;                        // "Natural", "AZO-free synthetic"
  dyeIngredients: string[];            // "Indigo, turmeric, pomegranate"
  method: string;                      // "Hand-dyed", "Vat-dyed"
  waterUsage?: number;                 // Liters
  chemicalFree: boolean;
}
```

### 2.2 Drop Collection Model

Drops are the heartbeat of NATI - limited releases with storytelling.

```typescript
interface DropCollection {
  id: string;
  name: string;                        // "The Kalamkari Chronicles"
  slug: string;
  season: string;                      // "Winter 2025", "Festive 2025"
  dropNumber: number;                  // 1, 2, 3...

  // Story & Theme
  theme: string;                       // "Revival of Temple Art"
  storyContent: string;                // Long-form narrative
  inspiration: string;
  curatedBy?: string;                  // Designer/curator name

  // Timing
  launchDate: Date;
  endDate?: Date;                      // If limited time
  preAccessDate?: Date;                // For NATI Circle early access

  // Products
  products: NATIProduct[];
  totalSKUs: number;

  // Media
  heroImage: string;
  lookbookImages: string[];
  campaignVideo?: string;

  // Limited Edition
  isLimitedEdition: boolean;
  totalPiecesProduced: number;

  // Marketing
  teaserCampaign: boolean;
  waitlistEnabled: boolean;
  notifyWaitlist: boolean;

  // Performance
  viewCount: number;
  waitlistCount: number;
  conversionRate: number;
  soldOutDate?: Date;

  // AI Insights
  predictedDemand: number;             // AI-generated
  targetAudience: string[];            // Segments
  recommendedPricing: PriceRange;

  status: 'draft' | 'teaser' | 'live' | 'sold_out' | 'archived';

  createdAt: Date;
  updatedAt: Date;
}

interface PriceRange {
  min: number;
  max: number;
  recommended: number;
}
```

### 2.3 NATI Circle (Loyalty System)

Community-driven loyalty with tiers, points, and exclusive access.

```typescript
interface NATICircleMember {
  id: string;
  userId: string;
  user: User;

  // Tier System
  tier: 'Explorer' | 'Curator' | 'Collector' | 'Patron';
  tierSince: Date;
  nextTierRequirement: number;         // Points needed

  // Points System
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;

  // Achievements
  achievements: Achievement[];
  badges: Badge[];

  // Benefits
  discountPercentage: number;          // Tier-based
  earlyDropAccess: boolean;
  exclusiveDrops: boolean;
  freeShippingThreshold: number;
  personalStylist: boolean;            // For Patron tier

  // Engagement
  dropsAttended: number;               // Participated in
  productsOwned: number;
  artFormsCollected: string[];         // Which art forms purchased
  referralCount: number;
  reviewCount: number;

  // Community
  communityRole?: string;              // "Brand Ambassador", "Art Advocate"
  telegramGroupAccess: boolean;

  createdAt: Date;
  lastActivityAt: Date;
}

interface Achievement {
  id: string;
  name: string;                        // "First Drop Participant"
  description: string;
  icon: string;
  pointsAwarded: number;
  unlockedAt: Date;
}

interface Badge {
  id: string;
  name: string;                        // "Kalamkari Collector"
  description: string;
  criteria: string;                    // "Purchased 3+ Kalamkari items"
  icon: string;
  rarity: 'common' | 'rare' | 'legendary';
}
```

### 2.4 User Behavior & AI Model

Enhanced user model for AI-driven personalization.

```typescript
interface NATIUser extends User {
  // Standard User Fields
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;

  // Preferences
  preferences: {
    // Art Preferences
    favoriteArtForms: string[];        // ["Kalamkari", "Ikat"]
    artStylePreference: string;        // "Traditional", "Contemporary", "Mixed"
    colorPalette: string[];            // Preferred colors

    // Product Preferences
    fitPreference: string;             // "Relaxed", "Slim"
    sizeChart: Record<string, string>; // Saved sizes
    fabricPreference: string[];        // ["Cotton", "Linen"]
    priceRange: { min: number; max: number };

    // Cultural Interests
    regionsOfInterest: string[];       // States/regions
    storiesInterest: boolean;          // Loves reading backstories
    sustainabilityFocus: boolean;

    // Communication
    emailNotifications: boolean;
    smsNotifications: boolean;
    telegramNotifications: boolean;
    dropAlerts: boolean;
    personalizedRecommendations: boolean;
  };

  // Behavioral Metrics (for AI)
  behavior: {
    // Purchase Behavior
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lifetimeValue: number;
    firstPurchaseDate?: Date;
    lastPurchaseDate?: Date;
    purchaseFrequency: number;         // Orders per month

    // Browsing Behavior
    totalSessions: number;
    avgSessionDuration: number;
    totalPageViews: number;
    productViewCount: number;
    storyViewCount: number;            // Reads cultural stories

    // Engagement
    wishlistSize: number;
    cartAbandonmentCount: number;
    emailOpenRate: number;
    emailClickRate: number;
    reviewsWritten: number;
    referralsMade: number;

    // Art Engagement
    artFormsViewed: Record<string, number>;    // Which art forms browsed
    artFormsPurchased: Record<string, number>; // Which bought
    dropsParticipated: string[];               // Drop IDs
    artistsFollowed: string[];

    // Drop Behavior
    dropWaitlistJoins: number;
    dropPreAccessUsed: number;
    avgTimeToDropPurchase: number;     // Minutes after drop launch
  };

  // AI-Generated Insights
  aiProfile: {
    // Segmentation
    segment: 'VIP' | 'Art Enthusiast' | 'Casual Browser' | 'At-Risk' | 'Dormant';

    // Predictions
    churnProbability: number;          // 0-1
    lifetimeValuePrediction: number;
    nextPurchaseProbability: number;
    likelyPurchaseWindow: string;      // "Next 7 days"

    // Preferences (AI-inferred)
    inferredArtPreferences: string[];
    inferredPriceSegment: string;      // "Premium", "Mid-range"
    inferredOccasions: string[];       // "Festive wear", "Daily wear"

    // Recommendations
    recommendedProducts: string[];     // Product IDs
    recommendedDrops: string[];        // Drop IDs
    recommendedArtForms: string[];     // New art forms to explore

    // Engagement Strategy
    bestContactTime: string;           // "Evening 7-9 PM"
    preferredChannel: string;          // "Email", "SMS", "Telegram"
    contentType: string;               // "Story-driven", "Product-focused"

    // Risk Flags
    isHighValue: boolean;
    isAtRisk: boolean;
    requiresNurturing: boolean;

    lastAnalyzedAt: Date;
  };

  // NATI Circle Membership
  circleProfile?: NATICircleMember;

  // Addresses
  addresses: Address[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;

  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}
```

### 2.5 Event Tracking Model (Critical for AI)

```typescript
interface NATIEvent {
  id: string;

  // User Context
  userId?: string;
  sessionId: string;
  anonymousId?: string;               // For non-logged-in users

  // Event Details
  eventType: NATIEventType;
  eventName: string;
  eventCategory: 'product' | 'drop' | 'story' | 'checkout' | 'engagement';

  // Context Objects
  productId?: string;
  dropId?: string;
  artistId?: string;
  artFormId?: string;
  orderId?: string;

  // Event Properties
  properties: Record<string, any>;

  // Examples of properties by event type:
  // product_viewed: { product_name, art_form, price, from_page }
  // drop_waitlist_joined: { drop_name, days_before_launch }
  // story_read: { story_title, time_spent, scroll_depth }
  // add_to_cart: { product_id, quantity, variant, from_recommendation }
  // checkout_completed: { order_value, items_count, payment_method }

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
  timeOnPage?: number;                // seconds
  scrollDepth?: number;               // percentage
  clickPath?: string[];               // Journey within session

  // Timing
  timestamp: Date;
  serverTimestamp: Date;

  // Integration
  sentToAnalytics: boolean;           // GA4, Amplitude
  sentToAI: boolean;                  // Fed to AI models

  createdAt: Date;
}

type NATIEventType =
  // Product Events
  | 'product_viewed'
  | 'product_zoomed'
  | 'product_wishlisted'
  | 'product_unwishlisted'
  | 'product_shared'
  | 'product_compared'
  | 'product_review_written'

  // Drop Events
  | 'drop_viewed'
  | 'drop_waitlist_joined'
  | 'drop_notification_sent'
  | 'drop_notification_opened'
  | 'drop_launch_participated'
  | 'drop_sold_out'

  // Story/Content Events
  | 'story_viewed'
  | 'story_shared'
  | 'art_form_explored'
  | 'artist_profile_viewed'

  // Cart Events
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'cart_viewed'
  | 'cart_abandoned'

  // Checkout Events
  | 'checkout_started'
  | 'checkout_step_completed'
  | 'checkout_completed'
  | 'payment_initiated'
  | 'payment_succeeded'
  | 'payment_failed'

  // Order Events
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_returned'
  | 'order_reviewed'

  // Engagement Events
  | 'email_opened'
  | 'email_clicked'
  | 'sms_clicked'
  | 'telegram_engaged'
  | 'referral_sent'
  | 'referral_converted'

  // Loyalty Events
  | 'circle_joined'
  | 'tier_upgraded'
  | 'points_earned'
  | 'points_redeemed'
  | 'achievement_unlocked'
  | 'badge_earned'

  // AI Interaction Events
  | 'ai_chat_started'
  | 'ai_recommendation_viewed'
  | 'ai_recommendation_clicked'
  | 'ai_styling_accepted';
```

---

## 3. Tech Stack (Confirmed)

### 3.1 Frontend
```
Framework:       Next.js 15 (App Router)
Language:        TypeScript
UI Library:      React 19 (Server Components)
Styling:         Tailwind CSS + shadcn/ui
State:           React Context + Zustand (client state)
Forms:           React Hook Form + Zod validation
API Layer:       Next.js Server Actions + API Routes
Real-time:       WebSockets for live drop countdown
Image CDN:       Cloudinary or Vercel Image Optimization
Analytics:       GA4, Meta Pixel, custom events
```

### 3.2 Backend
```
E-commerce:      Medusa.js 2.0 (headless commerce)
Database:        PostgreSQL 15+
ORM:             Prisma (with Medusa)
Cache:           Redis (sessions, product cache)
Search:          Algolia or Typesense (product search)
File Storage:    AWS S3 / Google Cloud Storage
Job Queue:       BullMQ (Redis-based)
Email:           Klaviyo (campaigns) + Resend (transactional)
SMS:             Gupshup or Kaleyra
Payments:        Razorpay (India) + Stripe (Global)
Shipping:        Shiprocket API
```

### 3.3 AI Layer
```
Primary LLM:     Google Gemini 2.0 Flash (via API)
Framework:       LangChain + LangGraph (agent orchestration)
Vector DB:       Pinecone or Chroma (for RAG)
MCP Servers:     Custom MCP servers for fabric research, content gen
ML/Analytics:    Python microservices (FastAPI)
                 - Recommendation engine (collaborative filtering)
                 - Churn prediction (XGBoost)
                 - Demand forecasting (Prophet)
                 - Sentiment analysis (reviews)
```

### 3.4 Infrastructure
```
Hosting:         Vercel (frontend) + Google Cloud Run (backend)
Database:        Google Cloud SQL (PostgreSQL)
Cache/Queue:     Google Cloud Memorystore (Redis)
Storage:         Google Cloud Storage
CDN:             Cloudflare
Monitoring:      Sentry (errors) + Google Cloud Monitoring
Logging:         Google Cloud Logging + Datadog
CI/CD:           GitHub Actions
```

---

## 4. AI Integration Architecture

### 4.1 AI Agents & Their Roles

```typescript
// AI Agent Registry for NATI

interface AIAgent {
  name: string;
  purpose: string;
  model: string;
  endpoints: string[];
  dataSources: string[];
}

const NATIAIAgents: AIAgent[] = [
  {
    name: "Virtual Stylist",
    purpose: "Personalized product recommendations and styling advice",
    model: "Gemini 2.0 Flash",
    endpoints: ["/api/ai/stylist/chat", "/api/ai/stylist/recommend"],
    dataSources: ["user_preferences", "browse_history", "order_history", "product_catalog"]
  },

  {
    name: "Content Generator",
    purpose: "Product descriptions, email copy, social posts, story content",
    model: "Gemini 2.0 Pro",
    endpoints: ["/api/ai/content/generate", "/api/ai/content/rewrite"],
    dataSources: ["product_metadata", "art_form_data", "artist_profiles", "brand_voice"]
  },

  {
    name: "Demand Forecaster",
    purpose: "Predict demand for drops, optimize inventory",
    model: "Python ML Service (Prophet + XGBoost)",
    endpoints: ["/api/ai/forecast/demand", "/api/ai/forecast/inventory"],
    dataSources: ["order_history", "event_stream", "seasonal_trends", "drop_performance"]
  },

  {
    name: "Churn Predictor",
    purpose: "Identify at-risk customers for retention campaigns",
    model: "Python ML Service (XGBoost)",
    endpoints: ["/api/ai/predict/churn", "/api/ai/segment/users"],
    dataSources: ["user_behavior", "engagement_metrics", "order_frequency", "email_engagement"]
  },

  {
    name: "Campaign Orchestrator",
    purpose: "Trigger personalized campaigns based on behavior",
    model: "Rule Engine + Gemini (for copy)",
    endpoints: ["/api/ai/campaign/trigger", "/api/ai/campaign/personalize"],
    dataSources: ["user_segments", "event_stream", "campaign_templates", "performance_history"]
  },

  {
    name: "Fabric Research Agent",
    purpose: "Research fabrics, mills, dye processes for sourcing",
    model: "Gemini 2.0 Flash + MCP Filesystem Server",
    endpoints: ["/api/ai/fabric/research", "/api/ai/fabric/suppliers"],
    dataSources: ["web_search", "supplier_database", "sustainability_reports", "local_files"]
  },

  {
    name: "Search & Discovery Agent",
    purpose: "Natural language product search and discovery",
    model: "Gemini + Vector Search (Pinecone)",
    endpoints: ["/api/ai/search", "/api/ai/discover"],
    dataSources: ["product_embeddings", "art_form_taxonomy", "search_history", "trending_products"]
  },

  {
    name: "Review Analyzer",
    purpose: "Sentiment analysis, extract insights from reviews",
    model: "Gemini 2.0 Flash",
    endpoints: ["/api/ai/reviews/analyze", "/api/ai/reviews/insights"],
    dataSources: ["product_reviews", "customer_feedback", "return_reasons"]
  }
];
```

### 4.2 AI Data Pipeline

```
┌────────────────────────────────────────────────────────────────────┐
│                       AI DATA PIPELINE                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Data Collection                                                    │
│  ├─ User Events (browsing, clicks, purchases)                      │
│  ├─ Product Interactions (views, wishlists, carts)                 │
│  ├─ Drop Performance (conversion rates, sell-through)              │
│  ├─ Marketing Engagement (email, SMS, Telegram)                    │
│  └─ Customer Feedback (reviews, support tickets)                   │
│                                                                     │
│                    ↓                                                │
│                                                                     │
│  Data Processing & Storage                                          │
│  ├─ PostgreSQL (structured data: orders, users, products)          │
│  ├─ Redis (real-time: sessions, carts, live drops)                 │
│  ├─ Event Store (time-series: all behavioral events)               │
│  └─ Vector DB (embeddings: products, art forms, stories)           │
│                                                                     │
│                    ↓                                                │
│                                                                     │
│  Feature Engineering                                                │
│  ├─ User Features (RFM, CLV, art preferences, engagement)          │
│  ├─ Product Features (popularity, conversion, return rate)         │
│  ├─ Contextual Features (time, device, location, campaign)         │
│  └─ Behavioral Features (session patterns, click paths)            │
│                                                                     │
│                    ↓                                                │
│                                                                     │
│  AI Models & Agents                                                 │
│  ├─ Recommendation System                                           │
│  │   ├─ Collaborative Filtering                                    │
│  │   ├─ Content-Based Filtering                                    │
│  │   └─ Hybrid Approach                                            │
│  │                                                                  │
│  ├─ Predictive Models                                               │
│  │   ├─ Churn Prediction (XGBoost)                                 │
│  │   ├─ LTV Prediction (Regression)                                │
│  │   ├─ Demand Forecasting (Prophet)                               │
│  │   └─ Next-Purchase Prediction (LSTM)                            │
│  │                                                                  │
│  ├─ NLP & Generation                                                │
│  │   ├─ Product Search (Vector Similarity)                         │
│  │   ├─ Content Generation (Gemini)                                │
│  │   ├─ Sentiment Analysis (Reviews)                               │
│  │   └─ Chatbot/Stylist (Gemini + RAG)                             │
│  │                                                                  │
│  └─ Segmentation & Clustering                                       │
│      ├─ User Segmentation (K-means, DBSCAN)                        │
│      ├─ Product Clustering (Similarity)                            │
│      └─ Art Form Affinity Mapping                                  │
│                                                                     │
│                    ↓                                                │
│                                                                     │
│  Actions & Outputs                                                  │
│  ├─ Personalized Recommendations (real-time)                        │
│  ├─ Triggered Campaigns (email, SMS, push)                         │
│  ├─ Dynamic Content (product descriptions, stories)                │
│  ├─ Inventory Optimization (demand-driven)                         │
│  ├─ Pricing Strategy (competitive + demand-based)                  │
│  └─ Admin Insights (dashboards, alerts)                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Drop Management System

### 5.1 Drop Lifecycle

```
┌──────────────────────────────────────────────────────────────────┐
│                     DROP LIFECYCLE                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. PLANNING                                                      │
│     ├─ Art Form Selection                                         │
│     ├─ Artist Collaboration                                       │
│     ├─ Product Design                                             │
│     ├─ Story Development                                          │
│     └─ Production Planning                                        │
│                                                                   │
│  2. TEASER PHASE (T-30 days)                                      │
│     ├─ Teaser Campaign Launch                                     │
│     ├─ Waitlist Opens                                             │
│     ├─ Behind-the-Scenes Content                                  │
│     ├─ Artist Stories Published                                   │
│     └─ Social Media Buzz                                          │
│                                                                   │
│  3. PRE-ACCESS (T-7 days)                                         │
│     ├─ NATI Circle Early Access                                   │
│     │   └─ Curator/Collector/Patron tiers get 48h early          │
│     ├─ Lookbook Release                                           │
│     ├─ Email/SMS Notifications                                    │
│     └─ Pre-orders Open (limited)                                  │
│                                                                   │
│  4. LAUNCH (T-0)                                                  │
│     ├─ Public Drop Goes Live                                      │
│     ├─ Real-time Inventory Updates                                │
│     ├─ Live Chat Support                                          │
│     ├─ Social Media Push                                          │
│     └─ AI Recommendations Active                                  │
│                                                                   │
│  5. ACTIVE SELLING (T+1 to T+30)                                  │
│     ├─ Daily Performance Monitoring                               │
│     ├─ Restock Alerts (if applicable)                             │
│     ├─ User-Generated Content Sharing                             │
│     ├─ Review Collection                                          │
│     └─ Retargeting Campaigns                                      │
│                                                                   │
│  6. WIND-DOWN                                                     │
│     ├─ Final Stock Clearance                                      │
│     ├─ "Last Chance" Campaigns                                    │
│     └─ Sold Out Announcement                                      │
│                                                                   │
│  7. POST-DROP ANALYSIS                                            │
│     ├─ Sales Performance Review                                   │
│     ├─ AI Insights Generation                                     │
│     ├─ Customer Feedback Analysis                                 │
│     ├─ Artist Commission Payout                                   │
│     └─ Learnings for Next Drop                                    │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### 5.2 Drop Management Features

```typescript
// Admin: Create & Manage Drops

interface DropManagementFeatures {
  // Planning
  dropCalendar: "Visual calendar of upcoming drops";
  productBundling: "Group products into collections";
  storyEditor: "Rich text editor for narratives";
  mediaUploader: "Bulk upload lookbook images/videos";
  artistSelection: "Link artists and set commission %";

  // Teaser Campaign
  waitlistBuilder: "Create waitlist with email capture";
  teaserScheduler: "Schedule teaser content";
  socialMediaKit: "Auto-generate social posts";

  // Inventory
  stockAllocation: "Allocate inventory to drop";
  variantManagement: "Sizes, colors per product";
  limitedEditionTracking: "Edition numbers (1/100, 2/100)";
  realTimeInventory: "Live stock updates";

  // Launch
  dropCountdown: "Live countdown timer on site";
  notificationBlast: "Send to waitlist + Circle members";
  earlyAccessConfig: "Set hours for each tier";

  // Monitoring
  liveDashboard: "Real-time sales, traffic, conversions";
  aiInsights: "Suggested actions during drop";
  lowStockAlerts: "Auto-notify for restock";

  // Post-Drop
  performanceReport: "Detailed analytics report";
  customerSegmentation: "Who bought what";
  repeatPurchaseTracking: "Return customers";
  commissionCalculator: "Auto-calculate artist payments";
}
```

---

## 6. API Architecture

### 6.1 API Endpoints (RESTful + GraphQL Hybrid)

```
BASE URL: https://api.nati.store/v1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET     /products                        List products with filters
GET     /products/:id                    Get product details
GET     /products/:id/story              Get product story/narrative
GET     /products/:id/recommendations    AI-powered related products
GET     /products/search                 Full-text + AI search
POST    /products/:id/track-view         Track product view event

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DROPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET     /drops                           List all drops (past + upcoming)
GET     /drops/current                   Get current live drop
GET     /drops/:id                       Get drop details + products
POST    /drops/:id/waitlist              Join drop waitlist
GET     /drops/:id/countdown             Live countdown data
POST    /drops/:id/notify                Opt-in for notifications

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ART FORMS & ARTISTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET     /art-forms                       List all art forms
GET     /art-forms/:id                   Get art form details + history
GET     /art-forms/:id/products          Products featuring this art
GET     /artists                         List all artists
GET     /artists/:id                     Get artist profile + portfolio
GET     /artists/:id/products            Products by this artist

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USERS & AUTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST    /auth/register                   Register new user
POST    /auth/login                      Login
POST    /auth/logout                     Logout
GET     /users/me                        Get current user profile
PATCH   /users/me                        Update profile
PATCH   /users/me/preferences            Update preferences
GET     /users/me/orders                 Order history
GET     /users/me/wishlist               Wishlist
POST    /users/me/wishlist               Add to wishlist
DELETE  /users/me/wishlist/:productId    Remove from wishlist

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NATI CIRCLE (LOYALTY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET     /circle/me                       My Circle profile
GET     /circle/me/points                Points balance
GET     /circle/me/achievements          Achievements & badges
GET     /circle/tiers                    Tier info & benefits
POST    /circle/join                     Join NATI Circle
POST    /circle/redeem                   Redeem points

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CART & CHECKOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET     /cart                            Get cart
POST    /cart/add                        Add to cart
PATCH   /cart/update                     Update quantity
DELETE  /cart/:itemId                    Remove item
POST    /checkout/initiate               Start checkout
POST    /checkout/apply-discount         Apply promo code
POST    /checkout/complete               Complete order

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET     /orders/:id                      Get order details
GET     /orders/:id/track                Track shipment
POST    /orders/:id/cancel               Cancel order
POST    /orders/:id/return               Initiate return

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI AGENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST    /ai/stylist/chat                 Chat with AI stylist
POST    /ai/recommendations/personalized Get personalized recs
POST    /ai/search                       Natural language search
GET     /ai/insights/user/:userId        User behavior insights
GET     /ai/insights/product/:productId  Product performance insights

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVENTS & ANALYTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST    /events/track                    Track custom event
POST    /events/batch                    Batch event tracking

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN (Protected)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET     /admin/dashboard                 Dashboard metrics
GET     /admin/drops                     Manage drops
POST    /admin/drops                     Create drop
PATCH   /admin/drops/:id                 Update drop
GET     /admin/analytics/sales           Sales analytics
GET     /admin/analytics/users           User analytics
GET     /admin/artists                   Manage artists
POST    /admin/artists/:id/payout        Process artist payout
```

---

## 7. Database Schema (PostgreSQL)

See separate file: `NATI_DATABASE_SCHEMA.sql`

Key tables:
- `users` - User accounts with AI profiles
- `products` - Products with cultural metadata
- `art_forms` - Folk art taxonomy
- `artists` - Artist profiles and credits
- `drops` - Drop collections
- `orders` - Orders and items
- `user_events` - Behavioral tracking
- `nati_circle_members` - Loyalty program
- `achievements` - Gamification
- `fabric_lineages` - Supply chain tracking

---

## 8. Implementation Roadmap

### Phase 1: MVP (Months 1-3)
**Goal:** Launch first drop with basic AI features

**Backend:**
- ✅ Medusa.js setup with PostgreSQL
- ✅ Core data models (Products, Orders, Users)
- ✅ Extended models (ArtForms, Artists, Drops)
- ✅ Authentication & authorization
- ✅ Payment integration (Razorpay)
- ✅ Shipping integration (Shiprocket)
- ✅ Email service (Klaviyo)

**Frontend:**
- ✅ Next.js 15 setup with App Router
- ✅ Product listing & detail pages
- ✅ Cart & checkout flow
- ✅ Drop landing page
- ✅ Story pages (art forms, artists)
- ✅ User authentication
- ✅ Responsive design (mobile-first)

**AI (Basic):**
- ✅ Basic product recommendations (collaborative filtering)
- ✅ Simple chatbot (FAQ-style)
- ✅ Event tracking setup
- ✅ GA4 + Meta Pixel integration

**Admin:**
- ✅ Medusa Admin for order management
- ✅ Basic drop creation
- ✅ Product management

**Launch Target:** Drop 1 (December 2025)

---

### Phase 2: Scale & Intelligence (Months 4-6)
**Goal:** Enhance AI, launch NATI Circle, optimize operations

**AI Enhanced:**
- 🔄 Advanced recommendation engine (hybrid model)
- 🔄 Churn prediction model
- 🔄 Demand forecasting for drops
- 🔄 AI content generation (product descriptions)
- 🔄 Virtual stylist (conversational AI)
- 🔄 Sentiment analysis on reviews

**Features:**
- 🔄 NATI Circle loyalty system
- 🔄 Waitlist & pre-access for drops
- 🔄 Referral program
- 🔄 Advanced search (Algolia/Typesense)
- 🔄 SMS campaigns (Gupshup)
- 🔄 Telegram community bot

**Admin:**
- 🔄 Drop performance dashboard
- 🔄 AI insights panel
- 🔄 Customer segmentation tool
- 🔄 Artist commission automation

**Launch Target:** Drops 2 & 3, Scale to 50K users/month

---

### Phase 3: Global & Marketplace (Months 7-12)
**Goal:** International expansion, artist marketplace

**International:**
- ⏳ Multi-currency support
- ⏳ Stripe integration (global)
- ⏳ International shipping
- ⏳ Multi-language support (Japanese, European langs)

**Marketplace:**
- ⏳ NATI.Collective platform
- ⏳ Artist onboarding & verification
- ⏳ Commission marketplace for custom work
- ⏳ Auction system for rare pieces

**AI Advanced:**
- ⏳ Dynamic pricing engine
- ⏳ Visual search (image-based)
- ⏳ AR try-on (experimental)
- ⏳ Predictive inventory optimization
- ⏳ Fraud detection

**Mobile:**
- ⏳ Native mobile app (React Native)
- ⏳ Push notifications
- ⏳ Mobile-first checkout

**Launch Target:** International markets, 1M+ users

---

## 9. Key Differentiators (Why NATI's Architecture is Unique)

1. **Cultural Metadata Layer**
   - Unlike generic e-commerce, every product carries deep cultural context
   - Art forms, artists, fabric provenance tracked at database level

2. **Drop-Native Architecture**
   - Built for scarcity and storytelling, not just always-available inventory
   - Waitlist, pre-access, countdown systems core to the platform

3. **Artist-Centric Commerce**
   - Artist attribution, commission tracking, payout automation built-in
   - Future-ready for artist marketplace model

4. **AI-First, Not AI-Bolted**
   - Event tracking, behavioral analysis, predictions from day 1
   - Every data point captured for ML training

5. **Community as a Feature**
   - NATI Circle loyalty system deeply integrated
   - Gamification, achievements, exclusive access

6. **Ethical Supply Chain Transparency**
   - Fabric lineage, dye processes, sustainability scores
   - Full traceability from raw material to customer

7. **Story-Driven Commerce**
   - Products are narratives, not just items
   - Content management system for cultural stories

---

## 10. Success Metrics

**Business Metrics:**
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (CLV)
- Average Order Value (AOV)
- Repeat Purchase Rate
- Drop Sell-Through Rate

**Product Metrics:**
- Conversion Rate (Overall, Per Drop)
- Cart Abandonment Rate
- Wishlist to Purchase Rate
- Product Return Rate
- Time to Sell-Out (for drops)

**Engagement Metrics:**
- Active Users (Daily/Monthly)
- Session Duration
- Story Page Views
- Art Form Exploration Rate
- NATI Circle Participation Rate

**AI Metrics:**
- Recommendation Click-Through Rate
- Recommendation Conversion Rate
- Churn Prediction Accuracy
- Demand Forecast Accuracy
- Chatbot Resolution Rate

**Community Metrics:**
- NATI Circle Enrollment Rate
- Tier Upgrade Rate
- Referral Conversion Rate
- User-Generated Content Volume

---

## Next Steps: Ready to Build

This architecture is designed specifically for NATI's vision of:
- **Reviving folk art through fashion**
- **AI-native D2C commerce**
- **Community-driven luxury**
- **Transparent, ethical production**

**Let's start building. What component should we tackle first?**

1. **Database Setup** - Create PostgreSQL schema + Prisma models
2. **Medusa Backend** - Configure e-commerce core + extensions
3. **Next.js Frontend** - Build product pages + drop system
4. **AI Layer** - Set up Gemini integration + first agents
5. **Event Tracking** - Implement comprehensive behavioral tracking

**Your call. What's the priority?**
