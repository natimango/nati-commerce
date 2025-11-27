# D2C Analytics Architecture Review: NATI Commerce
## Comprehensive Analysis for Maximum Consumer Insights & AI Marketing Brain

**Reviewed:** 2025-11-24
**Version Analyzed:** v1.2 (Gemini Brain Consolidated)
**Review Type:** D2C Analytics Maturity Assessment

---

## Executive Summary

### Overall Grade: **B+ (Very Strong Foundation, Key Gaps Identified)**

**Strengths:**
- ✅ Excellent event tracking architecture with multi-channel support
- ✅ Strong cultural data layer (unique differentiator)
- ✅ Comprehensive CRM schema with health scoring
- ✅ AI-native design with proper embeddings infrastructure
- ✅ Good attribution tracking (UTM parameters)
- ✅ Solid data warehouse strategy (BigQuery)

**Critical Gaps for D2C Excellence:**
- ❌ Missing conversion funnel tracking & optimization
- ❌ Incomplete customer journey analytics
- ❌ Limited real-time personalization capabilities
- ❌ No A/B testing framework
- ❌ Missing product affinity & market basket analysis
- ❌ Incomplete attribution modeling (single-touch only)
- ❌ No customer lifetime value (CLV) prediction
- ❌ Missing inventory intelligence & stockout prevention
- ❌ Limited social proof & FOMO mechanics

---

## Part 1: What's Already Implemented (Comprehensive Review)

### ✅ 1.1 Event Tracking Infrastructure (Score: 9/10)

**Excellent Foundation:**
```sql
events.user_events schema includes:
- Multi-channel tracking (web, mobile, telegram, email, SMS)
- Journey ID for cross-session tracking
- Full device/browser fingerprinting
- UTM attribution parameters
- Scroll depth & time on page
- JSONB properties for flexibility
- Table partitioning by month
- Integration flags (GA4, AI, Pub/Sub)
```

**Strong Points:**
- Multi-platform support (web, mobile, Telegram, email, SMS)
- Journey tracking across sessions
- Event deduplication (5-min window)
- Feature engineering in Event Router
- Partitioned storage for performance

**Missing:**
- ❌ No funnel step tracking (awareness → consideration → purchase → loyalty)
- ❌ Micro-conversion events (video plays, zoom clicks, size guide opens)
- ❌ Form abandonment tracking (address form, payment form)
- ❌ Search analytics (queries, results, no-results)
- ❌ Error/frustration event tracking

---

### ✅ 1.2 Product Analytics (Score: 7/10)

**Good Coverage:**
```sql
ai.product_analytics includes:
- View counts & unique views
- Wishlist & share counts
- Purchase counts & revenue
- Return rates & ratings
- Drop performance metrics
- AI scores (popularity, recommendation)
- Temporal patterns (peak hours, best days)
```

**Missing Critical Metrics:**
- ❌ Add-to-cart rate (view → cart conversion)
- ❌ Cart-to-purchase rate (cart → checkout conversion)
- ❌ Product page bounce rate
- ❌ Average time on product page
- ❌ Size/variant selection patterns
- ❌ Cross-sell performance (bought together)
- ❌ Price elasticity & discount effectiveness
- ❌ Inventory velocity & reorder triggers

---

### ✅ 1.3 Customer Profile & CRM (Score: 8/10)

**Strong Customer Intelligence:**
```sql
crm.customer_profiles includes:
- Health score (0-100) with trend
- Lifecycle stage tracking
- Email/SMS engagement rates
- Support ticket metrics
- Days inactive & engagement score
- AI-powered next best action
- Predicted churn date
```

**Excellent Features:**
- Multi-channel communication tracking
- Health score with trending
- Predicted churn date
- Next best action recommendations

**Missing Key Metrics:**
- ❌ Customer Lifetime Value (CLV) prediction
- ❌ Recency, Frequency, Monetary (RFM) score in profile
- ❌ Product category preferences
- ❌ Average Order Value (AOV) & trend
- ❌ Purchase frequency & seasonality
- ❌ Price sensitivity segment
- ❌ Preferred communication channel
- ❌ Influence score (referrals, social sharing)

---

### ✅ 1.4 AI & Embeddings Infrastructure (Score: 8/10)

**Solid AI Foundation:**
```sql
ai.product_embeddings includes:
- Description embeddings (768 dims)
- Story embeddings
- Image embeddings (Gemini Vision)
- Combined multimodal embeddings
- HNSW indexing for fast similarity
- Hot/cold separation strategy
```

**AI Gateway Features:**
- Multi-provider fallback (Gemini → OpenAI → Claude)
- Response caching (1hr chat, 24hr embeddings)
- Usage tracking & cost monitoring
- Rate limiting

**Missing for Marketing Intelligence:**
- ❌ Customer embeddings (behavioral similarity)
- ❌ Session embeddings (journey similarity)
- ❌ Search query embeddings
- ❌ Content embeddings (blog posts, emails)
- ❌ Cross-modal search (text → image, image → text)
- ❌ Trend detection embeddings

---

### ✅ 1.5 Cultural Data Layer (Score: 10/10) 🌟

**Unique Differentiator - Excellent:**
```sql
cultural.* schemas include:
- Art forms taxonomy with history
- Artist profiles with earnings tracking
- Fabric lineage & supply chain transparency
- Mills & suppliers with sustainability scores
- Artist attribution & commission calculation
- Artist follow system
```

**Outstanding Features:**
- Complete supply chain transparency
- Sustainability scoring
- Artist collaboration tracking
- Cultural storytelling data model
- Provenance tracking (blockchain-ready)

**This is NATI's secret weapon for differentiation!**

---

### ✅ 1.6 Drop System Analytics (Score: 7/10)

**Good Drop Tracking:**
```sql
drops.collections includes:
- View counts & waitlist counts
- Unique buyers & total revenue
- Conversion rate & sold-out date
- AI-predicted demand
- Target audience segments
- Recommended pricing
```

**Missing FOMO & Urgency Metrics:**
- ❌ Countdown engagement rate
- ❌ Pre-access conversion vs public access
- ❌ Waitlist-to-purchase conversion
- ❌ Real-time demand signals
- ❌ Scarcity effectiveness metrics
- ❌ Drop anticipation score (buzz measurement)

---

## Part 2: Critical Gaps for D2C Excellence

### ❌ 2.1 Conversion Funnel Analysis (MISSING - HIGH PRIORITY)

**What's Needed:**
```sql
-- RECOMMENDED NEW TABLE
CREATE TABLE analytics.conversion_funnels (
  id UUID PRIMARY KEY,
  user_id UUID,
  session_id VARCHAR(255),
  funnel_type VARCHAR(50), -- 'purchase', 'drop_waitlist', 'artist_follow'

  -- Funnel Steps (timestamps)
  step_1_awareness_at TIMESTAMPTZ,      -- Landing/Product view
  step_2_interest_at TIMESTAMPTZ,       -- Scroll >50%, time >30s
  step_3_consideration_at TIMESTAMPTZ,  -- Multiple views, size guide
  step_4_intent_at TIMESTAMPTZ,         -- Add to cart
  step_5_action_at TIMESTAMPTZ,         -- Checkout start
  step_6_conversion_at TIMESTAMPTZ,     -- Purchase complete

  -- Drop-off Analysis
  dropped_at_step INTEGER,
  drop_reason VARCHAR(100),             -- 'price', 'shipping', 'payment_error'

  -- Context
  product_id UUID,
  drop_id UUID,
  source_channel VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for funnel analysis
CREATE INDEX idx_funnel_user ON analytics.conversion_funnels(user_id);
CREATE INDEX idx_funnel_dropped ON analytics.conversion_funnels(dropped_at_step);
CREATE INDEX idx_funnel_product ON analytics.conversion_funnels(product_id);
```

**Why This Matters:**
- Identify where customers drop off
- Optimize each stage of the journey
- A/B test interventions at drop-off points
- Calculate stage-wise conversion rates
- Measure impact of UX changes

**Recommended Metrics:**
```sql
-- Funnel Conversion Rates
SELECT
  funnel_type,
  COUNT(*) as total_entries,
  COUNT(step_2_interest_at) / COUNT(*) as awareness_to_interest_rate,
  COUNT(step_4_intent_at) / COUNT(*) as interest_to_intent_rate,
  COUNT(step_6_conversion_at) / COUNT(step_4_intent_at) as cart_to_purchase_rate,
  COUNT(step_6_conversion_at) / COUNT(*) as overall_conversion_rate,
  AVG(EXTRACT(EPOCH FROM (step_6_conversion_at - step_1_awareness_at))) as avg_time_to_convert_seconds
FROM analytics.conversion_funnels
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY funnel_type;
```

---

### ❌ 2.2 Customer Lifetime Value (CLV) Prediction (MISSING - HIGH PRIORITY)

**What's Needed:**
```sql
-- RECOMMENDED NEW TABLE
CREATE TABLE ai.customer_ltv (
  user_id UUID PRIMARY KEY REFERENCES core.users(id),

  -- Historical Value
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  avg_order_value DECIMAL(10,2),
  first_purchase_date DATE,
  last_purchase_date DATE,
  days_since_first_purchase INTEGER,
  purchase_frequency DECIMAL(8,4),        -- Purchases per month

  -- Predicted Value (ML Model)
  predicted_ltv_12_months DECIMAL(12,2),
  predicted_ltv_24_months DECIMAL(12,2),
  predicted_ltv_lifetime DECIMAL(12,2),

  -- Segmentation
  ltv_segment VARCHAR(20),                -- 'whale', 'high_value', 'mid_value', 'low_value'
  ltv_percentile INTEGER,                 -- 0-100

  -- Purchase Patterns
  preferred_categories TEXT[],
  preferred_art_forms TEXT[],
  avg_discount_used DECIMAL(5,2),
  price_sensitivity VARCHAR(20),          -- 'high', 'medium', 'low'

  -- Retention Metrics
  retention_probability DECIMAL(5,4),     -- 0-1
  next_purchase_date_predicted DATE,
  days_until_next_purchase INTEGER,

  -- Marketing Efficiency
  customer_acquisition_cost DECIMAL(10,2),
  ltv_to_cac_ratio DECIMAL(8,2),

  last_calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ltv_segment ON ai.customer_ltv(ltv_segment);
CREATE INDEX idx_ltv_predicted ON ai.customer_ltv(predicted_ltv_12_months DESC);
CREATE INDEX idx_ltv_percentile ON ai.customer_ltv(ltv_percentile DESC);
```

**Why This Matters:**
- **Prioritize high-value customers** for retention campaigns
- **Optimize marketing spend** (know how much to pay for acquisition)
- **Personalize experiences** based on predicted value
- **Identify whales early** (top 1% of customers drive 30-40% of revenue)
- **Prevent churn of high-LTV customers**

**Recommended ML Features:**
```python
# CLV Prediction Model Features
features = {
    "recency": days_since_last_purchase,
    "frequency": total_orders,
    "monetary": avg_order_value,
    "tenure": days_since_first_purchase,
    "engagement_score": crm.customer_profiles.engagement_score,
    "art_form_diversity": count(distinct art_forms purchased),
    "drops_attended": count(drop purchases),
    "email_engagement": email_open_rate * email_click_rate,
    "social_sharing": share_count,
    "artist_follows": count(artist follows),
    "return_rate": returns / total_orders,
    "avg_time_between_purchases": avg days between orders,
}
```

---

### ❌ 2.3 Product Affinity & Market Basket Analysis (MISSING - HIGH PRIORITY)

**What's Needed:**
```sql
-- RECOMMENDED NEW TABLE
CREATE TABLE ai.product_affinity (
  product_a_id UUID REFERENCES core.products(id),
  product_b_id UUID REFERENCES core.products(id),

  -- Co-occurrence Metrics
  times_viewed_together INTEGER DEFAULT 0,
  times_carted_together INTEGER DEFAULT 0,
  times_purchased_together INTEGER DEFAULT 0,

  -- Association Rules
  support DECIMAL(8,6),                   -- P(A ∩ B)
  confidence DECIMAL(8,6),                -- P(B|A)
  lift DECIMAL(8,4),                      -- Confidence / P(B)

  -- Recommendation Strength
  affinity_score DECIMAL(5,4),            -- 0-1 (weighted combination)

  -- Context
  typical_purchase_order VARCHAR(20),     -- 'A_then_B', 'B_then_A', 'simultaneous'
  avg_time_between_purchases_days INTEGER,

  -- Performance
  recommendation_shown_count INTEGER DEFAULT 0,
  recommendation_click_count INTEGER DEFAULT 0,
  recommendation_conversion_count INTEGER DEFAULT 0,
  recommendation_ctr DECIMAL(5,4),
  recommendation_conversion_rate DECIMAL(5,4),

  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (product_a_id, product_b_id)
);

CREATE INDEX idx_affinity_score ON ai.product_affinity(affinity_score DESC);
CREATE INDEX idx_affinity_product_a ON ai.product_affinity(product_a_id, affinity_score DESC);
```

**Why This Matters:**
- **"Complete the look"** recommendations (saree + jewelry)
- **Upsell & cross-sell** (higher AOV)
- **Bundle creation** (curated sets)
- **Email campaigns** ("You bought X, you'll love Y")
- **Dynamic homepage** (show complementary products)

**Recommended Queries:**
```sql
-- Top Cross-Sell Opportunities
SELECT
  pa.product_a_id,
  p_a.name as product_a_name,
  pa.product_b_id,
  p_b.name as product_b_name,
  pa.lift,
  pa.affinity_score,
  pa.recommendation_conversion_rate
FROM ai.product_affinity pa
JOIN core.products p_a ON pa.product_a_id = p_a.id
JOIN core.products p_b ON pa.product_b_id = p_b.id
WHERE pa.lift > 1.5  -- B is 50% more likely to be bought when A is bought
  AND pa.recommendation_conversion_rate > 0.1  -- 10%+ conversion
ORDER BY pa.affinity_score DESC
LIMIT 50;
```

---

### ❌ 2.4 A/B Testing Framework (MISSING - CRITICAL)

**What's Needed:**
```sql
-- RECOMMENDED NEW TABLES
CREATE TABLE experiments.ab_tests (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  hypothesis TEXT,

  -- Test Configuration
  test_type VARCHAR(50),                  -- 'UI', 'pricing', 'email', 'recommendation'
  variants JSONB,                         -- [{"name": "control", "config": {...}}, {"name": "variant_a", ...}]
  traffic_split JSONB,                    -- {"control": 0.5, "variant_a": 0.5}

  -- Targeting
  audience_filter JSONB,                  -- {"segment": "new_users", "country": "India"}

  -- Metrics
  primary_metric VARCHAR(100),            -- 'conversion_rate', 'aov', 'engagement'
  secondary_metrics TEXT[],
  minimum_detectable_effect DECIMAL(5,4), -- 0.05 = 5% improvement

  -- Status
  status VARCHAR(20),                     -- 'draft', 'running', 'paused', 'completed', 'winner_declared'
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,

  -- Results
  winner_variant VARCHAR(100),
  statistical_significance DECIMAL(5,4),  -- p-value

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE experiments.ab_assignments (
  id UUID PRIMARY KEY,
  test_id UUID REFERENCES experiments.ab_tests(id),
  user_id UUID REFERENCES core.users(id),
  variant VARCHAR(100),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(test_id, user_id)
);

CREATE TABLE experiments.ab_events (
  id UUID PRIMARY KEY,
  test_id UUID REFERENCES experiments.ab_tests(id),
  user_id UUID,
  variant VARCHAR(100),

  event_type VARCHAR(100),                -- 'impression', 'click', 'conversion'
  metric_value DECIMAL(12,4),

  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ab_assignments_test ON experiments.ab_assignments(test_id, variant);
CREATE INDEX idx_ab_events_test ON experiments.ab_events(test_id, event_type);
```

**Why This Matters:**
- **Data-driven decisions** (no more gut feelings)
- **Continuous optimization** (test everything)
- **Risk mitigation** (test before full rollout)
- **ROI measurement** (know what works)

**Test Ideas for NATI:**
1. Product page layout (story above/below fold)
2. Drop countdown urgency messages
3. Artist attribution prominence
4. Sustainability score display
5. Pricing strategies (free shipping threshold)
6. Email subject lines
7. Recommendation algorithms
8. Cart abandonment email timing

---

### ❌ 2.5 Advanced Attribution Modeling (MISSING - MEDIUM PRIORITY)

**Current State:** Only last-touch attribution (UTM parameters)

**What's Needed:**
```sql
-- RECOMMENDED NEW TABLE
CREATE TABLE analytics.attribution_touchpoints (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES core.users(id),
  order_id UUID REFERENCES core.orders(id),

  -- Touchpoint Details
  touchpoint_number INTEGER,              -- 1, 2, 3... (chronological)
  total_touchpoints INTEGER,              -- Total in journey

  channel VARCHAR(50),                    -- 'organic_social', 'paid_search', 'email', 'direct'
  campaign_name VARCHAR(255),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),

  -- Timing
  touchpoint_at TIMESTAMPTZ,
  days_before_conversion INTEGER,
  hours_before_conversion INTEGER,

  -- Attribution Credits (Multiple Models)
  credit_last_touch DECIMAL(5,4),         -- 1.0 for last touch, 0 for others
  credit_first_touch DECIMAL(5,4),        -- 1.0 for first touch, 0 for others
  credit_linear DECIMAL(5,4),             -- 1/N for all N touches
  credit_time_decay DECIMAL(5,4),         -- Exponential decay (more recent = more credit)
  credit_position_based DECIMAL(5,4),     -- 40% first, 40% last, 20% divided among middle
  credit_data_driven DECIMAL(5,4),        -- ML-based attribution

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attribution_user ON analytics.attribution_touchpoints(user_id);
CREATE INDEX idx_attribution_order ON analytics.attribution_touchpoints(order_id);
CREATE INDEX idx_attribution_channel ON analytics.attribution_touchpoints(channel);
```

**Why This Matters:**
- **Accurate ROAS** (Return on Ad Spend) for each channel
- **Budget allocation** (invest more in high-performing channels)
- **Understand customer journey** (how many touches before conversion?)
- **Credit all touchpoints** (not just last click)

**Example Query:**
```sql
-- Channel Performance by Attribution Model
SELECT
  channel,
  COUNT(DISTINCT order_id) as attributed_orders,
  SUM(o.total_amount * at.credit_linear) as revenue_linear,
  SUM(o.total_amount * at.credit_time_decay) as revenue_time_decay,
  SUM(o.total_amount * at.credit_data_driven) as revenue_data_driven
FROM analytics.attribution_touchpoints at
JOIN core.orders o ON at.order_id = o.id
WHERE at.touchpoint_at >= NOW() - INTERVAL '30 days'
GROUP BY channel
ORDER BY revenue_data_driven DESC;
```

---

### ❌ 2.6 Search Analytics (MISSING - MEDIUM PRIORITY)

**What's Needed:**
```sql
-- RECOMMENDED NEW TABLE
CREATE TABLE events.search_events (
  id UUID PRIMARY KEY,
  user_id UUID,
  session_id VARCHAR(255),

  -- Search Details
  search_query VARCHAR(500),
  search_query_normalized VARCHAR(500),   -- Lowercase, stemmed
  search_type VARCHAR(50),                -- 'text', 'visual', 'filter'

  -- Results
  results_count INTEGER,
  results_shown INTEGER,                  -- Limited by pagination

  -- Filters Applied
  filters_applied JSONB,                  -- {"art_form": "Kalamkari", "price_max": 5000}
  sort_by VARCHAR(50),                    -- 'relevance', 'price_low', 'newest'

  -- Engagement
  result_clicked BOOLEAN DEFAULT false,
  clicked_result_position INTEGER,
  clicked_product_id UUID,
  time_to_first_click_seconds INTEGER,

  -- Conversion
  converted BOOLEAN DEFAULT false,
  conversion_product_id UUID,
  conversion_order_id UUID,

  -- Abandonment
  zero_results BOOLEAN DEFAULT false,
  refinement_count INTEGER DEFAULT 0,     -- How many times user modified search

  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_query ON events.search_events(search_query_normalized);
CREATE INDEX idx_search_zero_results ON events.search_events(zero_results) WHERE zero_results = true;
CREATE INDEX idx_search_conversion ON events.search_events(converted) WHERE converted = true;
```

**Why This Matters:**
- **Identify popular search terms** (create collections/landing pages)
- **Fix zero-result searches** (add synonyms, improve search)
- **Optimize search ranking** (promote products that convert)
- **Understand user intent** (what are they looking for?)
- **Create content** (blog posts for popular searches)

---

### ❌ 2.7 Inventory Intelligence (MISSING - MEDIUM PRIORITY)

**What's Needed:**
```sql
-- RECOMMENDED NEW TABLE
CREATE TABLE ai.inventory_intelligence (
  product_id UUID PRIMARY KEY REFERENCES core.products(id),

  -- Current State
  current_stock INTEGER,
  reserved_stock INTEGER,
  available_stock INTEGER,                -- current - reserved

  -- Velocity Metrics
  daily_sales_avg_7d DECIMAL(8,2),
  daily_sales_avg_30d DECIMAL(8,2),
  sales_acceleration DECIMAL(8,4),        -- 7d vs 30d growth rate

  -- Predictions
  predicted_stockout_date DATE,
  days_until_stockout INTEGER,
  predicted_demand_7d INTEGER,
  predicted_demand_30d INTEGER,

  -- Reorder Intelligence
  reorder_recommended BOOLEAN DEFAULT false,
  recommended_reorder_quantity INTEGER,
  recommended_reorder_date DATE,

  -- Lost Sales
  lost_sales_count_7d INTEGER DEFAULT 0,  -- Attempts to buy when out of stock
  lost_revenue_7d DECIMAL(12,2),

  -- Alerts
  stockout_risk_level VARCHAR(20),        -- 'low', 'medium', 'high', 'critical'
  overstock_risk_level VARCHAR(20),

  last_calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_stockout ON ai.inventory_intelligence(days_until_stockout);
CREATE INDEX idx_inventory_risk ON ai.inventory_intelligence(stockout_risk_level);
```

**Why This Matters:**
- **Prevent stockouts** (lost revenue)
- **Optimize inventory** (reduce holding costs)
- **Dynamic merchandising** (promote items at risk of overstock)
- **Pre-order management** (offer pre-orders before stockout)
- **Drop planning** (demand forecasting)

---

### ❌ 2.8 Real-Time Personalization Engine (MISSING - HIGH PRIORITY)

**What's Needed:**
```sql
-- RECOMMENDED NEW TABLE (Hot Cache in Redis)
CREATE TABLE ai.personalization_cache (
  user_id UUID PRIMARY KEY REFERENCES core.users(id),

  -- Recommendations (Precomputed)
  recommended_products JSONB,             -- [{"product_id": "...", "score": 0.95, "reason": "..."}]
  trending_for_you JSONB,
  complete_the_look JSONB,
  artists_you_follow_new_drops JSONB,

  -- Dynamic Content
  hero_banner_variant VARCHAR(50),
  featured_collection_id UUID,
  personalized_email_subject VARCHAR(255),

  -- Behavioral Signals
  last_viewed_products UUID[],
  last_viewed_art_forms UUID[],
  last_viewed_artists UUID[],
  current_session_intent VARCHAR(50),     -- 'browsing', 'purchasing', 'researching'

  -- A/B Test Assignments
  active_experiments JSONB,               -- {"test_1": "variant_a", "test_2": "control"}

  -- Urgency & FOMO
  show_cart_abandonment_popup BOOLEAN DEFAULT false,
  cart_abandonment_discount_pct DECIMAL(5,2),
  show_low_stock_badge BOOLEAN DEFAULT false,

  last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Also store in Redis for <50ms access
-- Key: personalization:{user_id}
-- TTL: 300 seconds (5 minutes)
```

**Why This Matters:**
- **Increase conversion** (show relevant products)
- **Reduce bounce rate** (engaging homepage)
- **Increase AOV** (smart upsells)
- **Improve UX** (less time searching, more time enjoying)

**Edge Worker Example (Cloudflare):**
```javascript
// Edge personalization for NATI
export default {
  async fetch(request, env) {
    const userId = getCookie(request, 'user_id');

    // Fetch personalization from KV (edge cache)
    const personalization = await env.KV.get(`personalization:${userId}`, 'json');

    if (personalization) {
      // Inject personalized content at edge
      return new Response(injectPersonalization(html, personalization), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return fetch(request);
  }
};
```

---

## Part 3: AI Marketing Brain - Intelligence Gaps

### 🧠 3.1 Missing AI Capabilities

#### ❌ 3.1.1 Customer Embeddings (Behavioral Similarity)
**What's Missing:**
- User behavior embeddings (similar customers)
- Session embeddings (similar journeys)
- Content embeddings (email, blog posts)

**Recommendation:**
```sql
-- Add to ai schema
CREATE TABLE ai.customer_embeddings (
  user_id UUID PRIMARY KEY REFERENCES core.users(id),

  -- Behavioral Embedding (768 dims)
  behavior_embedding vector(768),         -- Purchase history + browsing + engagement

  -- Preference Embedding
  art_preference_embedding vector(768),   -- Art form preferences
  style_preference_embedding vector(768), -- Visual style preferences

  -- Journey Embedding
  typical_journey_embedding vector(768),  -- Common paths to purchase

  -- Similarity Search
  similar_customers UUID[],               -- Top 10 similar users (precomputed)

  last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_behavior_embedding ON ai.customer_embeddings
  USING hnsw (behavior_embedding vector_cosine_ops);
```

**Use Cases:**
- **Collaborative filtering 2.0** (find similar customers → recommend what they bought)
- **Lookalike audiences** (for ad targeting)
- **Cohort analysis** (segment by behavioral similarity)
- **Churn prevention** (identify at-risk patterns)

---

#### ❌ 3.1.2 Trend Detection & Forecasting
**What's Missing:**
- Trending products/art forms/colors
- Seasonal demand patterns
- Emerging customer segments
- Content virality prediction

**Recommendation:**
```sql
CREATE TABLE ai.trend_detection (
  id UUID PRIMARY KEY,
  entity_type VARCHAR(50),                -- 'product', 'art_form', 'color', 'style'
  entity_id UUID,
  entity_name VARCHAR(255),

  -- Trend Metrics
  current_popularity_score DECIMAL(8,4),
  popularity_7d_ago DECIMAL(8,4),
  popularity_30d_ago DECIMAL(8,4),

  -- Trend Analysis
  trend_direction VARCHAR(20),            -- 'rising', 'falling', 'stable', 'viral'
  trend_velocity DECIMAL(8,4),            -- Rate of change
  trend_acceleration DECIMAL(8,4),        -- Change in rate of change

  -- Predictions
  predicted_peak_date DATE,
  predicted_peak_score DECIMAL(8,4),

  -- Classification
  trend_category VARCHAR(50),             -- 'viral', 'seasonal', 'evergreen', 'declining'
  confidence DECIMAL(5,4),

  last_calculated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Use Cases:**
- **Inventory planning** (stock up on trending items)
- **Marketing campaigns** (promote viral products)
- **Content creation** (blog posts about trending art forms)
- **Drop curation** (include trending styles)

---

#### ❌ 3.1.3 Next Best Action Engine
**Current State:** Only `next_best_action TEXT` in CRM (not structured)

**Recommendation:**
```sql
CREATE TABLE ai.next_best_actions (
  user_id UUID PRIMARY KEY REFERENCES core.users(id),

  -- Ranked Actions (Top 5)
  actions JSONB,  -- [
                  --   {
                  --     "action": "send_cart_abandonment_email",
                  --     "priority": 1,
                  --     "confidence": 0.85,
                  --     "expected_value": 2500.00,  -- INR
                  --     "timing": "within_2_hours",
                  --     "channel": "email",
                  --     "content_variant": "urgency_with_discount"
                  --   },
                  --   {...}
                  -- ]

  -- Context
  customer_stage VARCHAR(20),
  health_score INTEGER,
  ltv_segment VARCHAR(20),

  last_calculated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Action Types:**
- Cart abandonment (email/SMS with discount)
- Win-back campaign (dormant users)
- Upsell opportunity (recently purchased, recommend accessories)
- VIP white-glove service (high-LTV customers)
- Referral request (satisfied customers)
- Review request (post-delivery)
- Re-engagement (low health score)
- Drop invitation (based on preferences)

---

### 🧠 3.2 Missing Marketing Automation Triggers

**Current:** Manual campaigns via Klaviyo/Gupshup

**Needed:** Event-driven automation with AI optimization

```sql
CREATE TABLE marketing.automation_rules (
  id UUID PRIMARY KEY,
  name VARCHAR(255),

  -- Trigger Conditions
  trigger_event VARCHAR(100),             -- 'cart_abandoned', 'drop_launched', 'order_delivered'
  trigger_filters JSONB,                  -- {"cart_value": ">1000", "segment": "vip"}

  -- Actions
  actions JSONB,  -- [
                  --   {
                  --     "type": "send_email",
                  --     "delay_minutes": 120,
                  --     "template_id": "cart_abandon_v2",
                  --     "personalization": {...}
                  --   },
                  --   {
                  --     "type": "send_sms",
                  --     "delay_minutes": 1440,  -- 24 hours
                  --     "template_id": "cart_final_reminder"
                  --   }
                  -- ]

  -- AI Optimization
  ai_optimized BOOLEAN DEFAULT false,     -- Let AI choose timing/content
  ai_model_id VARCHAR(100),

  -- Performance
  times_triggered INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,4),
  total_revenue DECIMAL(12,2),

  -- Status
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Automation Scenarios:**
1. **Cart Abandonment Series**
   - 2 hours: "Your cart is waiting" (no discount)
   - 24 hours: "Complete your order" (10% discount)
   - 72 hours: "Final chance" (15% discount + urgency)

2. **Drop Launch Sequence**
   - 7 days before: Teaser (story + artist intro)
   - 48 hours before: Waitlist reminder (pre-access announcement)
   - 2 hours before: Countdown (FOMO + urgency)
   - At launch: "Drop is live!"
   - 12 hours after: "Selling fast" (low stock alert)

3. **Post-Purchase Journey**
   - Order confirmed: Thank you + artist story
   - Shipped: Tracking + care instructions
   - Delivered: Review request
   - 30 days after: Cross-sell (complete the look)
   - 90 days after: Win-back (new drops in your style)

---

## Part 4: Recommendations & Action Plan

### 🎯 4.1 Immediate Priorities (Sprint 1-2, Weeks 1-4)

#### Priority 1: Conversion Funnel Tracking
**Impact:** HIGH | **Effort:** MEDIUM | **ROI:** 🔥🔥🔥

**Tasks:**
1. Add `analytics.conversion_funnels` table
2. Instrument funnel step events in frontend
3. Create funnel visualization dashboard
4. Set up alerts for drop-off spikes

**Expected Outcome:**
- Identify top 3 drop-off points
- Increase overall conversion by 10-15%

---

#### Priority 2: Customer Lifetime Value (CLV) Model
**Impact:** HIGH | **Effort:** HIGH | **ROI:** 🔥🔥🔥

**Tasks:**
1. Add `ai.customer_ltv` table
2. Collect historical data (RFM metrics)
3. Train CLV prediction model (scikit-learn or Prophet)
4. Integrate with CRM for customer prioritization

**Expected Outcome:**
- Identify top 10% high-LTV customers
- Reduce churn of high-value customers by 20%
- Optimize marketing spend (CAC vs LTV)

---

#### Priority 3: Product Affinity Analysis
**Impact:** MEDIUM | **Effort:** MEDIUM | **ROI:** 🔥🔥

**Tasks:**
1. Add `ai.product_affinity` table
2. Calculate association rules (support, confidence, lift)
3. Implement "Complete the Look" recommendations
4. A/B test cross-sell module

**Expected Outcome:**
- Increase AOV by 15-20%
- Improve recommendation CTR

---

### 🎯 4.2 Short-Term Priorities (Sprint 3-4, Weeks 5-8)

#### Priority 4: A/B Testing Framework
**Impact:** HIGH | **Effort:** HIGH | **ROI:** 🔥🔥🔥

**Tasks:**
1. Add `experiments.*` tables
2. Build A/B testing SDK (frontend + backend)
3. Integrate with analytics dashboard
4. Document testing process

**Expected Outcome:**
- Data-driven decision making
- 5-10% conversion uplift per successful test

---

#### Priority 5: Real-Time Personalization
**Impact:** HIGH | **Effort:** HIGH | **ROI:** 🔥🔥🔥

**Tasks:**
1. Add `ai.personalization_cache` table
2. Build recommendation API (precompute in background)
3. Cache in Redis + Cloudflare KV
4. Implement edge personalization

**Expected Outcome:**
- 20-30% increase in engagement
- 10-15% increase in conversion

---

#### Priority 6: Search Analytics
**Impact:** MEDIUM | **Effort:** MEDIUM | **ROI:** 🔥🔥

**Tasks:**
1. Add `events.search_events` table
2. Track all search interactions
3. Build zero-results dashboard
4. Optimize search ranking

**Expected Outcome:**
- Reduce zero-result searches by 50%
- Increase search conversion by 15%

---

### 🎯 4.3 Medium-Term Priorities (Sprint 5-6, Weeks 9-12)

#### Priority 7: Advanced Attribution
**Impact:** MEDIUM | **Effort:** HIGH | **ROI:** 🔥🔥

**Tasks:**
1. Add `analytics.attribution_touchpoints` table
2. Implement multi-touch attribution models
3. Integrate with marketing dashboards
4. Train data-driven attribution model

**Expected Outcome:**
- Accurate ROAS for each channel
- Optimized marketing budget allocation

---

#### Priority 8: Inventory Intelligence
**Impact:** MEDIUM | **Effort:** MEDIUM | **ROI:** 🔥🔥

**Tasks:**
1. Add `ai.inventory_intelligence` table
2. Build demand forecasting model
3. Set up stockout alerts
4. Integrate with drop planning

**Expected Outcome:**
- Reduce stockouts by 80%
- Reduce lost revenue by 15-20%

---

#### Priority 9: Marketing Automation
**Impact:** HIGH | **Effort:** MEDIUM | **ROI:** 🔥🔥🔥

**Tasks:**
1. Add `marketing.automation_rules` table
2. Build automation engine (event-driven)
3. Create campaign templates
4. Integrate with Klaviyo/Gupshup

**Expected Outcome:**
- 30% increase in email/SMS revenue
- Recover 20-30% of abandoned carts

---

### 🎯 4.4 Long-Term Enhancements (Month 4+)

#### Priority 10: Customer Embeddings
**Impact:** HIGH | **Effort:** HIGH | **ROI:** 🔥🔥

**Tasks:**
1. Add `ai.customer_embeddings` table
2. Train customer embedding model
3. Build similarity search
4. Implement collaborative filtering 2.0

---

#### Priority 11: Trend Detection
**Impact:** MEDIUM | **Effort:** HIGH | **ROI:** 🔥

**Tasks:**
1. Add `ai.trend_detection` table
2. Build trend detection algorithm
3. Integrate with drop planning
4. Create trend dashboard

---

## Part 5: Metrics Dashboard (KPIs to Track)

### 📊 5.1 Acquisition Metrics
```sql
-- Daily/Weekly/Monthly
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as new_users,
  COUNT(CASE WHEN source_platform = 'web' THEN 1 END) as web,
  COUNT(CASE WHEN source_platform = 'mobile' THEN 1 END) as mobile,
  COUNT(CASE WHEN source_platform = 'telegram' THEN 1 END) as telegram,
  COUNT(CASE WHEN utm_source IS NOT NULL THEN 1 END) as from_campaign
FROM core.users
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY date
ORDER BY date DESC;
```

**Key Metrics:**
- New users (daily/weekly/monthly)
- Traffic sources (organic, paid, social, direct)
- Campaign performance (UTM tracking)
- Cost per acquisition (CPA)
- Conversion rate by source

---

### 📊 5.2 Engagement Metrics
```sql
-- Session Engagement
SELECT
  AVG(session_duration_seconds) as avg_session_duration,
  AVG(pages_per_session) as avg_pages_per_session,
  AVG(scroll_depth_percentage) as avg_scroll_depth,
  bounce_rate,
  COUNT(DISTINCT user_id) as active_users
FROM events.user_events
WHERE timestamp >= NOW() - INTERVAL '7 days';
```

**Key Metrics:**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session duration
- Pages per session
- Bounce rate
- Scroll depth
- Story engagement (time spent on stories)
- Artist follow rate

---

### 📊 5.3 Conversion Metrics
```sql
-- Funnel Conversion Rates
SELECT
  funnel_type,
  COUNT(*) as total_entries,
  COUNT(step_6_conversion_at) / COUNT(*) as overall_conversion_rate,
  COUNT(step_4_intent_at) / COUNT(*) as browse_to_cart_rate,
  COUNT(step_6_conversion_at) / COUNT(step_4_intent_at) as cart_to_purchase_rate
FROM analytics.conversion_funnels
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY funnel_type;
```

**Key Metrics:**
- Overall conversion rate (visitors → buyers)
- Add-to-cart rate
- Cart-to-purchase rate
- Drop waitlist conversion rate
- Email/SMS conversion rate

---

### 📊 5.4 Revenue Metrics
```sql
-- Revenue & AOV
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_orders,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_order_value,
  SUM(total_amount) / COUNT(DISTINCT user_id) as revenue_per_customer
FROM core.orders
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND status = 'completed'
GROUP BY date
ORDER BY date DESC;
```

**Key Metrics:**
- Total revenue (daily/weekly/monthly)
- Average Order Value (AOV)
- Revenue per customer
- Gross margin
- Discount impact on margin
- Shipping revenue
- Payment method distribution

---

### 📊 5.5 Customer Health Metrics
```sql
-- Customer Segments
SELECT
  stage,
  COUNT(*) as customer_count,
  AVG(health_score) as avg_health_score,
  AVG(engagement_score) as avg_engagement_score,
  AVG(days_inactive) as avg_days_inactive
FROM crm.customer_profiles
GROUP BY stage
ORDER BY avg_health_score DESC;
```

**Key Metrics:**
- Customer health distribution
- Churn rate (monthly)
- Win-back success rate
- At-risk customer count
- Engagement score trend
- Customer lifecycle stage distribution

---

### 📊 5.6 Product Performance Metrics
```sql
-- Top Products
SELECT
  p.id,
  p.name,
  pa.view_count,
  pa.conversion_rate,
  pa.total_revenue,
  pa.return_rate,
  pa.average_rating,
  pa.popularity_score
FROM ai.product_analytics pa
JOIN core.products p ON pa.product_id = p.id
ORDER BY pa.popularity_score DESC
LIMIT 20;
```

**Key Metrics:**
- Best sellers (by revenue, units)
- Worst performers (low conversion, high returns)
- View-to-purchase conversion by product
- Return rate by product/category
- Average rating & review count
- Stock velocity

---

### 📊 5.7 Drop Performance Metrics
```sql
-- Drop Success
SELECT
  dc.id,
  dc.name,
  dc.waitlist_count,
  dc.unique_buyers,
  dc.total_revenue,
  dc.conversion_rate,
  dc.time_to_sellout_minutes,
  (dc.total_revenue / dc.waitlist_count) as revenue_per_waitlist_member
FROM drops.collections dc
WHERE dc.status = 'sold_out'
ORDER BY dc.total_revenue DESC;
```

**Key Metrics:**
- Waitlist size
- Waitlist-to-purchase conversion
- Time to sell out
- Revenue per drop
- Pre-access conversion vs public conversion
- Drop repeatability (customers who buy from multiple drops)

---

## Part 6: Implementation Checklist

### ✅ Phase 1: Foundation (Weeks 1-4)
- [ ] Add conversion funnel tracking table
- [ ] Instrument funnel events in frontend
- [ ] Add CLV prediction table
- [ ] Train initial CLV model
- [ ] Add product affinity table
- [ ] Calculate association rules (batch job)
- [ ] Create analytics dashboards (Metabase)

### ✅ Phase 2: Optimization (Weeks 5-8)
- [ ] Add A/B testing framework
- [ ] Implement first A/B test (pricing/layout)
- [ ] Add real-time personalization cache
- [ ] Build recommendation API
- [ ] Add search analytics tracking
- [ ] Optimize zero-result searches

### ✅ Phase 3: Intelligence (Weeks 9-12)
- [ ] Add advanced attribution tables
- [ ] Implement multi-touch attribution
- [ ] Add inventory intelligence
- [ ] Build demand forecasting model
- [ ] Add marketing automation tables
- [ ] Create automation workflows

### ✅ Phase 4: AI Enhancement (Month 4+)
- [ ] Add customer embeddings
- [ ] Implement similarity search
- [ ] Add trend detection
- [ ] Build trend prediction model
- [ ] Optimize next best action engine

---

## Part 7: Cost Impact Analysis

### 💰 7.1 Additional Costs for Complete Analytics

**Infrastructure:**
- **BigQuery (increased usage):** +₹5,000 - ₹10,000/month
- **Redis (larger cache):** +₹2,000 - ₹5,000/month
- **Cloud Functions (more jobs):** +₹3,000 - ₹8,000/month

**AI/ML:**
- **Gemini API (embeddings):** +₹5,000 - ₹15,000/month
- **Model training (Vertex AI):** +₹5,000 - ₹10,000/month

**SaaS:**
- **Metabase (BI dashboards):** ₹0 (self-hosted) or ₹8,000/month (cloud)
- **Amplitude/Mixpanel (optional):** ₹15,000 - ₹40,000/month

**Total Additional:** ₹20,000 - ₹88,000/month

**New Total Cost:** ₹93,000 - ₹198,000/month

**Expected ROI:**
- **Conversion uplift:** 15-20% → +₹200K - ₹500K/month (at ₹2M revenue)
- **AOV increase:** 15% → +₹300K/month
- **Churn reduction:** 20% → +₹100K - ₹200K/month

**Net ROI:** 5-10x investment

---

## Part 8: Final Recommendations

### 🎯 Critical Path for Launch

**Pre-Launch (Next 4 Weeks):**
1. ✅ Add conversion funnel tracking (MUST HAVE)
2. ✅ Add CLV prediction (MUST HAVE)
3. ✅ Add product affinity analysis (SHOULD HAVE)
4. ✅ Set up analytics dashboards (MUST HAVE)

**Post-Launch (Month 2-3):**
5. ✅ A/B testing framework (MUST HAVE)
6. ✅ Real-time personalization (SHOULD HAVE)
7. ✅ Search analytics (NICE TO HAVE)

**Optimization (Month 4+):**
8. ✅ Advanced attribution (SHOULD HAVE)
9. ✅ Inventory intelligence (SHOULD HAVE)
10. ✅ Marketing automation (MUST HAVE)

---

## Conclusion

### Summary Score: **B+ → A-**

**Current State:**
- Excellent foundation (events, CRM, cultural data)
- Strong AI infrastructure (embeddings, gateway)
- Good data warehouse strategy

**With Recommended Additions:**
- **Complete D2C analytics** (funnel, CLV, affinity)
- **Intelligent AI marketing brain** (personalization, automation)
- **Data-driven optimization** (A/B testing, attribution)

**NATI has a WORLD-CLASS architecture foundation. With these targeted enhancements, it will have a BEST-IN-CLASS D2C intelligence system capable of:**
- Predicting customer behavior
- Preventing churn before it happens
- Optimizing every touchpoint in the journey
- Maximizing lifetime value
- Driving intelligent, automated marketing at scale

**Next Step:** Prioritize implementation based on the phased plan above. 🚀

---

**Document Version:** 1.0
**Author:** Claude Code Analytics Review
**Date:** 2025-11-24
