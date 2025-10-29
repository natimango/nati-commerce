-- =============================================
-- NATI Commerce - AI Schema
-- Migration 004: Embeddings, Analytics, Usage
-- =============================================

-- =============================================
-- PRODUCT EMBEDDINGS
-- Vector embeddings for product recommendations
-- =============================================
CREATE TABLE ai_product_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL UNIQUE, -- FK to Medusa product

    -- Embeddings (Gemini text-embedding-004: 768 dimensions)
    text_embedding vector(768), -- Product name + description + story
    visual_embedding vector(768), -- Product image via Gemini Vision
    combined_embedding vector(768), -- Weighted average of text + visual

    -- Metadata
    embedding_model VARCHAR(100) DEFAULT 'gemini-text-embedding-004',
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_embeddings_product ON ai_product_embeddings(product_id);

-- HNSW indexes for fast vector similarity search
CREATE INDEX idx_embeddings_text_hnsw ON ai_product_embeddings
    USING hnsw (text_embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_embeddings_visual_hnsw ON ai_product_embeddings
    USING hnsw (visual_embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_embeddings_combined_hnsw ON ai_product_embeddings
    USING hnsw (combined_embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

COMMENT ON TABLE ai_product_embeddings IS 'Vector embeddings for AI-powered product recommendations';

-- =============================================
-- PRODUCT ANALYTICS
-- Aggregated product performance metrics
-- =============================================
CREATE TABLE ai_product_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL UNIQUE, -- FK to Medusa product

    -- Engagement metrics (last 30 days)
    view_count INTEGER NOT NULL DEFAULT 0,
    add_to_cart_count INTEGER NOT NULL DEFAULT 0,
    purchase_count INTEGER NOT NULL DEFAULT 0,
    wishlist_count INTEGER NOT NULL DEFAULT 0,
    share_count INTEGER NOT NULL DEFAULT 0,

    -- Conversion metrics
    view_to_cart_rate DECIMAL(5, 4), -- 0.0000 to 1.0000
    cart_to_purchase_rate DECIMAL(5, 4),
    overall_conversion_rate DECIMAL(5, 4),

    -- Quality metrics
    average_rating DECIMAL(3, 2), -- 0.00 to 5.00
    review_count INTEGER NOT NULL DEFAULT 0,
    return_count INTEGER NOT NULL DEFAULT 0,
    return_rate DECIMAL(5, 4),

    -- Popularity score (0-100, calculated)
    popularity_score INTEGER CHECK (popularity_score >= 0 AND popularity_score <= 100),

    -- Recommendation score (for sorting)
    recommendation_score DECIMAL(10, 4),

    -- Last calculated
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_analytics_product ON ai_product_analytics(product_id);
CREATE INDEX idx_product_analytics_popularity ON ai_product_analytics(popularity_score DESC);
CREATE INDEX idx_product_analytics_recommendation ON ai_product_analytics(recommendation_score DESC);

COMMENT ON TABLE ai_product_analytics IS 'Aggregated product metrics for recommendations and ranking';

-- =============================================
-- AI USAGE LOG
-- Track AI API usage and costs
-- =============================================
CREATE TABLE ai_usage_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Request details
    operation_type VARCHAR(50) NOT NULL, -- 'embedding', 'chat', 'vision', 'recommendation'
    provider VARCHAR(50) NOT NULL, -- 'gemini', 'openai', 'anthropic'
    model VARCHAR(100) NOT NULL,

    -- Usage
    input_tokens INTEGER,
    output_tokens INTEGER,
    total_tokens INTEGER,

    -- Cost (in USD)
    cost_usd DECIMAL(10, 6),

    -- Context
    user_id UUID, -- FK to Medusa customer (if applicable)
    session_id VARCHAR(255),
    endpoint VARCHAR(255),

    -- Timing
    latency_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usage_log_operation ON ai_usage_log(operation_type);
CREATE INDEX idx_usage_log_provider ON ai_usage_log(provider);
CREATE INDEX idx_usage_log_created_at ON ai_usage_log(created_at);
CREATE INDEX idx_usage_log_user ON ai_usage_log(user_id);

-- Partition by month for performance
CREATE INDEX idx_usage_log_created_at_brin ON ai_usage_log USING brin(created_at);

COMMENT ON TABLE ai_usage_log IS 'AI API usage tracking for cost management and analytics';

-- =============================================
-- RECOMMENDATIONS CACHE
-- Pre-computed recommendations for performance
-- =============================================
CREATE TABLE ai_recommendations_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Context
    recommendation_type VARCHAR(50) NOT NULL, -- 'similar_products', 'personalized', 'trending'
    context_key VARCHAR(255) NOT NULL, -- Product ID or user ID

    -- Recommendations (array of product IDs with scores)
    recommendations JSONB NOT NULL, -- [{"product_id": "uuid", "score": 0.95}, ...]

    -- Metadata
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,

    UNIQUE(recommendation_type, context_key)
);

CREATE INDEX idx_recommendations_type_key ON ai_recommendations_cache(recommendation_type, context_key);
CREATE INDEX idx_recommendations_expires ON ai_recommendations_cache(expires_at);

COMMENT ON TABLE ai_recommendations_cache IS 'Pre-computed recommendations with TTL for performance';

-- =============================================
-- TRIGGERS
-- =============================================
CREATE TRIGGER update_product_embeddings_updated_at BEFORE UPDATE ON ai_product_embeddings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_analytics_updated_at BEFORE UPDATE ON ai_product_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
