# Clerk Authentication Setup Guide

Complete guide to set up Clerk authentication for NATI Commerce.

---

## 🔐 Features Implemented

✅ Sign-in page with Clerk UI
✅ Sign-up page with Clerk UI
✅ User profile management
✅ Protected routes middleware
✅ User button component
✅ Navigation header with auth state
✅ Webhook handler for user sync
✅ Session management

---

## 📋 Prerequisites

- Node.js 18+ installed
- Clerk account (free tier available)
- NATI Commerce repository cloned

---

## 🚀 Setup Instructions

### **Step 1: Create Clerk Account**

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application
4. Choose "Next.js" as your framework

### **Step 2: Get API Keys**

From your Clerk dashboard:

1. Go to **API Keys** section
2. Copy the following:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

### **Step 3: Configure Environment Variables**

Update `apps/web/.env.local`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk URLs (already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### **Step 4: Configure Clerk Dashboard**

In your Clerk dashboard:

#### **A. Set URLs:**
- **Sign-in URL**: `/sign-in`
- **Sign-up URL**: `/sign-up`
- **After sign-in URL**: `/`
- **After sign-up URL**: `/`

#### **B. Enable Social Providers (Optional):**
Go to **User & Authentication** → **Social Connections**
- Enable Google (recommended)
- Enable Facebook (optional)
- Enable Apple (optional)

#### **C. Configure Email Settings:**
Go to **Email & SMS** → **Email**
- Customize email templates with NATI branding
- Update "From" address when verified

### **Step 5: Set Up Webhook (User Sync)**

To sync Clerk users to your PostgreSQL database:

1. In Clerk dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Enter your webhook URL:
   ```
   https://your-domain.com/api/webhooks/clerk
   ```
   (For development: use ngrok or similar)

4. Subscribe to these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`

5. Copy the **Signing Secret**

6. Add to `.env.local`:
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

### **Step 6: Install Dependencies**

```bash
cd apps/web
npm install svix
```

(svix is used for webhook signature verification)

### **Step 7: Test Authentication**

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Click **"Join"** button → Should redirect to `/sign-up`

4. Create an account:
   - Enter email
   - Set password
   - Verify email (check inbox)

5. Sign in → Should redirect to `/`

6. Check profile:
   - Click user avatar (top right)
   - Click **"Profile"** → Should show profile page

7. Test protected routes:
   - Try visiting `/profile` while signed out
   - Should redirect to `/sign-in`

---

## 🔧 Customization

### **Branding (Clerk UI)**

Update Clerk dashboard appearance:

1. Go to **Customization** → **Appearance**
2. Choose **"Use custom theme"**
3. Set brand colors:
   ```json
   {
     "variables": {
       "colorPrimary": "#2C1810",
       "colorText": "#1A1A1A",
       "colorBackground": "#FFFFFF",
       "colorInputBackground": "#FAF8F5"
     }
   }
   ```

4. Upload NATI logo (recommended size: 512×512px)

### **Custom Email Templates**

1. Go to **Email & SMS** → **Email**
2. Customize templates:
   - Welcome email
   - Verification email
   - Password reset
   - Magic link

Add NATI branding:
```html
<p>Welcome to NATI - Native Art and Textile India</p>
<p>Join us in reviving Indian folk art through sustainable fashion.</p>
```

---

## 🛡️ Security Features

### **Implemented:**
✅ Session-based authentication
✅ Secure password hashing (managed by Clerk)
✅ Email verification required
✅ CSRF protection
✅ XSS protection
✅ Rate limiting on auth endpoints

### **Middleware Protection:**

Protected routes (require sign-in):
- `/profile/*`
- `/orders/*`
- `/wishlist/*`
- `/settings/*`
- `/dashboard/*`

Public routes (no auth required):
- `/`
- `/sign-in`
- `/sign-up`
- `/products/*`
- `/drops/*`
- `/artists/*`

### **Session Configuration:**

Default settings (managed by Clerk):
- Session duration: 7 days (rolling)
- Multi-device sessions: Enabled
- Concurrent sessions: Allowed
- Remember me: Enabled

---

## 📊 User Data Flow

### **Sign-Up Flow:**
```
1. User fills sign-up form → Clerk
2. Clerk creates user account
3. Clerk sends verification email
4. User verifies email
5. Clerk webhook triggers → /api/webhooks/clerk
6. Webhook syncs user to PostgreSQL
7. User redirected to homepage
```

### **Sign-In Flow:**
```
1. User enters credentials → Clerk
2. Clerk validates credentials
3. Clerk creates session
4. User redirected to homepage
5. Session cookie set (httpOnly, secure)
```

### **Database Sync:**
When users sign up/update profile:
- Webhook receives event from Clerk
- User data synced to `customers` table in PostgreSQL
- Includes: `clerk_id`, `email`, `first_name`, `last_name`, `profile_image`

---

## 🧪 Testing

### **Manual Testing Checklist:**

- [ ] Sign-up with email
- [ ] Receive verification email
- [ ] Verify email and complete signup
- [ ] Sign out
- [ ] Sign in with credentials
- [ ] Visit `/profile` (should work)
- [ ] Sign out
- [ ] Try to visit `/profile` (should redirect to `/sign-in`)
- [ ] Password reset flow
- [ ] Update profile information
- [ ] Social login (if enabled)

### **Webhook Testing:**

Use Clerk's webhook testing feature:
1. Go to **Webhooks** → Select your endpoint
2. Click **"Testing"** tab
3. Send test events for `user.created`, `user.updated`, `user.deleted`
4. Check your API logs to verify events are received

---

## 🚨 Troubleshooting

### **Issue: "Clerk publishable key not found"**

**Solution:**
- Ensure `.env.local` exists in `apps/web/`
- Check key starts with `pk_test_` (not production key)
- Restart dev server after adding keys

### **Issue: "Redirect loop on sign-in"**

**Solution:**
- Check `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` is set to `/`
- Clear browser cookies
- Verify middleware is not blocking the redirect URL

### **Issue: Webhook not receiving events**

**Solution:**
- Use ngrok for local testing: `ngrok http 3000`
- Update webhook URL in Clerk dashboard
- Check `CLERK_WEBHOOK_SECRET` is correct
- Verify endpoint is publicly accessible

### **Issue: "Middleware is not running"**

**Solution:**
- Ensure `middleware.ts` is in `apps/web/src/` (not nested deeper)
- Check `matcher` config includes your routes
- Restart dev server

---

## 📈 Next Steps

After authentication is working:

1. **Add User Profile Fields:**
   - Phone number
   - Shipping address
   - NATI Circle membership status

2. **Implement NATI Circle:**
   - Loyalty tiers (Explorer, Artisan, Curator, Patron)
   - Early access to drops
   - Exclusive discounts

3. **Order History:**
   - Create `/orders` page
   - Fetch user's orders from PostgreSQL
   - Show order status, tracking

4. **Wishlist:**
   - Create `/wishlist` page
   - Save favorite products
   - Get notified when on sale

5. **Email Preferences:**
   - Create `/settings/notifications` page
   - Opt-in/out of drop announcements
   - Artist updates

---

## 🔗 Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js App Router Integration](https://clerk.com/docs/quickstarts/nextjs)
- [Webhooks Guide](https://clerk.com/docs/webhooks/overview)
- [Clerk Components](https://clerk.com/docs/components/overview)

---

## ✅ Verification

Authentication setup is complete when:

- ✅ Users can sign up and verify email
- ✅ Users can sign in/out
- ✅ Protected routes redirect to `/sign-in`
- ✅ Profile page loads user data
- ✅ Header shows user button when signed in
- ✅ Webhook syncs users to database
- ✅ Session persists across page reloads

**Status:** Ready for production deployment! 🚀

---

**Last Updated:** 2025-10-31
**Version:** 1.0.0
