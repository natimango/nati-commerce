-- =============================================
-- NATI Commerce - Events Schema
-- Migration 005: User Event Tracking
-- =============================================

-- =============================================
-- USER EVENTS
-- Comprehensive event tracking for analytics
-- Partitioned by month for performance
-- =============================================
CREATE TABLE events_user_events (
    id UUID DEFAULT uuid_generate_v4(),
    event_id VARCHAR(255) NOT NULL, -- Deduplication key (unique with created_at)

    -- User context
    user_id UUID, -- FK to Medusa customer (null for anonymous)
    session_id VARCHAR(255) NOT NULL,
    anonymous_id VARCHAR(255),

    -- Event details
    event_type VARCHAR(100) NOT NULL, -- 'product_viewed', 'add_to_cart', etc.
    event_name VARCHAR(255),

    -- Event properties
    properties JSONB NOT NULL DEFAULT '{}', -- Flexible event data

    -- Product context (if applicable)
    product_id UUID,
    product_handle VARCHAR(255),
    product_price DECIMAL(15, 2),
    variant_id UUID,

    -- Order context (if applicable)
    order_id UUID,
    order_value DECIMAL(15, 2),

    -- Page context
    page_url TEXT,
    page_title VARCHAR(500),
    referrer TEXT,

    -- UTM parameters
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    utm_term VARCHAR(255),

    -- Device & location
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(100),
    os VARCHAR(100),
    ip_address INET,
    country VARCHAR(100),
    city VARCHAR(255),

    -- Timing
    time_on_page INTEGER, -- seconds
    scroll_depth INTEGER, -- percentage (0-100)

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id, created_at),
    UNIQUE (event_id, created_at) -- Deduplication: unique event_id per partition
) PARTITION BY RANGE (created_at);

-- Create indexes on the parent table
CREATE INDEX idx_events_user ON events_user_events(user_id, created_at);
CREATE INDEX idx_events_session ON events_user_events(session_id, created_at);
CREATE INDEX idx_events_type ON events_user_events(event_type, created_at);
CREATE INDEX idx_events_product ON events_user_events(product_id, created_at) WHERE product_id IS NOT NULL;
CREATE INDEX idx_events_order ON events_user_events(order_id, created_at) WHERE order_id IS NOT NULL;

-- GIN index for JSONB properties
CREATE INDEX idx_events_properties ON events_user_events USING gin(properties);

COMMENT ON TABLE events_user_events IS 'User event tracking with monthly partitioning for performance';

-- =============================================
-- CREATE PARTITIONS FOR EVENTS
-- Pre-create partitions for current and next 12 months
-- =============================================
-- This will be done via a script, but here's an example:

-- Current month (2025-10)
CREATE TABLE events_user_events_2025_10 PARTITION OF events_user_events
    FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

-- November 2025
CREATE TABLE events_user_events_2025_11 PARTITION OF events_user_events
    FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- December 2025
CREATE TABLE events_user_events_2025_12 PARTITION OF events_user_events
    FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- =============================================
-- EVENT TYPE DEFINITIONS
-- Reference table for valid event types
-- =============================================
CREATE TABLE events_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL, -- 'engagement', 'commerce', 'navigation'
    description TEXT,
    schema JSONB, -- JSON schema for properties validation
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_types_category ON events_types(category);

INSERT INTO events_types (event_type, category, description) VALUES
    ('product_viewed', 'engagement', 'User viewed a product detail page'),
    ('product_list_viewed', 'engagement', 'User viewed a product listing/collection page'),
    ('add_to_cart', 'commerce', 'User added item to cart'),
    ('remove_from_cart', 'commerce', 'User removed item from cart'),
    ('cart_viewed', 'engagement', 'User viewed shopping cart'),
    ('checkout_started', 'commerce', 'User started checkout process'),
    ('checkout_step_completed', 'commerce', 'User completed a checkout step'),
    ('order_completed', 'commerce', 'Order successfully placed'),
    ('payment_info_entered', 'commerce', 'Payment information entered'),
    ('search_performed', 'engagement', 'User performed a search'),
    ('filter_applied', 'engagement', 'User applied product filters'),
    ('artist_viewed', 'engagement', 'User viewed artist profile'),
    ('artist_followed', 'engagement', 'User followed an artist'),
    ('drop_viewed', 'engagement', 'User viewed drop collection page'),
    ('waitlist_joined', 'engagement', 'User joined drop waitlist'),
    ('story_viewed', 'engagement', 'User viewed cultural story content'),
    ('story_shared', 'engagement', 'User shared a story on social media'),
    ('review_submitted', 'engagement', 'User submitted product review'),
    ('wishlist_added', 'engagement', 'User added product to wishlist'),
    ('session_started', 'navigation', 'User session started'),
    ('page_viewed', 'navigation', 'Generic page view');

COMMENT ON TABLE events_types IS 'Reference table for valid event types and their schemas';

-- =============================================
-- USER SESSIONS
-- Aggregated session data
-- =============================================
CREATE TABLE events_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID, -- FK to Medusa customer
    anonymous_id VARCHAR(255),

    -- Session details
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,

    -- Acquisition
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    landing_page TEXT,
    referrer TEXT,

    -- Engagement
    page_views INTEGER NOT NULL DEFAULT 0,
    events_count INTEGER NOT NULL DEFAULT 0,
    products_viewed INTEGER NOT NULL DEFAULT 0,

    -- Commerce
    cart_value DECIMAL(15, 2),
    order_id UUID,
    order_value DECIMAL(15, 2),
    converted BOOLEAN NOT NULL DEFAULT false,

    -- Device
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    ip_address INET,
    country VARCHAR(100),
    city VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON events_sessions(user_id);
CREATE INDEX idx_sessions_started_at ON events_sessions(started_at);
CREATE INDEX idx_sessions_converted ON events_sessions(converted);
CREATE INDEX idx_sessions_utm_campaign ON events_sessions(utm_campaign);

COMMENT ON TABLE events_sessions IS 'Aggregated user session data for analytics';

-- =============================================
-- TRIGGERS
-- =============================================
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON events_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
