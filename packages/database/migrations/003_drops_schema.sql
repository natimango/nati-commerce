-- =============================================
-- NATI Commerce - Drops Schema
-- Migration 003: Drop Collections, Waitlists
-- =============================================

-- =============================================
-- DROP COLLECTIONS
-- Limited-time product releases
-- =============================================
CREATE TABLE drops_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,

    -- Story & theme
    theme VARCHAR(255) NOT NULL,
    story TEXT,
    hero_image_url TEXT,
    teaser_video_url TEXT,

    -- Timing
    announcement_at TIMESTAMPTZ NOT NULL,
    launch_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'ended', 'cancelled')),

    -- Waitlist
    waitlist_enabled BOOLEAN NOT NULL DEFAULT true,
    pre_access_hours INTEGER NOT NULL DEFAULT 24,

    -- Metrics (calculated)
    total_products INTEGER NOT NULL DEFAULT 0,
    total_inventory INTEGER NOT NULL DEFAULT 0,
    waitlist_count INTEGER NOT NULL DEFAULT 0,
    conversion_rate DECIMAL(5, 4), -- 0.0000 to 1.0000
    sell_out_time_minutes INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_drops_slug ON drops_collections(slug);
CREATE INDEX idx_drops_status ON drops_collections(status);
CREATE INDEX idx_drops_launch_at ON drops_collections(launch_at);
CREATE INDEX idx_drops_announcement_at ON drops_collections(announcement_at);

COMMENT ON TABLE drops_collections IS 'Limited-time product releases with scarcity and storytelling';

-- =============================================
-- DROP WAITLIST
-- Users waiting for drop access
-- =============================================
CREATE TABLE drops_waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drop_id UUID NOT NULL REFERENCES drops_collections(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- FK to Medusa customer
    email VARCHAR(255) NOT NULL,

    -- Pre-access tier
    tier VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (tier IN ('platinum', 'gold', 'silver', 'standard')),

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'converted', 'expired')),

    -- Tracking
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notified_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    first_order_id UUID, -- FK to Medusa order

    -- Conversion tracking
    notification_opened BOOLEAN DEFAULT false,
    time_to_convert_minutes INTEGER,

    UNIQUE(drop_id, user_id)
);

CREATE INDEX idx_waitlist_drop ON drops_waitlist(drop_id);
CREATE INDEX idx_waitlist_user ON drops_waitlist(user_id);
CREATE INDEX idx_waitlist_email ON drops_waitlist(email);
CREATE INDEX idx_waitlist_tier ON drops_waitlist(tier);
CREATE INDEX idx_waitlist_status ON drops_waitlist(status);
CREATE INDEX idx_waitlist_joined_at ON drops_waitlist(joined_at);

COMMENT ON TABLE drops_waitlist IS 'User waitlist for drop pre-access with tier-based prioritization';

-- =============================================
-- DROP PRODUCTS
-- Products belonging to a drop
-- =============================================
CREATE TABLE drops_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drop_id UUID NOT NULL REFERENCES drops_collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL, -- FK to Medusa product

    -- Display
    display_order INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,

    -- Inventory for this drop
    allocated_inventory INTEGER NOT NULL DEFAULT 0,
    reserved_inventory INTEGER NOT NULL DEFAULT 0,
    sold_inventory INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(drop_id, product_id)
);

CREATE INDEX idx_drop_products_drop ON drops_products(drop_id);
CREATE INDEX idx_drop_products_product ON drops_products(product_id);
CREATE INDEX idx_drop_products_featured ON drops_products(is_featured);

COMMENT ON TABLE drops_products IS 'Products assigned to specific drops with inventory tracking';

-- =============================================
-- ADD FOREIGN KEY TO PRODUCT METADATA
-- (References drop_id in cultural_product_metadata)
-- =============================================
ALTER TABLE cultural_product_metadata
    ADD CONSTRAINT fk_product_metadata_drop
    FOREIGN KEY (drop_id) REFERENCES drops_collections(id) ON DELETE SET NULL;

-- =============================================
-- TRIGGERS
-- =============================================
CREATE TRIGGER update_drops_updated_at BEFORE UPDATE ON drops_collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
