# NATI Commerce - Admin Panel Testing Guide

This guide will help you test the complete admin panel functionality.

## Prerequisites

Before testing, ensure you have:
1. Docker containers running (PostgreSQL, Redis)
2. Database migrations completed
3. Sample data loaded (products, art forms, artists)
4. Backend API running on port 9000
5. Frontend running on port 3000

## Step 1: Environment Setup

### Configure Admin Access

Add your email to the admin whitelist in `apps/web/.env.local`:

```bash
# Add this line with your Clerk account email
ADMIN_EMAILS=your-email@example.com
```

If you have multiple admins, separate with commas:
```bash
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

### Install Dependencies

```bash
cd apps/web
npm install
```

## Step 2: Start Development Servers

### Terminal 1: Start Backend API
```bash
cd apps/api
npm run dev
```

Should see: `Server running on port 9000`

### Terminal 2: Start Frontend
```bash
cd apps/web
npm run dev
```

Should see: `✓ Ready on http://localhost:3000`

## Step 3: Authentication Testing

### 3.1 Test Unauthorized Access
1. Open browser: http://localhost:3000/admin
2. If not signed in, should redirect to `/sign-in`
3. Sign in with Clerk

### 3.2 Test Non-Admin Access
1. Sign in with an email NOT in `ADMIN_EMAILS`
2. Try to access http://localhost:3000/admin
3. Should redirect to homepage `/`

### 3.3 Test Admin Access
1. Sign in with email that IS in `ADMIN_EMAILS`
2. Navigate to http://localhost:3000/admin
3. Should see admin dashboard with stats

## Step 4: Test Admin Pages

### 4.1 Dashboard (http://localhost:3000/admin)
- [ ] Page loads without errors
- [ ] See 4 stat cards: Revenue, Orders, Products, Customers
- [ ] See Quick Actions section
- [ ] Sidebar shows all 8 navigation items
- [ ] Active page highlighted in sidebar

### 4.2 Products Management

#### Products List (http://localhost:3000/admin/products)
- [ ] Page loads with product table
- [ ] See sample products from database
- [ ] Product thumbnails display correctly
- [ ] Price formatted as ₹X,XXX
- [ ] Stock quantity shows
- [ ] Status badges (In Stock/Out of Stock)
- [ ] "Edit" and "View" buttons visible
- [ ] Click "View" opens product page in new tab

#### New Product (http://localhost:3000/admin/products/new)
- [ ] Page loads product form
- [ ] Art form dropdown populated
- [ ] All form fields render:
  - Basic info (name, slug, description)
  - Pricing (price, compare_at_price)
  - Inventory (stock_quantity, in_stock toggle)
  - Cultural metadata (art form, fabric, production method)
  - Images (thumbnail, gallery)
  - Product story
  - Limited edition settings
- [ ] Auto-slug generation works (type in name, slug updates)
- [ ] Form validation works (try submitting empty)
- [ ] Submit creates new product (check console/network tab)

#### Edit Product (http://localhost:3000/admin/products/[id]/edit)
1. From products list, click "Edit" on any product
2. Check:
   - [ ] Form loads with existing product data
   - [ ] All fields populated correctly
   - [ ] Can modify values
   - [ ] Save updates product (check API response)

### 4.3 Orders Management (http://localhost:3000/admin/orders)
- [ ] Page loads without errors
- [ ] See status filter dropdown with options:
  - All Orders, Pending, Processing, Shipped, Delivered, Cancelled
- [ ] Search input visible
- [ ] Empty state shows (since no orders yet)
- [ ] Empty state has helpful icon and message

### 4.4 Customers Management (http://localhost:3000/admin/customers)
- [ ] Page loads without errors
- [ ] Search input visible
- [ ] Filter dropdown (All/Active/Inactive)
- [ ] Empty state shows with icon
- [ ] Table headers visible

### 4.5 Art Forms (http://localhost:3000/admin/art-forms)
- [ ] Page loads without errors
- [ ] "+ Add Art Form" button visible
- [ ] Art forms display in grid layout
- [ ] Each card shows:
  - Art form name
  - Region
  - Active/Inactive badge
  - History snippet (truncated)
  - Edit and View links
- [ ] Click "View" opens public art form page
- [ ] Click "Edit" goes to edit page

### 4.6 Artists (http://localhost:3000/admin/artists)
- [ ] Page loads without errors
- [ ] "+ Add Artist" button visible
- [ ] Search input visible
- [ ] Artists display in grid (if any exist)
- [ ] Empty state shows if no artists
- [ ] Each artist card shows:
  - Profile image
  - Name and location
  - Specialization
  - Bio snippet
  - Years of experience
  - Edit and View Profile links

### 4.7 Analytics (http://localhost:3000/admin/analytics)
- [ ] Page loads without errors
- [ ] Revenue Overview section with 4 cards:
  - Today, This Week, This Month, Last Month
- [ ] Orders Overview section with 4 cards
- [ ] Top Performing Products table
- [ ] Key Metrics section (AOV, Conversion, Retention)

### 4.8 Settings (http://localhost:3000/admin/settings)
- [ ] Page loads without errors
- [ ] Store Information section:
  - Store Name input
  - Store Email input
- [ ] Pricing & Shipping section:
  - Currency dropdown
  - Tax Rate input
  - Shipping Fee input
  - Free Shipping Threshold input
- [ ] Features section with 3 toggles:
  - Featured Products (toggle works)
  - Drops Collections (toggle works)
  - Newsletter (toggle works)
- [ ] "Save Settings" button works (shows alert)

## Step 5: Navigation Testing

### Sidebar Navigation
Test clicking each sidebar item:
- [ ] Dashboard → `/admin`
- [ ] Products → `/admin/products`
- [ ] Orders → `/admin/orders`
- [ ] Customers → `/admin/customers`
- [ ] Art Forms → `/admin/art-forms`
- [ ] Artists → `/admin/artists`
- [ ] Analytics → `/admin/analytics`
- [ ] Settings → `/admin/settings`

### Active State
- [ ] Current page highlighted in sidebar
- [ ] Icon and text color changes for active page

## Step 6: Responsive Design Testing

Test on different screen sizes:
- [ ] Desktop (1920px) - Sidebar + content side by side
- [ ] Tablet (768px) - Layout still functional
- [ ] Mobile (375px) - Check if sidebar adapts

## Step 7: Browser Console Testing

Open browser developer tools (F12):
- [ ] No console errors on any admin page
- [ ] No 404 errors for API calls
- [ ] No React hydration errors
- [ ] Network tab shows successful API responses

## Common Issues & Troubleshooting

### Issue: "ADMIN_EMAILS is not defined"
**Solution:** Add `ADMIN_EMAILS=your-email@example.com` to `apps/web/.env.local` and restart frontend

### Issue: Redirected to homepage after sign in
**Solution:** Your email is not in ADMIN_EMAILS whitelist. Update .env.local with your Clerk email

### Issue: "lucide-react module not found"
**Solution:**
```bash
cd apps/web
npm install lucide-react
```

### Issue: Art forms dropdown empty
**Solution:** Check if art forms are in database:
```bash
curl http://localhost:9000/api/art-forms
```

If empty, run the art forms insert SQL from previous testing guide.

### Issue: API calls fail with CORS error
**Solution:** Ensure backend is running and CORS is configured correctly in `apps/api/src/index.ts`

### Issue: Images don't load
**Solution:** Check that `NEXT_PUBLIC_API_URL` is set in `apps/web/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:9000
```

## Test Results

Use this checklist to track your testing:

### Authentication
- [ ] Unauthorized access blocked
- [ ] Non-admin access blocked
- [ ] Admin access works

### Pages Load Successfully
- [ ] Dashboard
- [ ] Products List
- [ ] New Product Form
- [ ] Edit Product Form
- [ ] Orders
- [ ] Customers
- [ ] Art Forms
- [ ] Artists
- [ ] Analytics
- [ ] Settings

### Functionality
- [ ] Product form submission works
- [ ] Auto-slug generation works
- [ ] Sidebar navigation works
- [ ] Toggle switches work (Settings page)
- [ ] Status filters work (Orders page)
- [ ] Search inputs render
- [ ] External links open in new tab

### UI/UX
- [ ] No visual glitches
- [ ] Icons display correctly
- [ ] Colors match brand (terracotta/ochre)
- [ ] Responsive on different screen sizes
- [ ] Empty states show helpful messages

## Next Steps After Testing

Once testing is complete:
1. Document any bugs found
2. Test with real order data (create test orders)
3. Test product creation end-to-end
4. Integrate real analytics data
5. Add image upload functionality
6. Implement art form and artist CRUD operations
