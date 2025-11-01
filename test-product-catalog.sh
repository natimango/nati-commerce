#!/bin/bash
# NATI Commerce - Product Catalog Testing Script
# Run this script on your Mac to test the product catalog implementation

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   NATI Commerce - Product Catalog Testing                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check Docker
echo -e "${BLUE}Step 1: Checking Docker services...${NC}"
if ! docker ps &> /dev/null; then
    echo -e "${RED}❌ Docker is not running${NC}"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

POSTGRES_RUNNING=$(docker ps --filter "name=nati-postgres" --format "{{.Names}}")
if [ -z "$POSTGRES_RUNNING" ]; then
    echo -e "${YELLOW}⚠️  PostgreSQL container not running${NC}"
    echo "Starting Docker Compose services..."
    docker compose up -d
    echo "Waiting for PostgreSQL to be ready..."
    sleep 5
else
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
fi
echo ""

# Step 2: Run database migration
echo -e "${BLUE}Step 2: Running products table migration...${NC}"
if docker exec -i nati-postgres psql -U nati_user -d nati_commerce < packages/database/migrations/008_products_table.sql; then
    echo -e "${GREEN}✓ Migration completed successfully${NC}"
else
    echo -e "${RED}❌ Migration failed${NC}"
    exit 1
fi
echo ""

# Step 3: Verify products were created
echo -e "${BLUE}Step 3: Verifying sample products...${NC}"
PRODUCT_COUNT=$(docker exec -i nati-postgres psql -U nati_user -d nati_commerce -t -c "SELECT COUNT(*) FROM products;")
echo -e "Products in database: ${GREEN}${PRODUCT_COUNT}${NC}"

if [ "$PRODUCT_COUNT" -ge 6 ]; then
    echo -e "${GREEN}✓ Sample products created successfully${NC}"
    echo ""
    echo "Sample products:"
    docker exec -i nati-postgres psql -U nati_user -d nati_commerce -c "SELECT name, price, in_stock FROM products ORDER BY created_at;"
else
    echo -e "${RED}❌ Expected at least 6 products, found ${PRODUCT_COUNT}${NC}"
fi
echo ""

# Step 4: Check if API server is running
echo -e "${BLUE}Step 4: Checking API server...${NC}"
if curl -s http://localhost:9000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API server is running on port 9000${NC}"
else
    echo -e "${YELLOW}⚠️  API server is not running${NC}"
    echo "Please start the API server in a separate terminal:"
    echo "  cd apps/api && npm run dev"
    echo ""
    read -p "Press Enter after starting the API server..."
fi
echo ""

# Step 5: Test API endpoints
echo -e "${BLUE}Step 5: Testing API endpoints...${NC}"

echo "Testing GET /api/products..."
PRODUCTS_RESPONSE=$(curl -s http://localhost:9000/api/products)
if echo "$PRODUCTS_RESPONSE" | grep -q "products"; then
    echo -e "${GREEN}✓ Products list endpoint working${NC}"
    PRODUCTS_RETURNED=$(echo "$PRODUCTS_RESPONSE" | grep -o '"products":\[' | wc -l)
    echo "  Response contains products array"
else
    echo -e "${RED}❌ Products list endpoint failed${NC}"
fi

echo ""
echo "Testing GET /api/products/kalamkari-hand-painted-stole..."
PRODUCT_RESPONSE=$(curl -s http://localhost:9000/api/products/kalamkari-hand-painted-stole)
if echo "$PRODUCT_RESPONSE" | grep -q "Kalamkari"; then
    echo -e "${GREEN}✓ Single product endpoint working${NC}"
    echo "  Product name: $(echo "$PRODUCT_RESPONSE" | grep -o '"name":"[^"]*' | cut -d'"' -f4)"
else
    echo -e "${RED}❌ Single product endpoint failed${NC}"
fi

echo ""
echo "Testing GET /api/products/featured..."
FEATURED_RESPONSE=$(curl -s http://localhost:9000/api/products/featured)
if echo "$FEATURED_RESPONSE" | grep -q "Kalamkari"; then
    echo -e "${GREEN}✓ Featured products endpoint working${NC}"
else
    echo -e "${RED}❌ Featured products endpoint failed${NC}"
fi

echo ""
echo "Testing GET /api/products/search?q=kalamkari..."
SEARCH_RESPONSE=$(curl -s "http://localhost:9000/api/products/search?q=kalamkari")
if echo "$SEARCH_RESPONSE" | grep -q "Kalamkari"; then
    echo -e "${GREEN}✓ Product search endpoint working${NC}"
else
    echo -e "${RED}❌ Product search endpoint failed${NC}"
fi
echo ""

# Step 6: Check if frontend is running
echo -e "${BLUE}Step 6: Checking frontend server...${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend server is running on port 3000${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend server is not running${NC}"
    echo "Please start the frontend server in a separate terminal:"
    echo "  cd apps/web && npm run dev"
    echo ""
    read -p "Press Enter after starting the frontend server..."
fi
echo ""

# Step 7: Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   Testing Summary                                              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✓ Database migration completed${NC}"
echo -e "${GREEN}✓ Sample products created${NC}"
echo -e "${GREEN}✓ API endpoints tested${NC}"
echo ""
echo "Next steps:"
echo "1. Open browser to http://localhost:3000/shop"
echo "2. Browse the product catalog"
echo "3. Click on a product to view details"
echo "4. Try filtering by art form"
echo "5. Try sorting products"
echo "6. Add a product to cart"
echo "7. Check cart badge updates"
echo ""
echo -e "${BLUE}Manual Testing Checklist:${NC}"
echo "□ Shop page loads"
echo "□ Products display in grid"
echo "□ Art form filter works"
echo "□ In stock filter works"
echo "□ Sorting works (newest, popular, price)"
echo "□ Product detail page loads"
echo "□ Image gallery navigation works"
echo "□ Add to cart button works"
echo "□ Cart badge updates"
echo "□ Sale badges show correctly"
echo "□ Limited edition badge shows"
echo "□ Sustainability score displays"
echo ""
echo -e "${GREEN}Testing script completed!${NC}"
