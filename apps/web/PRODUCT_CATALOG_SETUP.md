# Product Catalog Setup Guide

Complete guide to set up the product catalog system for NATI Commerce.

---

## Features Implemented

✅ Product listing page with grid layout
✅ Product detail page with image gallery
✅ Product filtering (art form, in stock, price range)
✅ Product sorting (newest, popular, price)
✅ Full-text product search
✅ Add to cart functionality
✅ Product badges (limited edition, sale, sold out)
✅ Sustainability score display
✅ Artist and art form integration
✅ Product story and inspiration sections
✅ Express API endpoints for products
✅ PostgreSQL products table with full-text search
✅ Sample product seed data (6 products)

---

## Setup Instructions

### **Step 1: Run Database Migration**

Add the products table to your PostgreSQL database:

```bash
# From project root
cd packages/database

# Run the migration
psql $DATABASE_URL -f migrations/008_products_table.sql
```

**Or using Docker:**

```bash
docker exec -i nati-postgres psql -U nati_user -d nati_commerce < packages/database/migrations/008_products_table.sql
```

**Expected output:**
```
CREATE TABLE
CREATE INDEX
(... more index creation messages ...)
INSERT 0 6
```

### **Step 2: Verify Products**

Check that sample products were created:

```bash
psql $DATABASE_URL -c "SELECT id, name, price, in_stock FROM products;"
```

**Or:**

```bash
docker exec -it nati-postgres psql -U nati_user -d nati_commerce -c "SELECT id, name, price, in_stock FROM products;"
```

**Expected:** 6 products listed including:
- Kalamkari Hand-Painted Stole
- Pochampally Ikat Silk Saree
- Gond Art Cotton Kurta
- Heritage Block Print Bed Linen Set
- Limited Edition Ikat Wall Hanging
- Handwoven Cotton Tote Bag

### **Step 3: Start API Server**

The product routes are already registered. Just start the server:

```bash
cd apps/api
npm run dev
```

**Test the API:**

```bash
# Get all products
curl http://localhost:9000/api/products

# Get single product
curl http://localhost:9000/api/products/kalamkari-hand-painted-stole

# Get featured products
curl http://localhost:9000/api/products/featured

# Search products
curl "http://localhost:9000/api/products/search?q=kalamkari"
```

### **Step 4: Start Frontend**

```bash
cd apps/web
npm run dev
```

Visit http://localhost:3000/shop to see the product catalog!

---

## Product Catalog Features

### **Shop Page** (`/shop`)

- **Grid layout**: Responsive 1-4 column grid based on screen size
- **Filters**:
  - Art form dropdown (Kalamkari, Ikat, Gond, etc.)
  - In stock only checkbox
- **Sorting**:
  - Newest (default)
  - Most Popular
  - Price: Low to High
  - Price: High to Low
- **Product cards**:
  - Product image with hover zoom
  - Art form badge
  - Product name
  - Artist name
  - Price (with sale price if applicable)
  - Production method
  - Badges: Limited Edition, Sale, Sold Out, Eco-Friendly

### **Product Detail Page** (`/products/[slug]`)

- **Image gallery**: Main image + thumbnail navigation
- **Product info**:
  - Art form and artist with links
  - Name and description
  - Price with sale discount percentage
  - Stock status
  - Quantity selector
  - Add to cart button
- **Product details**:
  - Production method
  - Fabric type
  - Sustainability score
  - Certifications
- **Story section**:
  - Story title and content
  - Inspiration
- **Limited edition indicator**: Shows edition number (e.g., 3/50)

### **Cart Integration**

Products can be added to cart from detail page:
- Select quantity
- Click "Add to Cart"
- View in cart drawer
- Proceed to checkout

---

## API Endpoints

### **GET /api/products**

Get all products with pagination and filters.

**Query params:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `sort` - Sort order: `newest`, `popular`, `price_asc`, `price_desc`
- `art_form` - Filter by art form slug
- `artist` - Filter by artist slug
- `price_min` - Minimum price
- `price_max` - Maximum price
- `in_stock` - Filter in stock products (true/false)
- `is_limited_edition` - Filter limited editions (true/false)

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 6,
    "total_pages": 1
  }
}
```

### **GET /api/products/:slugOrId**

Get single product by slug or ID.

**Response:** Product object

### **GET /api/products/featured**

Get featured products.

**Query params:**
- `limit` - Number of products (default: 8)

**Response:** Array of products

### **GET /api/products/search**

Search products by query.

**Query params:**
- `q` - Search query (required)
- `page` - Page number
- `limit` - Items per page

**Response:** Same as GET /api/products

### **POST /api/products**

Create new product (TODO: add authentication).

**Request body:**
```json
{
  "name": "Product Name",
  "slug": "product-slug",
  "description": "Product description",
  "price": 2500,
  "images": ["url1", "url2"],
  "thumbnail": "url",
  "in_stock": true,
  "stock_quantity": 10,
  "art_form_id": "uuid",
  "artist_id": "uuid",
  "fabric_type": "Cotton",
  "production_method": "handloom",
  "is_featured": false
}
```

---

## Database Schema

### **products** table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Product name |
| slug | VARCHAR(255) | URL-friendly slug (unique) |
| description | TEXT | Product description |
| price | DECIMAL(15,2) | Current price in INR |
| compare_at_price | DECIMAL(15,2) | Original price (for sale display) |
| images | JSONB | Array of image URLs |
| thumbnail | TEXT | Thumbnail image URL |
| in_stock | BOOLEAN | Stock availability |
| stock_quantity | INTEGER | Available quantity |
| art_form_id | UUID | FK to cultural_art_forms |
| artist_id | UUID | FK to cultural_artists |
| fabric_type | VARCHAR(100) | Fabric material |
| production_method | VARCHAR(50) | handloom, hand_painted, etc. |
| story_title | VARCHAR(255) | Product story title |
| story_content | TEXT | Product story content |
| inspiration | TEXT | Design inspiration |
| sustainability_score | INTEGER | 0-100 score |
| certifications | JSONB | Array of certifications |
| is_limited_edition | BOOLEAN | Limited edition flag |
| edition_size | INTEGER | Total edition size |
| edition_number | INTEGER | This edition number |
| drop_id | UUID | FK to drops_collections |
| is_featured | BOOLEAN | Featured product flag |
| view_count | BIGINT | Product view analytics |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- slug (unique)
- art_form_id
- artist_id
- in_stock
- price
- is_featured
- drop_id
- created_at
- Full-text search on name + description

---

## Sample Products

The migration includes 6 sample products:

1. **Kalamkari Hand-Painted Stole** - ₹2,500
   - Art Form: Kalamkari
   - Cotton, hand-painted
   - Sustainability: 95/100
   - Featured product

2. **Pochampally Ikat Silk Saree** - ₹8,500
   - Art Form: Ikat
   - Pure silk, handloom
   - Sustainability: 90/100
   - Featured product

3. **Gond Art Cotton Kurta** - ₹1,850
   - Art Form: Gond
   - Organic cotton, hand-painted
   - Sustainability: 98/100
   - Featured product

4. **Heritage Block Print Bed Linen Set** - ₹3,200
   - Art Form: Kalamkari
   - Cotton, block print
   - Sustainability: 92/100

5. **Limited Edition Ikat Wall Hanging** - ₹15,000
   - Art Form: Ikat
   - Silk cotton blend, handloom
   - Sustainability: 100/100
   - Limited edition: 3/50
   - Featured product

6. **Handwoven Cotton Tote Bag** - ₹650
   - Cotton, handloom
   - Sustainability: 100/100

---

## Adding New Products

### **Via API:**

```bash
curl -X POST http://localhost:9000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "slug": "new-product",
    "description": "Product description",
    "price": 2500,
    "images": ["https://example.com/image.jpg"],
    "thumbnail": "https://example.com/thumb.jpg",
    "in_stock": true,
    "stock_quantity": 10,
    "fabric_type": "Cotton",
    "production_method": "handloom",
    "sustainability_score": 95,
    "certifications": ["GOTS"],
    "is_featured": true
  }'
```

### **Via SQL:**

```sql
INSERT INTO products (
  name, slug, description, price, images, thumbnail,
  in_stock, stock_quantity, fabric_type, production_method,
  sustainability_score, certifications, is_featured
) VALUES (
  'New Product',
  'new-product',
  'Product description',
  2500,
  '["https://example.com/image.jpg"]',
  'https://example.com/thumb.jpg',
  true,
  10,
  'Cotton',
  'handloom',
  95,
  '["GOTS"]',
  true
);
```

---

## Image Recommendations

### **Product Images:**
- **Aspect ratio**: 3:4 (portrait)
- **Resolution**: Minimum 800×1067px
- **Format**: JPG or WebP
- **Size**: Under 500KB per image
- **Count**: 2-4 images per product

### **Thumbnail:**
- **Aspect ratio**: 1:1 (square) or 3:4
- **Resolution**: 400×400px or 400×533px
- **Format**: JPG or WebP
- **Size**: Under 100KB

### **Image Sources:**
For testing, you can use:
- **Unsplash**: https://unsplash.com/s/photos/textile
- **Pexels**: https://www.pexels.com/search/indian textile/
- Your own product photography

---

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] Sample products are created
- [ ] API returns products list
- [ ] API returns single product by slug
- [ ] Shop page loads and displays products
- [ ] Product filters work correctly
- [ ] Product sorting works correctly
- [ ] Product detail page loads
- [ ] Image gallery navigation works
- [ ] Add to cart functionality works
- [ ] Cart badge updates
- [ ] Search products works
- [ ] Full-text search returns relevant results
- [ ] Stock status displays correctly
- [ ] Limited edition badge shows
- [ ] Sale badges show with discount
- [ ] Sustainability score displays
- [ ] Artist and art form links work

---

## Next Steps

After product catalog is working:

1. **Product Variants** - Size, color options
2. **Product Reviews** - Customer ratings and reviews
3. **Wishlist** - Save products for later
4. **Related Products** - Show similar items
5. **Product Recommendations** - AI-powered suggestions
6. **Advanced Search** - Filters, facets, price ranges
7. **Product Admin Panel** - CRUD interface for products
8. **Inventory Management** - Stock tracking and alerts
9. **Product Images CDN** - Cloudinary/Imgix integration
10. **SEO Optimization** - Meta tags, structured data

---

## Troubleshooting

### **Issue: Products not showing on shop page**

**Solution:**
- Check API is running on port 9000
- Verify NEXT_PUBLIC_API_URL in .env.local
- Check browser console for API errors
- Verify database has products: `SELECT COUNT(*) FROM products;`

### **Issue: Images not loading**

**Solution:**
- Check image URLs are valid
- Update `next.config.js` to allow image domains
- Use placeholder images for testing
- Verify images array in database is valid JSON

### **Issue: Search not working**

**Solution:**
- Verify full-text search index exists
- Check search query has at least 3 characters
- Test search via API directly
- Check PostgreSQL full-text search is enabled

### **Issue: Filters not applying**

**Solution:**
- Check art form slugs match database
- Verify checkbox state is being passed to API
- Check API query params in network tab
- Test filters via API directly with curl

---

## Performance Optimization

### **Database:**
- Indexes on commonly filtered columns
- Full-text search index for fast searching
- Pagination to limit result size
- Denormalized art_form and artist names

### **Frontend:**
- Image lazy loading
- Responsive image sizes
- Client-side caching with React Query
- Virtual scrolling for large lists (future)

### **API:**
- Rate limiting to prevent abuse
- Compression middleware
- Response caching (Redis, future)
- Database query optimization

---

## Production Considerations

### **Before Going Live:**

1. **Image CDN**: Move product images to Cloudinary/Imgix
2. **Database Indexes**: Add indexes for actual usage patterns
3. **Caching**: Add Redis for product listing cache
4. **Search**: Consider Typesense/Algolia for better search
5. **Monitoring**: Track slow queries and API response times
6. **Admin Panel**: Build product management interface
7. **Authentication**: Add auth to POST/PUT/DELETE endpoints
8. **Validation**: Add Zod schemas for API input validation
9. **Error Handling**: Improve error messages and logging
10. **SEO**: Add meta tags, Open Graph, structured data

---

**Last Updated:** 2025-10-31
**Version:** 1.0.0
