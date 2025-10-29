# Database Testing Guide

Complete guide to testing the NATI Commerce database setup.

## Prerequisites

- Docker Desktop installed
- Node.js 18+ installed
- Terminal access

## Quick Start

### 1. Start Services

```bash
# From project root
docker compose up -d

# Verify services are running
docker compose ps
```

Expected output:
```
NAME                 IMAGE                    STATUS
nati-postgres        pgvector/pgvector:pg16   Up
nati-redis           redis:7-alpine           Up
nati-pgadmin         dpage/pgadmin4           Up
nati-redis-commander rediscommander/redis-commander Up
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install database package dependencies
cd packages/database
npm install
cd ../..
```

### 3. Run Migrations

```bash
cd packages/database
npm run migrate
```

Expected output:
```
✓ Connected to database
→ Running migration: 001_cultural_schema.sql
✓ Completed 001_cultural_schema.sql
→ Running migration: 002_product_extensions.sql
✓ Completed 002_product_extensions.sql
...
✓ Migration complete! 7 migrations executed.
```

### 4. Load Seed Data

```bash
npm run seed
```

Expected output:
```
✓ Connected to database
→ Running seed: 001_art_forms.sql
✓ Completed 001_art_forms.sql
→ Running seed: 002_artists.sql
✓ Completed 002_artists.sql
→ Running seed: 003_mills.sql
✓ Completed 003_mills.sql
✓ Seeding complete!
```

### 5. Verify Setup

```bash
npm run verify
```

Expected output:
```
✓ Database connection successful

=== Testing Extensions ===
  ✓ Extension 'uuid-ossp' is installed
  ✓ Extension 'vector' is installed
  ✓ Extension 'pg_trgm' is installed

=== Testing Tables ===
  ✓ Table 'cultural_art_forms' exists
  ✓ Table 'cultural_artists' exists
  ...

=== Testing Vector Indexes ===
  ✓ Found 3 HNSW vector indexes
    - idx_embeddings_text_hnsw
    - idx_embeddings_visual_hnsw
    - idx_embeddings_combined_hnsw

=== TEST SUMMARY ===
✓ Passed:   45
⚠ Warnings: 0
✗ Failed:   0

🎉 All tests passed! Database is properly configured.
```

### 6. Run Test Suite

```bash
npm run test
```

This runs comprehensive functionality tests:
- Vector similarity search
- Event partitioning
- JSONB queries
- Full-text search
- Complex joins
- Triggers
- Constraints

---

## Service Access

Once services are running, you can access:

### PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Database**: nati_commerce
- **User**: nati_user
- **Password**: nati_password

### PgAdmin (GUI)
- **URL**: http://localhost:5050
- **Email**: admin@nati.com
- **Password**: admin

### Redis
- **Host**: localhost
- **Port**: 6379

### Redis Commander (GUI)
- **URL**: http://localhost:8081

---

## Manual Testing with psql

Connect to database:
```bash
docker exec -it nati-postgres psql -U nati_user -d nati_commerce
```

### Check Tables

```sql
-- List all tables
\dt

-- Count records in each table
SELECT 'cultural_art_forms' as table, COUNT(*) FROM cultural_art_forms
UNION ALL
SELECT 'cultural_artists', COUNT(*) FROM cultural_artists
UNION ALL
SELECT 'cultural_mills', COUNT(*) FROM cultural_mills;
```

### Test Vector Search

```sql
-- Check embeddings table
SELECT COUNT(*) FROM ai_product_embeddings;

-- View vector indexes
\d ai_product_embeddings
```

### Test Event Partitions

```sql
-- List all partitions
SELECT
    parent.relname as parent_table,
    child.relname as partition_name
FROM pg_inherits
JOIN pg_class parent ON pg_inherits.inhparent = parent.oid
JOIN pg_class child ON pg_inherits.inhrelid = child.oid
WHERE parent.relname = 'events_user_events';
```

### Test Full-Text Search

```sql
-- Search art forms
SELECT name, region
FROM cultural_art_forms
WHERE name ILIKE '%Kalam%'
   OR technique_description ILIKE '%hand%';
```

### Test Joins

```sql
-- Artists with their art forms
SELECT
    a.name as artist,
    af.name as art_form,
    a.location
FROM cultural_artists a
LEFT JOIN cultural_art_forms af ON a.art_form_id = af.id;
```

---

## Troubleshooting

### Issue: "Extension 'vector' is missing"

**Solution**: The pgvector extension needs to be installed in PostgreSQL.

```bash
# Restart containers
docker compose down
docker compose up -d

# Run init script again
docker exec -it nati-postgres psql -U nati_user -d nati_commerce -f /docker-entrypoint-initdb.d/01-enable-extensions.sql
```

### Issue: "Migration already executed"

This is normal! Migrations are tracked and won't run twice.

To reset database completely:
```bash
docker compose down -v  # WARNING: This deletes all data
docker compose up -d
cd packages/database
npm run migrate
npm run seed
```

### Issue: "Connection refused"

**Check if containers are running:**
```bash
docker compose ps
```

**Check logs:**
```bash
docker compose logs postgres
```

**Restart services:**
```bash
docker compose restart
```

### Issue: "Port 5432 already in use"

Another PostgreSQL instance is running. Either:
1. Stop the other instance
2. Change port in `docker-compose.yml`

### Issue: Vector search returns errors

**Verify pgvector is installed:**
```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

If not found, reconnect and run:
```sql
CREATE EXTENSION vector;
```

---

## Performance Testing

### Test Query Performance

```sql
-- Enable timing
\timing on

-- Test vector search (replace with actual embedding)
EXPLAIN ANALYZE
SELECT product_id
FROM ai_product_embeddings
ORDER BY text_embedding <=> '[0.1, 0.1, ...]'
LIMIT 10;

-- Should use HNSW index for fast results
```

### Test Event Insertion

```bash
# Use the test script
cd packages/database
node scripts/test.js
```

---

## Database Schema Exploration

### View All Tables with Descriptions

```sql
SELECT
    schemaname,
    tablename,
    obj_description((schemaname||'.'||tablename)::regclass)
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### View Table Structure

```sql
\d+ cultural_art_forms
```

### View All Indexes

```sql
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### View Foreign Keys

```sql
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;
```

---

## Sample Queries

### Get Artist with Art Form Details

```sql
SELECT
    a.name as artist_name,
    a.location,
    af.name as art_form,
    af.region as art_region,
    a.follower_count,
    a.total_products,
    a.is_verified
FROM cultural_artists a
LEFT JOIN cultural_art_forms af ON a.art_form_id = af.id
ORDER BY a.follower_count DESC;
```

### Get Mills by Type

```sql
SELECT
    name,
    location,
    mill_type,
    certifications
FROM cultural_mills
WHERE mill_type = 'weaving'
  AND is_active = true;
```

### Get Event Type Statistics

```sql
SELECT
    event_type,
    category,
    description
FROM events_types
WHERE is_active = true
ORDER BY category, event_type;
```

---

## Clean Up

To stop services but keep data:
```bash
docker compose stop
```

To stop and remove containers (keeps data):
```bash
docker compose down
```

To remove everything including data:
```bash
docker compose down -v
```

---

## Next Steps

After successful database setup:

1. ✅ Start Medusa.js backend
2. ✅ Build API endpoints
3. ✅ Create Next.js frontend
4. ✅ Implement AI Gateway
5. ✅ Set up event tracking

See the main [README.md](./README.md) for the complete development roadmap.

---

## Support

If you encounter issues not covered here:

1. Check Docker logs: `docker compose logs`
2. Check PostgreSQL logs: `docker compose logs postgres`
3. Verify connection: `docker exec -it nati-postgres pg_isready`
4. Review migration errors in the console output

For additional help, refer to:
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
