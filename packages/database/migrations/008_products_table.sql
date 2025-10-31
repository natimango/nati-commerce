-- =============================================
-- NATI Commerce - Products Table
-- Migration 008: Products catalog
-- =============================================

-- =============================================
-- PRODUCTS TABLE
-- Core product data for e-commerce
-- =============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic info
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,

    -- Pricing
    price DECIMAL(15, 2) NOT NULL CHECK (price >= 0),
    compare_at_price DECIMAL(15, 2) CHECK (compare_at_price >= 0),

    -- Images
    images JSONB DEFAULT '[]', -- Array of image URLs
    thumbnail TEXT,

    -- Inventory
    in_stock BOOLEAN NOT NULL DEFAULT true,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),

    -- Cultural metadata
    art_form_id UUID REFERENCES cultural_art_forms(id) ON DELETE SET NULL,
    artist_id UUID REFERENCES cultural_artists(id) ON DELETE SET NULL,
    fabric_type VARCHAR(100),
    production_method VARCHAR(50) CHECK (production_method IN ('handloom', 'hand_painted', 'block_print', 'screen_print', 'mixed')),

    -- Story
    story_title VARCHAR(255),
    story_content TEXT,
    inspiration TEXT,

    -- Sustainability
    sustainability_score INTEGER CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
    certifications JSONB DEFAULT '[]', -- Array of certification names

    -- Limited edition
    is_limited_edition BOOLEAN NOT NULL DEFAULT false,
    edition_size INTEGER,
    edition_number INTEGER,

    -- Drop association
    drop_id UUID, -- FK to drops_collections

    -- Featured flag
    is_featured BOOLEAN NOT NULL DEFAULT false,

    -- Analytics
    view_count BIGINT NOT NULL DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_art_form ON products(art_form_id);
CREATE INDEX idx_products_artist ON products(artist_id);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_drop ON products(drop_id);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Full-text search index
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

COMMENT ON TABLE products IS 'Core products table for NATI e-commerce catalog';

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SEED SAMPLE PRODUCTS
-- =============================================

-- Get art form and artist IDs for sample data
DO $$
DECLARE
    kalamkari_id UUID;
    ikat_id UUID;
    gond_id UUID;
    artist1_id UUID;
    artist2_id UUID;
BEGIN
    -- Get art form IDs
    SELECT id INTO kalamkari_id FROM cultural_art_forms WHERE slug = 'kalamkari' LIMIT 1;
    SELECT id INTO ikat_id FROM cultural_art_forms WHERE slug = 'ikat' LIMIT 1;
    SELECT id INTO gond_id FROM cultural_art_forms WHERE slug = 'gond' LIMIT 1;

    -- Get artist IDs
    SELECT id INTO artist1_id FROM cultural_artists ORDER BY created_at LIMIT 1;
    SELECT id INTO artist2_id FROM cultural_artists ORDER BY created_at OFFSET 1 LIMIT 1;

    -- Insert sample products
    INSERT INTO products (
        name, slug, description, price, compare_at_price,
        images, thumbnail, in_stock, stock_quantity,
        art_form_id, artist_id, fabric_type, production_method,
        story_title, story_content, inspiration,
        sustainability_score, certifications, is_limited_edition,
        is_featured
    ) VALUES
    (
        'Kalamkari Hand-Painted Stole',
        'kalamkari-hand-painted-stole',
        'A stunning hand-painted stole featuring traditional Kalamkari motifs. Each piece is meticulously crafted by skilled artisans using natural dyes and traditional techniques passed down through generations.',
        2500,
        3500,
        '["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800", "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800"]',
        'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400',
        true,
        15,
        kalamkari_id,
        artist1_id,
        'Cotton',
        'hand_painted',
        'The Art of Kalamkari',
        'This exquisite stole showcases the ancient art of Kalamkari, originating from Andhra Pradesh. Every motif tells a story from Hindu mythology, hand-painted with natural dyes extracted from plants and minerals.',
        'Inspired by the temple murals of Machilipatnam and the natural beauty of the Krishna River delta',
        95,
        '["GOTS", "Fair Trade"]',
        false,
        true
    ),
    (
        'Pochampally Ikat Silk Saree',
        'pochampally-ikat-silk-saree',
        'Luxurious pure silk saree featuring intricate Ikat patterns. The geometric designs are created through resist-dyeing technique before weaving, making each piece unique.',
        8500,
        12000,
        '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800", "https://images.unsplash.com/photo-1617627143750-d86bc393c682?w=800"]',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
        true,
        8,
        ikat_id,
        artist2_id,
        'Pure Silk',
        'handloom',
        'Pochampally Heritage',
        'Pochampally Ikat is a UNESCO-protected craft from Telangana. This saree represents weeks of meticulous work - from tie-dyeing individual threads to weaving them on traditional handlooms.',
        'The vibrant colors echo the festive spirit of Deccan culture, while geometric patterns reflect mathematical precision of ancient Indian weavers',
        90,
        '["Handloom Mark", "Geographical Indication"]',
        false,
        true
    ),
    (
        'Gond Art Cotton Kurta',
        'gond-art-cotton-kurta',
        'Contemporary cotton kurta adorned with Gond tribal art motifs. Features hand-painted designs inspired by nature, mythology, and daily life of the Gond tribe.',
        1850,
        NULL,
        '["https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=800"]',
        'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=400',
        true,
        25,
        gond_id,
        artist1_id,
        'Organic Cotton',
        'hand_painted',
        'Gond Tribal Legacy',
        'Gond art is one of India''s most celebrated tribal art forms from Madhya Pradesh. This kurta brings the vibrant storytelling tradition of Gond artists to modern wardrobe.',
        'The dotted patterns and earthy tones pay homage to the deep connection between Gond people and their forest homeland',
        98,
        '["GOTS", "Organic"]',
        false,
        true
    ),
    (
        'Heritage Block Print Bed Linen Set',
        'heritage-block-print-bed-linen',
        'Premium cotton bed linen set featuring traditional block print patterns. Includes one bedsheet and two pillow covers, all hand-printed using carved wooden blocks.',
        3200,
        4000,
        '["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"]',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
        true,
        12,
        kalamkari_id,
        NULL,
        'Cotton',
        'block_print',
        'Block Printing Tradition',
        'Hand block printing is an age-old craft where intricate designs are carved into wooden blocks, dipped in natural dyes, and stamped onto fabric with precision.',
        'The floral motifs are inspired by Mughal gardens and traditional Indian textile heritage',
        92,
        '["GOTS"]',
        false,
        false
    ),
    (
        'Limited Edition Ikat Wall Hanging',
        'limited-edition-ikat-wall-hanging',
        'Exclusive limited edition wall hanging showcasing double Ikat technique. Only 50 pieces worldwide. Perfect for art collectors and connoisseurs.',
        15000,
        NULL,
        '["https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800"]',
        'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400',
        true,
        3,
        ikat_id,
        artist2_id,
        'Silk Cotton Blend',
        'handloom',
        'The Rarest Ikat',
        'Double Ikat is one of the most complex weaving techniques in the world. Both warp and weft threads are tie-dyed before weaving, requiring extraordinary skill and mathematical precision.',
        'This masterpiece took 3 months to complete, with the artist dyeing over 10,000 individual thread sections',
        100,
        '["Handloom Mark", "Geographical Indication", "Artist Certified"]',
        true,
        true
    ),
    (
        'Handwoven Cotton Tote Bag',
        'handwoven-cotton-tote-bag',
        'Eco-friendly tote bag made from handwoven cotton with traditional patterns. Spacious, durable, and sustainable alternative to plastic bags.',
        650,
        NULL,
        '["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"]',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
        true,
        50,
        NULL,
        NULL,
        'Cotton',
        'handloom',
        NULL,
        NULL,
        NULL,
        100,
        '["Organic", "Fair Trade"]',
        false,
        false
    );
END $$;
