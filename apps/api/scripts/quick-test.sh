#!/bin/bash

# NATI Commerce API Quick Test Script
# Run this after starting the API server

set -e

API_URL="http://localhost:9000"
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  NATI Commerce API Quick Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4

    echo -e "${BLUE}Testing:${NC} $description"
    echo -e "  → $method $endpoint"

    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint")
    fi

    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)

    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "  ${GREEN}✓${NC} Status: $http_code"
        echo "$body" | jq -C '.' 2>/dev/null || echo "$body"
    else
        echo -e "  ${RED}✗${NC} Status: $http_code"
        echo "$body" | jq -C '.' 2>/dev/null || echo "$body"
    fi
    echo ""
}

# Check if API is running
echo "Checking if API is running..."
if ! curl -s "$API_URL/health" > /dev/null 2>&1; then
    echo -e "${RED}✗ API is not running on $API_URL${NC}"
    echo ""
    echo "Please start the API first:"
    echo "  cd apps/api"
    echo "  npm run dev"
    echo ""
    exit 1
fi
echo -e "${GREEN}✓ API is running${NC}"
echo ""

# Run tests
echo "Running API tests..."
echo ""

# 1. Health Check
test_endpoint "GET" "/health" "Health check"

# 2. Art Forms
test_endpoint "GET" "/api/art-forms" "List all art forms"
test_endpoint "GET" "/api/art-forms?limit=2" "List art forms (paginated)"
test_endpoint "GET" "/api/art-forms/slug/kalamkari" "Get art form by slug"

# 3. Artists
test_endpoint "GET" "/api/artists" "List all artists"
test_endpoint "GET" "/api/artists?is_verified=true&limit=3" "List verified artists"

# 4. Mills
test_endpoint "GET" "/api/mills" "List all mills"
test_endpoint "GET" "/api/mills?mill_type=organic" "Filter mills by type"

# 5. Drops
test_endpoint "GET" "/api/drops" "List all drops"

# Create a test drop
DROP_DATA='{
  "name": "Test Summer Collection",
  "slug": "test-summer-'$(date +%s)'",
  "description": "Test drop collection",
  "theme": "Summer Testing",
  "story": "Testing the drops API",
  "drop_date": "2025-07-01T00:00:00Z",
  "end_date": "2025-07-15T23:59:59Z",
  "visibility": "preview",
  "max_waitlist_size": 100
}'

test_endpoint "POST" "/api/drops" "Create test drop" "$DROP_DATA"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ API tests complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "For more comprehensive testing, see:"
echo "  apps/api/API_TESTING_GUIDE.md"
echo ""
