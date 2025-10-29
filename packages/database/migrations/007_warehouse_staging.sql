-- =============================================
-- NATI Commerce - Warehouse Staging Schema
-- Migration 007: ETL Buffer for BigQuery
-- =============================================

-- =============================================
-- WAREHOUSE STAGING
-- Temporary staging tables for ETL to BigQuery
-- =============================================
CREATE TABLE warehouse_staging_products (
    id UUID PRIMARY KEY,
    product_data JSONB NOT NULL,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_staging_products_synced ON warehouse_staging_products(synced_at);

CREATE TABLE warehouse_staging_orders (
    id UUID PRIMARY KEY,
    order_data JSONB NOT NULL,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_staging_orders_synced ON warehouse_staging_orders(synced_at);

CREATE TABLE warehouse_staging_customers (
    id UUID PRIMARY KEY,
    customer_data JSONB NOT NULL,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_staging_customers_synced ON warehouse_staging_customers(synced_at);

CREATE TABLE warehouse_staging_events (
    id UUID PRIMARY KEY,
    event_data JSONB NOT NULL,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_staging_events_synced ON warehouse_staging_events(synced_at);

COMMENT ON SCHEMA public IS 'Staging tables for ETL to BigQuery data warehouse';

-- =============================================
-- ETL JOBS LOG
-- Track ETL job execution
-- =============================================
CREATE TABLE warehouse_etl_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_name VARCHAR(255) NOT NULL,
    job_type VARCHAR(100) NOT NULL, -- 'full_sync', 'incremental', 'backfill'

    -- Execution
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL CHECK (status IN ('running', 'completed', 'failed')),

    -- Metrics
    rows_processed INTEGER,
    rows_inserted INTEGER,
    rows_updated INTEGER,
    rows_failed INTEGER,

    -- Error tracking
    error_message TEXT,
    error_stack TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_etl_jobs_name ON warehouse_etl_jobs(job_name, started_at DESC);
CREATE INDEX idx_etl_jobs_status ON warehouse_etl_jobs(status);

COMMENT ON TABLE warehouse_etl_jobs IS 'ETL job execution log for monitoring and debugging';
