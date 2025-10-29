# Local Database Testing Guide for NATI Commerce

Complete step-by-step instructions to test the database on your local machine.

**Repository**: https://github.com/natimango/nati-commerce
**Branch**: `claude/assess-repo-status-011CUb72BUbfPLCwX3xivru6`

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Docker Desktop** installed and running
  - Download: https://www.docker.com/products/docker-desktop/
  - Start Docker Desktop and wait for it to be ready

- [ ] **Node.js 18+** installed
  - Check version: `node --version`
  - Download: https://nodejs.org/ (LTS version recommended)

- [ ] **Git** installed
  - Check version: `git --version`
  - Download: https://git-scm.com/

- [ ] **Terminal/Command Prompt** open
  - macOS/Linux: Terminal
  - Windows: PowerShell or Command Prompt

---

## Step 1: Clone the Repository

Open your terminal and run:

```bash
# Navigate to where you want the project
cd ~/Projects  # or any folder you prefer

# Clone the repository
git clone https://github.com/natimango/nati-commerce.git

# Navigate into the project
cd nati-commerce

# Switch to the correct branch
git checkout claude/assess-repo-status-011CUb72BUbfPLCwX3xivru6

# Verify you're on the right branch
git branch
```

**Expected output:**
```
* claude/assess-repo-status-011CUb72BUbfPLCwX3xivru6
```

---

## Step 2: Install Dependencies

```bash
# Install root dependencies
npm install
```

**This will take 1-2 minutes.** You should see:
```
added XXX packages in XXs
```

---

## Step 3: Start Docker Services

```bash
# Start PostgreSQL and Redis
docker compose up -d
```

**Expected output:**
```
[+] Running 4/4
 ✔ Container nati-postgres          Started
 ✔ Container nati-redis             Started
 ✔ Container nati-pgadmin           Started
 ✔ Container nati-redis-commander   Started
```

**Verify services are running:**
```bash
docker compose ps
```

**Expected output:**
```
NAME                    STATUS
nati-postgres           Up
nati-redis              Up
nati-pgadmin            Up
nati-redis-commander    Up
```

**If services fail to start:**
- Make sure Docker Desktop is running
- Check if ports 5432 or 6379 are already in use
- Try: `docker compose down` then `docker compose up -d` again

---

## Step 4: Setup Database Package

```bash
# Navigate to database package
cd packages/database

# Install database dependencies
npm install
```

---

## Step 5: Run Database Migrations

```bash
# Run all migrations
npm run migrate
```

**Expected output:**
```
✓ Connected to database
→ Running migration: 001_cultural_schema.sql
✓ Completed 001_cultural_schema.sql
→ Running migration: 002_product_extensions.sql
✓ Completed 002_product_extensions.sql
→ Running migration: 003_drops_schema.sql
✓ Completed 003_drops_schema.sql
→ Running migration: 004_ai_schema.sql
✓ Completed 004_ai_schema.sql
→ Running migration: 005_events_schema.sql
✓ Completed 005_events_schema.sql
→ Running migration: 006_crm_schema.sql
✓ Completed 006_crm_schema.sql
→ Running migration: 007_warehouse_staging.sql
✓ Completed 007_warehouse_staging.sql

✓ Migration complete! 7 migrations executed.
```

**If you see errors:**
- Check if PostgreSQL container is running: `docker compose ps`
- Check logs: `docker compose logs postgres`
- Ensure DATABASE_URL is correct (should auto-work with defaults)

---

## Step 6: Load Seed Data

```bash
# Load sample data (art forms, artists, mills)
npm run seed
```

**Expected output:**
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

---

## Step 7: Verify Database Setup

```bash
# Run comprehensive verification (45+ checks)
npm run verify
```

**Expected output:**
```
✓ Database connection successful

=== Testing Extensions ===
  ✓ Extension 'uuid-ossp' is installed
  ✓ Extension 'vector' is installed
  ✓ Extension 'pg_trgm' is installed

=== Testing Tables ===
  ✓ Table 'cultural_art_forms' exists
  ✓ Table 'cultural_artists' exists
  ✓ Table 'cultural_mills' exists
  ✓ Table 'cultural_fabric_lineages' exists
  ✓ Table 'cultural_artist_follows' exists
  ✓ Table 'cultural_product_metadata' exists
  ✓ Table 'cultural_artist_credits' exists
  ✓ Table 'drops_collections' exists
  ✓ Table 'drops_waitlist' exists
  ✓ Table 'drops_products' exists
  ✓ Table 'ai_product_embeddings' exists
  ✓ Table 'ai_product_analytics' exists
  ✓ Table 'ai_usage_log' exists
  ✓ Table 'ai_recommendations_cache' exists
  ✓ Table 'events_user_events' exists
  ✓ Table 'events_types' exists
  ✓ Table 'events_sessions' exists
  ✓ Table 'crm_customer_profiles' exists
  ✓ Table 'crm_nati_circle' exists
  ✓ Table 'crm_points_transactions' exists
  ✓ Table 'crm_communications' exists
  ✓ Table 'crm_segments' exists
  ✓ Table 'crm_segment_members' exists
  ✓ Table 'warehouse_staging_products' exists
  ✓ Table 'warehouse_staging_orders' exists
  ✓ Table 'warehouse_staging_customers' exists
  ✓ Table 'warehouse_staging_events' exists
  ✓ Table 'warehouse_etl_jobs' exists

=== Testing Indexes ===
  ✓ Found 85 custom indexes

=== Testing Vector Indexes ===
  ✓ Found 3 HNSW vector indexes
    - idx_embeddings_text_hnsw
    - idx_embeddings_visual_hnsw
    - idx_embeddings_combined_hnsw

=== Testing Triggers ===
  ✓ Found 11 updated_at triggers

=== Testing Table Partitions ===
  ✓ Found 3 partitions for events_user_events
    - events_user_events_2025_10
    - events_user_events_2025_11
    - events_user_events_2025_12

=== Testing Seed Data ===
  ✓ Art forms: 6 records
  ✓ Artists: 8 records
  ✓ Mills: 5 records
  ✓ Event types: 21 records

=== Testing Vector Embeddings Schema ===
  ✓ Found 3 embedding columns (text, visual, combined)

=== Testing Foreign Key Constraints ===
  ✓ Found 19 foreign key constraints

=== Testing JSONB Columns ===
  ✓ Found 10 JSONB columns

==================================================
TEST SUMMARY
==================================================
✓ Passed:   45
⚠ Warnings: 0
✗ Failed:   0
==================================================

🎉 All tests passed! Database is properly configured.
```

**If any tests fail:**
- Check which specific test failed
- Review the error message
- See troubleshooting section below

---

## Step 8: Run Functional Tests

```bash
# Run comprehensive functional tests
npm run test
```

**Expected output:**
```
🧪 Running Database Tests

=== Test 1: Vector Similarity Search ===
✓ Vector search returned 1 results
  Similarity score: 1

=== Test 2: Event Partitioning ===
✓ Event inserted successfully
  Total test events: 1

=== Test 3: JSONB Functionality ===
✓ JSONB query successful
  Found mill: Coimbatore Organic Cotton Mill
  Has GOTS: true

=== Test 4: Full-Text Search ===
✓ Full-text search returned 1 results
  - Kalamkari (Andhra Pradesh & Telangana)

=== Test 5: Complex Joins (Artists + Art Forms) ===
✓ Join query returned 8 results
  - Kalyan Joshi: Kalamkari (Srikalahasti, Andhra Pradesh)
  - Meera Pradhan: Ikat (Sambalpur, Odisha)
  - Venkat Raman Singh Shyam: Gond Art (Bhopal, Madhya Pradesh)
  ... (more artists)

=== Test 6: Updated_at Triggers ===
✓ updated_at trigger working correctly
  Original: 2025-10-29T...
  Updated:  2025-10-29T...

=== Test 7: Check Constraints ===
✓ Check constraint working (rejected invalid health_score)

=== Test 8: Unique Constraints ===
✓ Unique constraint working (rejected duplicate slug)

✅ Database test suite completed!
```

---

## Step 9: Explore Database with PgAdmin

### Access PgAdmin Web Interface

1. **Open your browser** and go to: http://localhost:5050

2. **Login with:**
   - Email: `admin@nati.com`
   - Password: `admin`

3. **Add Server Connection:**
   - Right-click "Servers" → "Register" → "Server"

   **General Tab:**
   - Name: `NATI Commerce`

   **Connection Tab:**
   - Host: `postgres` (important: use container name, not localhost)
   - Port: `5432`
   - Maintenance database: `nati_commerce`
   - Username: `nati_user`
   - Password: `nati_password`

   - Check: "Save password"

4. **Click "Save"**

### Explore the Database

Navigate to:
```
Servers → NATI Commerce → Databases → nati_commerce → Schemas → public → Tables
```

**You should see 28 tables:**
- cultural_art_forms
- cultural_artists
- cultural_mills
- cultural_fabric_lineages
- cultural_artist_follows
- cultural_product_metadata
- cultural_artist_credits
- drops_collections
- drops_waitlist
- drops_products
- ai_product_embeddings
- ai_product_analytics
- ai_usage_log
- ai_recommendations_cache
- events_user_events (partitioned)
- events_types
- events_sessions
- crm_customer_profiles
- crm_nati_circle
- crm_points_transactions
- crm_communications
- crm_segments
- crm_segment_members
- warehouse_staging_products
- warehouse_staging_orders
- warehouse_staging_customers
- warehouse_staging_events
- warehouse_etl_jobs

### Run Sample Queries

Click on "Tools" → "Query Tool" and try these queries:

**View all art forms:**
```sql
SELECT name, region, is_active
FROM cultural_art_forms
ORDER BY name;
```

**View artists with their art forms:**
```sql
SELECT
    a.name as artist,
    af.name as art_form,
    a.location,
    a.is_verified
FROM cultural_artists a
LEFT JOIN cultural_art_forms af ON a.art_form_id = af.id
ORDER BY a.name;
```

**View mills and their certifications:**
```sql
SELECT
    name,
    location,
    mill_type,
    certifications
FROM cultural_mills
WHERE is_active = true;
```

**Check event types:**
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

## Step 10: Explore Redis (Optional)

### Access Redis Commander

1. **Open your browser** and go to: http://localhost:8081

2. **You should see:**
   - Redis connection "local"
   - Currently empty (no data yet)
   - This will be used for caching and queues when backend is running

---

## Troubleshooting

### Issue: Docker containers won't start

**Solution:**
```bash
# Stop all containers
docker compose down

# Remove volumes (WARNING: deletes all data)
docker compose down -v

# Start fresh
docker compose up -d

# Wait 10 seconds for PostgreSQL to initialize
sleep 10

# Try migrations again
cd packages/database
npm run migrate
```

### Issue: Port 5432 already in use

**Solution:**
You have another PostgreSQL running. Either:

1. **Stop the other PostgreSQL**, or
2. **Change the port** in `docker-compose.yml`:
   ```yaml
   postgres:
     ports:
       - "5433:5432"  # Changed from 5432:5432
   ```
   Then update `.env`:
   ```
   DATABASE_URL=postgresql://nati_user:nati_password@localhost:5433/nati_commerce
   ```

### Issue: "Extension 'vector' not found"

**Solution:**
```bash
# Restart PostgreSQL container
docker compose restart postgres

# Wait 10 seconds
sleep 10

# Try again
cd packages/database
npm run migrate
```

### Issue: Migrations fail with "relation already exists"

**This means migrations already ran successfully!** To reset:

```bash
# WARNING: This deletes all data
docker compose down -v
docker compose up -d
sleep 10
cd packages/database
npm run migrate
npm run seed
```

### Issue: Can't connect to PgAdmin

**Solution:**
1. Check container is running: `docker compose ps`
2. Check logs: `docker compose logs pgadmin`
3. Try restarting: `docker compose restart pgadmin`
4. Access: http://localhost:5050

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Try again
npm install
```

---

## Verification Checklist

After completing all steps, verify:

- [ ] ✅ Docker containers running (`docker compose ps` shows 4 containers)
- [ ] ✅ Migrations completed (7 migrations ran successfully)
- [ ] ✅ Seed data loaded (6 arts, 8 artists, 5 mills)
- [ ] ✅ Verification passed (45 checks, 0 failures)
- [ ] ✅ Functional tests passed (8 tests, all green)
- [ ] ✅ PgAdmin accessible (can see 28 tables)
- [ ] ✅ Can run SQL queries in PgAdmin
- [ ] ✅ Redis Commander accessible

---

## Quick Commands Reference

```bash
# Start services
docker compose up -d

# Stop services
docker compose stop

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Stop and remove everything
docker compose down -v

# Run migrations
cd packages/database && npm run migrate

# Load seed data
cd packages/database && npm run seed

# Verify setup
cd packages/database && npm run verify

# Run tests
cd packages/database && npm run test

# Validate SQL (no Docker needed)
cd packages/database && npm run validate
```

---

## What's Next?

After successful testing, you can:

1. **Explore the data** in PgAdmin
2. **Build the Backend API** (Medusa.js endpoints)
3. **Build the Frontend** (Next.js storefront)
4. **Implement AI Features** (Gemini integration)

---

## Success Criteria

You'll know everything is working when:

✅ All Docker containers are running
✅ All 7 migrations completed successfully
✅ All seed data loaded (19 records)
✅ Verification shows 45 passed tests
✅ Functional tests all pass
✅ You can query data in PgAdmin
✅ You see 28 tables in the database

---

## Need Help?

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review logs: `docker compose logs postgres`
3. Check DATABASE_TESTING.md for detailed guides
4. Verify Docker Desktop is running

---

**Ready to test!** Start with Step 1 and work through each step. Let me know if you hit any issues! 🚀
