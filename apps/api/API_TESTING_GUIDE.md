# API Testing Guide

Quick guide to test the NATI Commerce REST API locally.

## Prerequisites

1. Docker services running:
   ```bash
   docker compose up -d
   ```

2. Database migrated and seeded:
   ```bash
   cd packages/database
   npm run migrate
   npm run seed
   ```

3. API dependencies installed:
   ```bash
   # From project root
   npm install --legacy-peer-deps
   ```

## Start the API Server

```bash
cd apps/api
npm run dev
```

Expected output:
```
🚀 NATI Commerce API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Environment: development
Port:        9000
Database:    localhost:5432/nati_commerce
CORS:        http://localhost:3000, http://localhost:3001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API Endpoints: ...

Ready to accept requests!
```

The API is now running at `http://localhost:9000`

## Test Endpoints

Open a new terminal window and test these endpoints:

### 1. Health Check

```bash
curl http://localhost:9000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-29T...",
  "uptime": 1.234,
  "environment": "development"
}
```

### 2. Get All Art Forms

```bash
curl http://localhost:9000/api/art-forms
```

**Expected:** List of 6 art forms (from seed data)

### 3. Get Specific Art Form

```bash
curl http://localhost:9000/api/art-forms/slug/kalamkari
```

**Expected:** Kalamkari art form details

### 4. Get All Artists

```bash
curl http://localhost:9000/api/artists
```

**Expected:** List of 8 artists (from seed data)

### 5. Get Artists for an Art Form

First, get an art form ID:
```bash
curl http://localhost:9000/api/art-forms | jq '.data[0].id'
```

Then get artists for that art form:
```bash
curl "http://localhost:9000/api/art-forms/<ART_FORM_ID>/artists"
```

### 6. Get All Mills

```bash
curl http://localhost:9000/api/mills
```

**Expected:** List of 5 mills (from seed data)

### 7. Filter Mills by Type

```bash
curl "http://localhost:9000/api/mills?mill_type=organic"
```

**Expected:** Only organic mills

### 8. Get Mill by Slug

```bash
curl http://localhost:9000/api/mills/slug/coimbatore-organic-cotton
```

### 9. Get All Drop Collections

```bash
curl http://localhost:9000/api/drops
```

**Expected:** Empty list (no drops seeded yet)

### 10. Create a New Drop Collection

```bash
curl -X POST http://localhost:9000/api/drops \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Handloom Collection",
    "slug": "summer-handloom-2025",
    "description": "Lightweight handwoven summer textiles",
    "theme": "Tropical Paradise",
    "story": "Inspired by coastal weaving traditions",
    "drop_date": "2025-06-01T00:00:00Z",
    "end_date": "2025-06-15T23:59:59Z",
    "visibility": "preview",
    "waitlist_opens_at": "2025-05-15T00:00:00Z",
    "max_waitlist_size": 500
  }'
```

**Expected:** 201 Created with drop details

### 11. Join Waitlist

First, get the drop ID from the previous response, then:

```bash
curl -X POST "http://localhost:9000/api/drops/<DROP_ID>/waitlist" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-123",
    "email": "test@example.com",
    "tier": "curator"
  }'
```

**Expected:** Position 1 on waitlist

### 12. Follow an Artist

Get an artist ID first:
```bash
curl http://localhost:9000/api/artists | jq '.data[0].id'
```

Then follow:
```bash
curl -X POST "http://localhost:9000/api/artists/<ARTIST_ID>/follow"
```

**Expected:** Follower count incremented

### 13. Test Pagination

```bash
curl "http://localhost:9000/api/artists?limit=3&offset=0"
```

**Expected:** First 3 artists

```bash
curl "http://localhost:9000/api/artists?limit=3&offset=3"
```

**Expected:** Next 3 artists

### 14. Test Filtering

```bash
curl "http://localhost:9000/api/artists?is_verified=true"
```

**Expected:** Only verified artists

```bash
curl "http://localhost:9000/api/art-forms?region=Gujarat"
```

**Expected:** Art forms from Gujarat

### 15. Test Error Handling

**404 - Not Found:**
```bash
curl http://localhost:9000/api/artists/00000000-0000-0000-0000-000000000000
```

**Expected:**
```json
{
  "success": false,
  "message": "Artist not found"
}
```

**400 - Invalid Slug:**
```bash
curl http://localhost:9000/api/art-forms/slug/non-existent
```

**Expected:**
```json
{
  "success": false,
  "message": "Art form not found"
}
```

## Testing with Postman

1. Import the following endpoints into Postman:
   - Base URL: `http://localhost:9000`
   - Add collection with all endpoints from README.md

2. Create environment variables:
   - `base_url`: `http://localhost:9000`
   - `art_form_id`: (get from API)
   - `artist_id`: (get from API)
   - `mill_id`: (get from API)
   - `drop_id`: (get from API)

## Verification Checklist

After testing, verify:

- [ ] Health check responds with 200 OK
- [ ] All GET endpoints return data from seed files
- [ ] Art forms: 6 records
- [ ] Artists: 8 records
- [ ] Mills: 5 records
- [ ] Pagination works (limit/offset)
- [ ] Filtering works (is_active, mill_type, region, etc.)
- [ ] Slug lookups work
- [ ] Related data queries work (art form → artists, mill → lineages)
- [ ] POST endpoints create new records
- [ ] PATCH endpoints update records
- [ ] DELETE endpoints soft-delete records
- [ ] Error responses have proper format
- [ ] 404 errors for non-existent resources
- [ ] Follow/unfollow increments/decrements counts
- [ ] Waitlist positioning works correctly
- [ ] Rate limiting works (100 requests in 15 min)

## Performance Testing

Test rate limiting:

```bash
# Send 101 requests quickly (should hit rate limit)
for i in {1..101}; do
  curl http://localhost:9000/health
done
```

**Expected:** Request 101 returns 429 Too Many Requests

## Troubleshooting

### API won't start

**Error: `Error: connect ECONNREFUSED`**

Solution: Make sure PostgreSQL is running
```bash
docker compose ps
```

**Error: `Cannot find module`**

Solution: Install dependencies
```bash
npm install --legacy-peer-deps
```

### Empty responses

**Issue:** GET endpoints return empty arrays

Solution: Run seed data
```bash
cd packages/database
npm run seed
```

### Database errors

**Error: `relation does not exist`**

Solution: Run migrations
```bash
cd packages/database
npm run migrate
```

## Next Steps

Once all tests pass:

1. Document any issues found
2. Test with frontend integration (Next.js storefront)
3. Test authentication middleware (when implemented)
4. Test with production-like data volumes
5. Load testing with tools like Apache Bench or k6

## Success Criteria

✅ All endpoints respond correctly
✅ Seed data is returned properly
✅ Filtering and pagination work
✅ POST/PATCH/DELETE operations succeed
✅ Error handling is consistent
✅ Rate limiting works
✅ API is ready for frontend integration

---

**Ready to test!** 🚀
