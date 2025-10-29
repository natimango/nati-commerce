-- =============================================
-- NATI Commerce - CRM Schema
-- Migration 006: Customer Profiles, Communications, NATI Circle
-- =============================================

-- =============================================
-- CUSTOMER PROFILES
-- Extended customer data for CRM
-- =============================================
CREATE TABLE crm_customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL UNIQUE, -- FK to Medusa customer

    -- RFM Scores (Recency, Frequency, Monetary)
    recency_score INTEGER CHECK (recency_score >= 1 AND recency_score <= 5),
    frequency_score INTEGER CHECK (frequency_score >= 1 AND frequency_score <= 5),
    monetary_score INTEGER CHECK (monetary_score >= 1 AND monetary_score <= 5),
    rfm_segment VARCHAR(20), -- '555' = Champions, '111' = At Risk

    -- Health & Engagement
    health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
    engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
    churn_risk_score DECIMAL(5, 4), -- 0.0000 to 1.0000

    -- Lifecycle stage
    lifecycle_stage VARCHAR(50) DEFAULT 'prospect' CHECK (lifecycle_stage IN (
        'prospect', 'new', 'active', 'at_risk', 'churned', 'win_back'
    )),

    -- Purchase behavior
    total_orders INTEGER NOT NULL DEFAULT 0,
    total_revenue DECIMAL(15, 2) NOT NULL DEFAULT 0,
    average_order_value DECIMAL(15, 2),
    last_order_at TIMESTAMPTZ,
    days_since_last_order INTEGER,
    predicted_next_order_date DATE,

    -- Preferences
    favorite_art_forms JSONB, -- Array of art form IDs
    favorite_artists JSONB, -- Array of artist IDs
    preferred_price_range JSONB, -- {"min": 1000, "max": 5000}
    size_preferences JSONB, -- ["M", "L"]

    -- Communication preferences
    email_opt_in BOOLEAN NOT NULL DEFAULT true,
    sms_opt_in BOOLEAN NOT NULL DEFAULT false,
    whatsapp_opt_in BOOLEAN NOT NULL DEFAULT false,
    telegram_opt_in BOOLEAN NOT NULL DEFAULT false,

    -- Calculated metrics
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crm_profiles_customer ON crm_customer_profiles(customer_id);
CREATE INDEX idx_crm_profiles_health ON crm_customer_profiles(health_score DESC);
CREATE INDEX idx_crm_profiles_lifecycle ON crm_customer_profiles(lifecycle_stage);
CREATE INDEX idx_crm_profiles_churn_risk ON crm_customer_profiles(churn_risk_score DESC);

COMMENT ON TABLE crm_customer_profiles IS 'Extended customer profiles with RFM, health scores, and preferences';

-- =============================================
-- NATI CIRCLE (Loyalty Program)
-- =============================================
CREATE TABLE crm_nati_circle (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL UNIQUE, -- FK to Medusa customer

    -- Tier system
    tier VARCHAR(20) NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    points_balance INTEGER NOT NULL DEFAULT 0,
    lifetime_points INTEGER NOT NULL DEFAULT 0,

    -- Tier thresholds (for next tier)
    next_tier VARCHAR(20),
    points_to_next_tier INTEGER,

    -- Benefits
    early_drop_access_hours INTEGER NOT NULL DEFAULT 0, -- Hours before public launch
    discount_percentage INTEGER NOT NULL DEFAULT 0, -- Tier-based discount (0-20%)
    free_shipping_threshold DECIMAL(15, 2), -- Minimum order for free shipping

    -- Engagement
    achievements JSONB DEFAULT '[]', -- Array of achievement IDs
    badges JSONB DEFAULT '[]', -- Array of badge IDs
    referral_code VARCHAR(50) UNIQUE,
    referrals_count INTEGER NOT NULL DEFAULT 0,

    -- Dates
    tier_achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tier_expires_at TIMESTAMPTZ, -- Some tiers may expire if inactive
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_nati_circle_customer ON crm_nati_circle(customer_id);
CREATE INDEX idx_nati_circle_tier ON crm_nati_circle(tier);
CREATE INDEX idx_nati_circle_points ON crm_nati_circle(points_balance DESC);
CREATE INDEX idx_nati_circle_referral ON crm_nati_circle(referral_code);

COMMENT ON TABLE crm_nati_circle IS 'NATI Circle loyalty program with tier-based benefits';

-- =============================================
-- POINTS TRANSACTIONS
-- Track points earned and spent
-- =============================================
CREATE TABLE crm_points_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL, -- FK to Medusa customer
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN (
        'earned_purchase', 'earned_review', 'earned_referral', 'earned_social_share',
        'earned_birthday', 'redeemed', 'expired', 'adjusted'
    )),

    -- Points
    points INTEGER NOT NULL, -- Positive for earned, negative for redeemed
    balance_after INTEGER NOT NULL,

    -- Context
    order_id UUID, -- If related to purchase/redemption
    description TEXT,

    -- Expiration
    expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_points_transactions_customer ON crm_points_transactions(customer_id, created_at DESC);
CREATE INDEX idx_points_transactions_type ON crm_points_transactions(transaction_type);
CREATE INDEX idx_points_transactions_expires ON crm_points_transactions(expires_at);

COMMENT ON TABLE crm_points_transactions IS 'NATI Circle points ledger with expiration tracking';

-- =============================================
-- COMMUNICATION LOG
-- Track all communications with customers
-- =============================================
CREATE TABLE crm_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL, -- FK to Medusa customer

    -- Communication details
    channel VARCHAR(50) NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'telegram', 'push')),
    communication_type VARCHAR(100) NOT NULL, -- 'order_confirmation', 'drop_announcement', etc.
    subject VARCHAR(500),
    content TEXT,

    -- Template
    template_id VARCHAR(255),
    template_version VARCHAR(50),

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'queued' CHECK (status IN (
        'queued', 'sent', 'delivered', 'opened', 'clicked', 'failed', 'bounced', 'unsubscribed'
    )),

    -- Engagement
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,

    -- Error tracking
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,

    -- External IDs
    external_id VARCHAR(255), -- Klaviyo message ID, etc.
    campaign_id VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_communications_customer ON crm_communications(customer_id, created_at DESC);
CREATE INDEX idx_communications_channel ON crm_communications(channel);
CREATE INDEX idx_communications_type ON crm_communications(communication_type);
CREATE INDEX idx_communications_status ON crm_communications(status);
CREATE INDEX idx_communications_sent_at ON crm_communications(sent_at);

COMMENT ON TABLE crm_communications IS 'Comprehensive communication log across all channels';

-- =============================================
-- CUSTOMER SEGMENTS
-- Dynamic customer segmentation
-- =============================================
CREATE TABLE crm_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Segment criteria (stored as SQL WHERE clause or JSONB)
    criteria JSONB NOT NULL,

    -- Metadata
    customer_count INTEGER NOT NULL DEFAULT 0,
    last_calculated_at TIMESTAMPTZ,

    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_segments_active ON crm_segments(is_active);

COMMENT ON TABLE crm_segments IS 'Dynamic customer segments for targeted marketing';

-- =============================================
-- SEGMENT MEMBERSHIP
-- Which customers belong to which segments
-- =============================================
CREATE TABLE crm_segment_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    segment_id UUID NOT NULL REFERENCES crm_segments(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL, -- FK to Medusa customer

    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(segment_id, customer_id)
);

CREATE INDEX idx_segment_members_segment ON crm_segment_members(segment_id);
CREATE INDEX idx_segment_members_customer ON crm_segment_members(customer_id);

COMMENT ON TABLE crm_segment_members IS 'Customer membership in marketing segments';

-- =============================================
-- TRIGGERS
-- =============================================
CREATE TRIGGER update_crm_profiles_updated_at BEFORE UPDATE ON crm_customer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nati_circle_updated_at BEFORE UPDATE ON crm_nati_circle
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communications_updated_at BEFORE UPDATE ON crm_communications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_segments_updated_at BEFORE UPDATE ON crm_segments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
