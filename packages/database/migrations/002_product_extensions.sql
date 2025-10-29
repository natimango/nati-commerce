-- =============================================
-- NATI Commerce - Product Extensions
-- Migration 002: Cultural Metadata, Artist Credits
-- =============================================

-- =============================================
-- PRODUCT CULTURAL METADATA
-- Extends Medusa products with cultural storytelling
-- =============================================
CREATE TABLE cultural_product_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL UNIQUE, -- FK to Medusa product table

    -- Cultural story
    story_title VARCHAR(255),
    story_content TEXT,
    inspiration TEXT,

    -- Art classification
    art_form_id UUID REFERENCES cultural_art_forms(id) ON DELETE SET NULL,
    technique_used VARCHAR(255),
    pattern_name VARCHAR(255),

    -- Fabric & materials
    fabric_type VARCHAR(100),
    fabric_lineage_id UUID REFERENCES cultural_fabric_lineages(id) ON DELETE SET NULL,
    material_composition JSONB, -- {"cotton": 60, "silk": 40}

    -- Sustainability
    sustainability_score INTEGER CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
    certifications JSONB, -- ["GOTS", "Fair Trade"]
    carbon_footprint_kg DECIMAL(10, 2),

    -- Production
    production_method VARCHAR(50) CHECK (production_method IN ('handloom', 'hand_painted', 'block_print', 'screen_print', 'mixed')),
    time_to_produce_hours INTEGER,
    artisan_count INTEGER,

    -- Limited edition
    is_limited_edition BOOLEAN NOT NULL DEFAULT false,
    edition_size INTEGER,
    edition_number INTEGER,

    -- Drop association
    drop_id UUID, -- FK to drops_collections (added later)

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_metadata_product ON cultural_product_metadata(product_id);
CREATE INDEX idx_product_metadata_art_form ON cultural_product_metadata(art_form_id);
CREATE INDEX idx_product_metadata_fabric_lineage ON cultural_product_metadata(fabric_lineage_id);
CREATE INDEX idx_product_metadata_drop ON cultural_product_metadata(drop_id);
CREATE INDEX idx_product_metadata_limited_edition ON cultural_product_metadata(is_limited_edition);

COMMENT ON TABLE cultural_product_metadata IS 'Cultural storytelling and sustainability data for products';

-- =============================================
-- ARTIST CREDITS
-- Links multiple artists to products with roles
-- =============================================
CREATE TABLE cultural_artist_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL, -- FK to Medusa product
    artist_id UUID NOT NULL REFERENCES cultural_artists(id) ON DELETE CASCADE,

    -- Contribution details
    role VARCHAR(50) NOT NULL CHECK (role IN ('designer', 'weaver', 'painter', 'embroiderer', 'collaborator')),
    contribution_percentage INTEGER NOT NULL CHECK (contribution_percentage >= 0 AND contribution_percentage <= 100),

    -- Display
    display_order INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure unique combination of product, artist, and role
    UNIQUE(product_id, artist_id, role)
);

CREATE INDEX idx_artist_credits_product ON cultural_artist_credits(product_id);
CREATE INDEX idx_artist_credits_artist ON cultural_artist_credits(artist_id);
CREATE INDEX idx_artist_credits_featured ON cultural_artist_credits(is_featured);

COMMENT ON TABLE cultural_artist_credits IS 'Multi-artist collaboration tracking with revenue sharing percentages';

-- =============================================
-- TRIGGERS
-- =============================================
CREATE TRIGGER update_product_metadata_updated_at BEFORE UPDATE ON cultural_product_metadata
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artist_credits_updated_at BEFORE UPDATE ON cultural_artist_credits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
