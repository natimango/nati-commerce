-- =============================================
-- NATI Commerce - Cultural Schema
-- Migration 001: Art Forms, Artists, Mills, Fabric Lineage
-- =============================================

-- =============================================
-- ART FORMS
-- Represents Indian folk art traditions
-- =============================================
CREATE TABLE cultural_art_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    region VARCHAR(255) NOT NULL,
    history TEXT,
    technique_description TEXT,
    cultural_significance TEXT,
    thumbnail_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_art_forms_slug ON cultural_art_forms(slug);
CREATE INDEX idx_art_forms_region ON cultural_art_forms(region);
CREATE INDEX idx_art_forms_active ON cultural_art_forms(is_active);

COMMENT ON TABLE cultural_art_forms IS 'Indian folk art traditions (Kalamkari, Ikat, Gond, etc.)';

-- =============================================
-- ARTISTS
-- Represents artists collaborating with NATI
-- =============================================
CREATE TABLE cultural_artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    location VARCHAR(255),
    profile_image_url TEXT,
    art_form_id UUID REFERENCES cultural_art_forms(id) ON DELETE SET NULL,

    -- Social media
    instagram_handle VARCHAR(255),
    website_url TEXT,

    -- Engagement metrics
    follower_count BIGINT NOT NULL DEFAULT 0,
    total_products INTEGER NOT NULL DEFAULT 0,
    total_earnings DECIMAL(15, 2) NOT NULL DEFAULT 0,

    -- Status
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_artists_slug ON cultural_artists(slug);
CREATE INDEX idx_artists_art_form ON cultural_artists(art_form_id);
CREATE INDEX idx_artists_verified ON cultural_artists(is_verified);
CREATE INDEX idx_artists_active ON cultural_artists(is_active);

COMMENT ON TABLE cultural_artists IS 'Artists collaborating with NATI - profiles, earnings, followers';

-- =============================================
-- MILLS
-- Fabric mills and suppliers
-- =============================================
CREATE TABLE cultural_mills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    mill_type VARCHAR(100), -- 'weaving', 'dyeing', 'finishing', 'printing'
    certifications JSONB, -- ['GOTS', 'Fair Trade', 'OEKO-TEX']
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mills_type ON cultural_mills(mill_type);
CREATE INDEX idx_mills_active ON cultural_mills(is_active);

COMMENT ON TABLE cultural_mills IS 'Fabric mills and suppliers for supply chain transparency';

-- =============================================
-- FABRIC LINEAGE
-- Complete fabric journey from mill to garment
-- =============================================
CREATE TABLE cultural_fabric_lineages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL, -- e.g., "Organic Cotton Kalamkari Base"

    -- Journey stages
    weaving_mill_id UUID REFERENCES cultural_mills(id),
    dyeing_mill_id UUID REFERENCES cultural_mills(id),
    printing_mill_id UUID REFERENCES cultural_mills(id),
    finishing_mill_id UUID REFERENCES cultural_mills(id),

    -- Fabric details
    fabric_type VARCHAR(100), -- 'cotton', 'silk', 'linen', 'khadi'
    weight_gsm INTEGER, -- Grams per square meter
    thread_count INTEGER,

    -- Origin
    origin_country VARCHAR(100) DEFAULT 'India',
    origin_state VARCHAR(100),

    -- Sustainability
    is_organic BOOLEAN DEFAULT false,
    certifications JSONB,
    water_usage_liters INTEGER,
    carbon_footprint_kg DECIMAL(10, 2),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fabric_lineage_fabric_type ON cultural_fabric_lineages(fabric_type);
CREATE INDEX idx_fabric_lineage_organic ON cultural_fabric_lineages(is_organic);

COMMENT ON TABLE cultural_fabric_lineages IS 'Complete fabric supply chain from mill to finished textile';

-- =============================================
-- ARTIST FOLLOWS
-- Users following artists (like Instagram)
-- =============================================
CREATE TABLE cultural_artist_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- FK to Medusa customer
    artist_id UUID NOT NULL REFERENCES cultural_artists(id) ON DELETE CASCADE,

    -- Notifications
    notify_new_drops BOOLEAN NOT NULL DEFAULT true,
    notify_stories BOOLEAN NOT NULL DEFAULT true,

    followed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, artist_id)
);

CREATE INDEX idx_artist_follows_user ON cultural_artist_follows(user_id);
CREATE INDEX idx_artist_follows_artist ON cultural_artist_follows(artist_id);
CREATE INDEX idx_artist_follows_date ON cultural_artist_follows(followed_at);

COMMENT ON TABLE cultural_artist_follows IS 'Users following artists for updates and new releases';

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_art_forms_updated_at BEFORE UPDATE ON cultural_art_forms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON cultural_artists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mills_updated_at BEFORE UPDATE ON cultural_mills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fabric_lineages_updated_at BEFORE UPDATE ON cultural_fabric_lineages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
