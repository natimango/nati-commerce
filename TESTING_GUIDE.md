# Product Catalog Testing Guide

Step-by-step guide to test the product catalog implementation.

---

## Automated Testing (Recommended)

Run the automated test script:

```bash
cd ~/nati-commerce
./test-product-catalog.sh
```

This will:
- ✅ Check Docker is running
- ✅ Run database migration
- ✅ Verify sample products created
- ✅ Test all API endpoints
- ✅ Provide testing checklist

---

## Manual Testing (Step-by-Step)

If you prefer to test manually, follow these steps:

### **Step 1: Start Docker Services**

```bash
cd ~/nati-commerce
docker compose up -d
```

Wait for services to start (about 10 seconds).

### **Step 2: Run Database Migration**

Create the products table and seed sample data:

```bash
docker exec -i nati-postgres psql -U nati_user -d nati_commerce < packages/database/migrations/008_products_table.sql
```

**Expected output:**
```
CREATE TABLE
CREATE INDEX
CREATE INDEX
...
INSERT 0 6
```

### **Step 3: Verify Products Created**

```bash
docker exec -it nati-postgres psql -U nati_user -d nati_commerce -c "SELECT name, price, in_stock FROM products;"
```

**Expected:** 6 products listed:
```
                    name                    | price  | in_stock
-------------------------------------------+--------+----------
 Kalamkari Hand-Painted Stole              | 2500   | t
 Pochampally Ikat Silk Saree               | 8500   | t
 Gond Art Cotton Kurta                     | 1850   | t
 Heritage Block Print Bed Linen Set        | 3200   | t
 Limited Edition Ikat Wall Hanging         | 15000  | t
 Handwoven Cotton Tote Bag                 | 650    | t
```

### **Step 4: Start API Server**

Open a new terminal:

```bash
cd ~/nati-commerce/apps/api
npm run dev
```

**Expected output:**
```
🚀 NATI Commerce API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Environment: development
Port: 9000
Database: Connected ✓
...
```

Leave this terminal running.

### **Step 5: Test API Endpoints**

Open another terminal and test the API:

#### **Test 1: Get all products**

```bash
curl http://localhost:9000/api/products | jq
```

**Expected:** JSON response with products array and pagination:
```json
{
  "products": [
    {
      "id": "...",
      "name": "Kalamkari Hand-Painted Stole",
      "slug": "kalamkari-hand-painted-stole",
      "price": "2500.00",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 6,
    "total_pages": 1
  }
}
```

#### **Test 2: Get single product**

```bash
curl http://localhost:9000/api/products/kalamkari-hand-painted-stole | jq
```

**Expected:** Single product object with all details.

#### **Test 3: Get featured products**

```bash
curl http://localhost:9000/api/products/featured | jq
```

**Expected:** Array of 4 featured products.

#### **Test 4: Search products**

```bash
curl "http://localhost:9000/api/products/search?q=kalamkari" | jq
```

**Expected:** Products matching "kalamkari" in name or description.

#### **Test 5: Filter by art form**

```bash
curl "http://localhost:9000/api/products?art_form=ikat" | jq
```

**Expected:** Only Ikat products (2 products).

#### **Test 6: Sort by price**

```bash
curl "http://localhost:9000/api/products?sort=price_asc" | jq
```

**Expected:** Products sorted from ₹650 to ₹15,000.

### **Step 6: Start Frontend Server**

Open another terminal:

```bash
cd ~/nati-commerce/apps/web
npm run dev
```

**Expected output:**
```
▲ Next.js 15.0.3
- Local:        http://localhost:3000
- Ready in 2.5s
```

Leave this terminal running.

### **Step 7: Test Frontend Pages**

Open your browser to: **http://localhost:3000/shop**

---

## Frontend Testing Checklist

### **Shop Page** (http://localhost:3000/shop)

Test each feature:

#### ✅ **Page Load**
- [ ] Page loads without errors
- [ ] Products display in grid layout
- [ ] Grid is responsive (resize browser window)
- [ ] All 6 products are visible

#### ✅ **Product Cards**
- [ ] Product images load
- [ ] Product names display
- [ ] Prices display correctly (₹2,500 format)
- [ ] Artist names show ("by [Artist Name]")
- [ ] Art form badges show (KALAMKARI, IKAT, GOND)
- [ ] Limited edition badge shows on wall hanging
- [ ] Production method shows (handloom, hand painted, etc.)
- [ ] Hover effect works on cards

#### ✅ **Filtering**
- [ ] Art form dropdown shows all art forms
- [ ] Select "Ikat" → Shows only 2 products
- [ ] Select "Kalamkari" → Shows 2 products
- [ ] Select "Gond" → Shows 1 product
- [ ] "In stock only" checkbox works
- [ ] Select "All Art Forms" → Shows all 6 products

#### ✅ **Sorting**
- [ ] Sort by "Newest" → Products in newest-first order
- [ ] Sort by "Price: Low to High" → ₹650, ₹1,850, ₹2,500, ₹3,200, ₹8,500, ₹15,000
- [ ] Sort by "Price: High to Low" → ₹15,000 first, ₹650 last
- [ ] Sort by "Most Popular" → Works

#### ✅ **Product Count**
- [ ] Shows "Showing 6 products" at bottom
- [ ] Count updates when filtering

---

### **Product Detail Page**

Click on "Kalamkari Hand-Painted Stole" to test:

#### ✅ **Page Load**
- [ ] URL is /products/kalamkari-hand-painted-stole
- [ ] Page loads without errors
- [ ] Breadcrumb shows: Home / Shop / Kalamkari

#### ✅ **Images**
- [ ] Main product image loads
- [ ] Thumbnail images show below (if multiple images)
- [ ] Click thumbnail → Main image changes

#### ✅ **Product Information**
- [ ] Art form badge shows "KALAMKARI"
- [ ] Product name: "Kalamkari Hand-Painted Stole"
- [ ] Artist name shows with link
- [ ] Price shows: ₹2,500
- [ ] Compare-at price shows: ₹2,500 (crossed out)
- [ ] Sale badge shows "Save 29%"
- [ ] Description text displays
- [ ] Stock status shows

#### ✅ **Product Details Section**
- [ ] Production Method: Hand Painted
- [ ] Fabric: Cotton
- [ ] Sustainability Score: 95/100 (green)
- [ ] Certifications show: GOTS, Fair Trade

#### ✅ **Story Section**
- [ ] Story title shows: "The Art of Kalamkari"
- [ ] Story content displays
- [ ] Inspiration text displays

#### ✅ **Add to Cart**
- [ ] Quantity selector works (-, +, input)
- [ ] Decrease doesn't go below 1
- [ ] Increase works
- [ ] "Add to Cart" button is enabled
- [ ] Click "Add to Cart" → Alert shows "Added to cart!"
- [ ] Cart badge in header updates to show "1"

---

### **Test Limited Edition Product**

Click on "Limited Edition Ikat Wall Hanging":

#### ✅ **Limited Edition Features**
- [ ] Badge shows "Limited Edition (3/50)"
- [ ] Price shows: ₹15,000 (no sale price)
- [ ] All standard features work

---

### **Test Cart Integration**

After adding products to cart:

#### ✅ **Cart Badge**
- [ ] Badge shows correct count (1, 2, 3...)
- [ ] Badge updates immediately after adding items

#### ✅ **Cart Drawer**
- [ ] Click "Cart" button → Drawer opens from right
- [ ] Shows all added products
- [ ] Each product shows: image, name, artist, price, quantity
- [ ] Quantity selector works in cart
- [ ] Remove button works
- [ ] Subtotal calculates correctly
- [ ] "Proceed to Checkout" button works

---

## Troubleshooting

### **Issue: Migration fails with "relation already exists"**

**Solution:** Products table already exists. To re-run:

```bash
# Drop existing products table
docker exec -it nati-postgres psql -U nati_user -d nati_commerce -c "DROP TABLE IF EXISTS products CASCADE;"

# Re-run migration
docker exec -i nati-postgres psql -U nati_user -d nati_commerce < packages/database/migrations/008_products_table.sql
```

### **Issue: API returns empty products array**

**Solution:**
1. Check products exist in database:
   ```bash
   docker exec -it nati-postgres psql -U nati_user -d nati_commerce -c "SELECT COUNT(*) FROM products;"
   ```
2. If count is 0, re-run migration

### **Issue: Frontend shows "Failed to load products"**

**Solution:**
1. Check API is running: `curl http://localhost:9000/health`
2. Check browser console for errors
3. Verify NEXT_PUBLIC_API_URL in apps/web/.env.local:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:9000
   ```
4. Restart frontend: `Ctrl+C` and `npm run dev`

### **Issue: Images not loading**

**Solution:**
Sample products use Unsplash placeholder images. If images don't load:
1. Check internet connection
2. Images should load from unsplash.com
3. Check browser console for CORS errors

### **Issue: Cart badge doesn't update**

**Solution:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Clear browser cache and reload
4. Check localStorage has "nati-cart" key

---

## Success Criteria

All tests pass when:

✅ Database migration completes successfully
✅ 6 sample products created in database
✅ All 5 API endpoints return valid JSON
✅ Shop page displays all products
✅ Filters and sorting work correctly
✅ Product detail page displays all information
✅ Add to cart functionality works
✅ Cart badge updates correctly
✅ Cart drawer shows added products
✅ No console errors in browser

---

## Next Steps After Testing

Once all tests pass:

1. **Add Real Product Images**
   - Upload to Cloudinary or image CDN
   - Update product image URLs in database

2. **Add More Products**
   - Use POST /api/products endpoint
   - Or insert via SQL

3. **Test on Different Devices**
   - Mobile phone
   - Tablet
   - Different browsers

4. **Performance Testing**
   - Test with 50+ products
   - Check page load times
   - Optimize if needed

5. **Continue Building**
   - Add product reviews
   - Add wishlist
   - Add advanced search
   - Add product recommendations

---

## Questions?

If you encounter any issues:

1. Check API server logs in terminal
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure Docker services are running
5. Check database connection

**Happy Testing! 🎉**
