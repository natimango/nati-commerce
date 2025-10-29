# Local API Testing Guide

Complete guide to test the NATI Commerce REST API on your local machine.

## Prerequisites

✅ **You've already done this in the previous testing session:**
- Docker Desktop installed and running
- Repository cloned: `git clone https://github.com/natimango/nati-commerce.git`
- Dependencies installed: `npm install --legacy-peer-deps`
- Database migrated and seeded successfully

## Quick Start (5 minutes)

### Step 1: Pull Latest Code

```bash
cd nati-commerce
git pull origin claude/assess-repo-status-011CUb72BUbfPLCwX3xivru6
```

### Step 2: Ensure Docker Services Are Running

```bash
# Check if services are running
docker compose ps

# If not running, start them
docker compose up -d

# Verify PostgreSQL is accessible
docker exec -it nati-postgres psql -U nati_user -d nati_commerce -c "\dt"
```

**Expected:** You should see all the tables from previous testing session.

### Step 3: Verify Database Has Seed Data

```bash
# Check art forms
docker exec -it nati-postgres psql -U nati_user -d nati_commerce -c "SELECT COUNT(*) FROM cultural_art_forms;"

# Check artists
docker exec -it nati-postgres psql -U nati_user -d nati_commerce -c "SELECT COUNT(*) FROM cultural_artists;"

# Check mills
docker exec -it nati-commerce psql -U nati_user -d nati_commerce -c "SELECT COUNT(*) FROM cultural_mills;"
```

**Expected Output:**
- Art forms: 6
- Artists: 8
- Mills: 5

If counts are zero, run seed again:
```bash
cd packages/database
npm run seed
cd ../..
```

### Step 4: Start the API Server

Open a new terminal window:

```bash
cd apps/api
npm run dev
```

**Expected Output:**
```
🚀 NATI Commerce API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Environment: development
Port:        9000
Database:    localhost:5432/nati_commerce
CORS:        http://localhost:3000, http://localhost:3001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API Endpoints:
  GET  /health

  Art Forms:
    GET    /api/art-forms
    ... (all endpoints listed)

Ready to accept requests!
```

### Step 5: Run Quick Tests

Open another terminal window:

```bash
cd apps/api
./scripts/quick-test.sh
```

This will automatically test all major endpoints!

**Expected:** All tests should pass with green checkmarks ✓

## Manual Testing with curl

### Test 1: Health Check

```bash
curl http://localhost:9000/health | jq
```

**Expected:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-29T...",
  "uptime": 123.45,
  "environment": "development"
}
```

### Test 2: Get All Art Forms (from seed data)

```bash
curl http://localhost:9000/api/art-forms | jq
```

**Expected:** 6 art forms including:
- Kalamkari
- Bandhani
- Block Printing
- Madhubani
- Warli
- Patola

### Test 3: Get Specific Art Form by Slug

```bash
curl http://localhost:9000/api/art-forms/slug/kalamkari | jq
```

**Expected:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Kalamkari",
    "slug": "kalamkari",
    "region": "Andhra Pradesh & Telangana",
    "description": "Ancient art of hand painting and block printing...",
    "origin_story": "Dating back to 3000 years...",
    "techniques": ["hand-painted", "block-printed"],
    "is_active": true,
    ...
  }
}
```

### Test 4: Get All Artists

```bash
curl http://localhost:9000/api/artists | jq
```

**Expected:** 8 artists from seed data

### Test 5: Filter Artists (Verified Only)

```bash
curl "http://localhost:9000/api/artists?is_verified=true" | jq
```

**Expected:** Only verified artists

### Test 6: Get Artists for a Specific Art Form

First, get the Kalamkari art form ID:

```bash
ART_FORM_ID=$(curl -s http://localhost:9000/api/art-forms/slug/kalamkari | jq -r '.data.id')
echo $ART_FORM_ID
```

Then get all artists for that art form:

```bash
curl "http://localhost:9000/api/art-forms/$ART_FORM_ID/artists" | jq
```

**Expected:** List of artists specializing in Kalamkari

### Test 7: Get All Mills

```bash
curl http://localhost:9000/api/mills | jq
```

**Expected:** 5 mills from seed data including:
- Coimbatore Organic Cotton Mill
- Gujarat Handloom Cooperative
- Bhuj Traditional Weavers Mill
- Pochampally Silk Weavers
- West Bengal Khadi Co-op

### Test 8: Filter Mills by Type

```bash
curl "http://localhost:9000/api/mills?mill_type=organic" | jq
```

**Expected:** Only organic mills

### Test 9: Get Mill with Fabric Lineages

```bash
MILL_ID=$(curl -s http://localhost:9000/api/mills/slug/coimbatore-organic-cotton | jq -r '.data.id')
curl "http://localhost:9000/api/mills/$MILL_ID/lineages" | jq
```

**Expected:** Fabric lineage records for that mill

### Test 10: Create a New Drop Collection

```bash
curl -X POST http://localhost:9000/api/drops \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Handloom 2025",
    "slug": "summer-handloom-2025",
    "description": "Lightweight summer collection",
    "theme": "Coastal Breeze",
    "story": "Inspired by coastal weaving traditions of Kerala and Tamil Nadu",
    "drop_date": "2025-06-01T00:00:00Z",
    "end_date": "2025-06-15T23:59:59Z",
    "visibility": "preview",
    "waitlist_opens_at": "2025-05-15T00:00:00Z",
    "max_waitlist_size": 500
  }' | jq
```

**Expected:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Summer Handloom 2025",
    "slug": "summer-handloom-2025",
    ...
  },
  "message": "Drop collection created successfully"
}
```

### Test 11: Join Waitlist

Save the drop ID from previous response:

```bash
DROP_ID="<paste-drop-id-here>"

curl -X POST "http://localhost:9000/api/drops/$DROP_ID/waitlist" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-123",
    "email": "customer@example.com",
    "tier": "curator"
  }' | jq
```

**Expected:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "collection_id": "...",
    "position": 1,
    "tier": "curator",
    "status": "active",
    "joined_at": "2025-10-29T..."
  },
  "message": "Successfully joined waitlist"
}
```

### Test 12: Follow an Artist

```bash
ARTIST_ID=$(curl -s http://localhost:9000/api/artists | jq -r '.data[0].id')
curl -X POST "http://localhost:9000/api/artists/$ARTIST_ID/follow" | jq
```

**Expected:** Follower count incremented

Check the count:

```bash
curl "http://localhost:9000/api/artists/$ARTIST_ID" | jq '.data.follower_count'
```

### Test 13: Pagination

```bash
# First page (3 items)
curl "http://localhost:9000/api/artists?limit=3&offset=0" | jq

# Second page (3 items)
curl "http://localhost:9000/api/artists?limit=3&offset=3" | jq
```

**Expected:** Different artists in each response

### Test 14: Error Handling

Test 404 - Not Found:

```bash
curl "http://localhost:9000/api/artists/00000000-0000-0000-0000-000000000000" | jq
```

**Expected:**
```json
{
  "success": false,
  "message": "Artist not found"
}
```

Test invalid slug:

```bash
curl "http://localhost:9000/api/art-forms/slug/non-existent" | jq
```

**Expected:**
```json
{
  "success": false,
  "message": "Art form not found"
}
```

### Test 15: Rate Limiting

Send 101 requests quickly (should hit rate limit):

```bash
for i in {1..101}; do
  curl -s http://localhost:9000/health > /dev/null
  echo "Request $i"
done
```

**Expected:** Around request 101, you should see:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

## Testing with Postman/Thunder Client

If you prefer a GUI, import these endpoints into Postman or Thunder Client (VS Code extension):

**Collection Base URL:** `http://localhost:9000`

Create these environment variables:
- `base_url`: `http://localhost:9000`
- `art_form_id`: Get from `/api/art-forms` response
- `artist_id`: Get from `/api/artists` response
- `mill_id`: Get from `/api/mills` response
- `drop_id`: Get from `/api/drops` response

## Verification Checklist

After testing, verify:

- [ ] Health check returns 200 OK
- [ ] Art forms: 6 records from seed data
- [ ] Artists: 8 records from seed data
- [ ] Mills: 5 records from seed data
- [ ] Can get art form by slug
- [ ] Can get artists for an art form
- [ ] Can filter mills by type
- [ ] Can create new drop collection
- [ ] Can join waitlist (position tracking works)
- [ ] Follower count increments/decrements
- [ ] Pagination works (limit/offset)
- [ ] Filtering works (is_active, mill_type, etc.)
- [ ] 404 errors return proper format
- [ ] Rate limiting triggers after 100 requests
- [ ] All responses have `success` field
- [ ] Error responses have `message` field

## Troubleshooting

### Issue: "Error: connect ECONNREFUSED ::1:5432"

**Solution:** PostgreSQL not running or wrong host

```bash
# Check Docker
docker compose ps

# Restart if needed
docker compose restart postgres

# Or start if stopped
docker compose up -d
```

### Issue: "relation does not exist"

**Solution:** Database not migrated

```bash
cd packages/database
npm run migrate
```

### Issue: Empty arrays returned

**Solution:** Database not seeded

```bash
cd packages/database
npm run seed
```

### Issue: "Cannot find module"

**Solution:** Dependencies not installed

```bash
npm install --legacy-peer-deps
```

### Issue: Port 9000 already in use

**Solution:** Kill the process or use different port

```bash
# Find process
lsof -ti:9000

# Kill it
kill -9 $(lsof -ti:9000)

# Or change port in apps/api/.env
PORT=9001
```

## Performance Testing (Optional)

### Load Testing with Apache Bench

```bash
# Install apache bench (if not installed)
# macOS: comes with apache
# Ubuntu: sudo apt-get install apache2-utils

# Test with 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:9000/health
```

### Load Testing with k6 (Recommended)

```bash
# Install k6
brew install k6  # macOS
# or download from https://k6.io

# Create test script (k6-test.js)
cat > k6-test.js << 'EOF'
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  let res = http.get('http://localhost:9000/health');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
EOF

# Run test
k6 run k6-test.js
```

## Success Criteria

✅ **All tests passing means:**

1. API server starts without errors
2. Database connection successful
3. All seed data accessible via API
4. CRUD operations work correctly
5. Filtering and pagination work
6. Error handling is consistent
7. Rate limiting functions properly
8. No syntax or import errors

## Next Steps

Once all tests pass:

1. ✅ **Database layer** - Working (tested previously)
2. ✅ **Backend API** - Working (tested now)
3. 🔄 **Frontend** - Build Next.js storefront next
4. 🔄 **AI Gateway** - Integrate Gemini API
5. 🔄 **Deploy** - Production deployment

---

**Happy Testing!** 🚀

For detailed endpoint documentation, see:
- `apps/api/README.md` - Complete API reference
- `apps/api/API_TESTING_GUIDE.md` - Additional testing examples
