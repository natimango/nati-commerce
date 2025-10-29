# NATI Commerce REST API

Express.js REST API backend for NATI Commerce platform.

## Features

- RESTful API design with Express.js
- PostgreSQL database with connection pooling
- Service layer architecture for business logic
- Centralized error handling
- Request validation middleware
- Rate limiting (100 requests per 15 minutes)
- CORS support
- Compression
- Security headers (Helmet)
- Logging (Morgan)

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 16 with pgvector
- **Language**: JavaScript (ES Modules)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 16 with pgvector extension
- Docker (for local development)

### Installation

```bash
# From project root
npm install --legacy-peer-deps

# Or install API dependencies specifically
cd apps/api
npm install
```

### Environment Variables

Create a `.env` file in `apps/api/`:

```bash
# Server
NODE_ENV=development
PORT=9000

# Database
DATABASE_URL=postgresql://nati_user:nati_password@localhost:5432/nati_commerce

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Database Setup

Ensure the database is migrated and seeded:

```bash
# From project root
cd packages/database
npm run migrate
npm run seed
```

### Running the API

```bash
# Development mode with auto-reload
cd apps/api
npm run dev

# Production mode
npm start
```

The API will start on `http://localhost:9000`

## API Endpoints

### Health Check

```
GET /health
```

Returns server status, uptime, and environment info.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-29T13:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

---

## Art Forms API

Manage Indian folk art forms.

### List Art Forms

```
GET /api/art-forms
```

**Query Parameters:**
- `is_active` (boolean): Filter by active status
- `region` (string): Filter by region (partial match)
- `limit` (number): Results per page (default: 50)
- `offset` (number): Pagination offset (default: 0)

**Example:**
```bash
curl http://localhost:9000/api/art-forms?region=Gujarat&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Kalamkari",
      "slug": "kalamkari",
      "region": "Andhra Pradesh & Telangana",
      "description": "Ancient art of hand painting...",
      "origin_story": "...",
      "cultural_significance": "...",
      "techniques": ["hand-painted", "block-printed"],
      "is_active": true,
      "created_at": "2025-10-29T..."
    }
  ],
  "total": 6,
  "limit": 50,
  "offset": 0,
  "hasMore": false
}
```

### Get Art Form by ID

```
GET /api/art-forms/:id
```

**Response:**
```json
{
  "success": true,
  "data": { /* art form object */ }
}
```

### Get Art Form by Slug

```
GET /api/art-forms/slug/:slug
```

**Example:**
```bash
curl http://localhost:9000/api/art-forms/slug/kalamkari
```

### Get Artists for Art Form

```
GET /api/art-forms/:id/artists
```

Returns all artists specializing in this art form.

### Create Art Form

```
POST /api/art-forms
```

**Body:**
```json
{
  "name": "Madhubani",
  "slug": "madhubani",
  "region": "Bihar",
  "description": "Folk art from Mithila region",
  "origin_story": "...",
  "cultural_significance": "...",
  "techniques": ["hand-painted"],
  "typical_motifs": ["nature", "mythology"],
  "primary_colors": ["red", "yellow", "blue"],
  "is_active": true
}
```

### Update Art Form

```
PATCH /api/art-forms/:id
```

**Body:** (partial update)
```json
{
  "description": "Updated description",
  "is_active": false
}
```

### Delete Art Form

```
DELETE /api/art-forms/:id
```

Soft delete (sets `is_active = false`).

---

## Artists API

Manage artists and artisans.

### List Artists

```
GET /api/artists
```

**Query Parameters:**
- `is_active` (boolean): Filter by active status
- `is_verified` (boolean): Filter by verification status
- `art_form_id` (uuid): Filter by art form
- `limit` (number): Results per page (default: 50)
- `offset` (number): Pagination offset (default: 0)

### Get Artist by ID

```
GET /api/artists/:id
```

### Get Artist by Slug

```
GET /api/artists/slug/:slug
```

### Get Artist's Product Credits

```
GET /api/artists/:id/credits
```

Returns all products where this artist has contributed, with revenue split info.

### Create Artist

```
POST /api/artists
```

**Body:**
```json
{
  "name": "Kalyan Joshi",
  "slug": "kalyan-joshi",
  "art_form_id": "uuid",
  "bio": "Master artisan...",
  "location": "Srikalahasti, Andhra Pradesh",
  "years_of_experience": 25,
  "specialization": "Natural dyes",
  "story": "Born into a family...",
  "awards": ["National Award"],
  "is_verified": true,
  "is_active": true
}
```

### Update Artist

```
PATCH /api/artists/:id
```

### Delete Artist

```
DELETE /api/artists/:id
```

### Follow Artist

```
POST /api/artists/:id/follow
```

Increments follower count by 1.

### Unfollow Artist

```
POST /api/artists/:id/unfollow
```

Decrements follower count by 1.

---

## Mills API

Manage fabric mills and suppliers.

### List Mills

```
GET /api/mills
```

**Query Parameters:**
- `is_active` (boolean): Filter by active status
- `mill_type` (string): Filter by type (handloom, powerloom, organic)
- `region` (string): Filter by region (partial match)
- `limit` (number): Results per page (default: 50)
- `offset` (number): Pagination offset (default: 0)

**Example:**
```bash
curl http://localhost:9000/api/mills?mill_type=organic&region=Tamil
```

### Get Mill by ID

```
GET /api/mills/:id
```

### Get Mill by Slug

```
GET /api/mills/slug/:slug
```

### Get Fabric Lineages

```
GET /api/mills/:id/lineages
```

Returns all fabric batches processed by this mill with traceability info.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "fabric_batch_id": "BATCH-2025-001",
      "mill_name": "Coimbatore Organic Cotton Mill",
      "origin_location": "Coimbatore, Tamil Nadu",
      "harvest_date": "2025-01-15",
      "processing_steps": [
        {"step": "harvesting", "date": "2025-01-15"},
        {"step": "ginning", "date": "2025-01-20"}
      ],
      "certifications": {
        "GOTS": true,
        "Fair Trade": true
      }
    }
  ],
  "total": 5
}
```

### Create Mill

```
POST /api/mills
```

**Body:**
```json
{
  "name": "Ethical Weavers Co-op",
  "slug": "ethical-weavers-coop",
  "location": "Bhuj, Gujarat",
  "region": "Gujarat",
  "mill_type": "handloom",
  "description": "Community-owned weaving cooperative",
  "certifications": {
    "Fair Trade": true,
    "GOTS": true
  },
  "capacity_per_month": 5000,
  "established_year": 1995,
  "contact_info": {
    "email": "info@ethicalweavers.com",
    "phone": "+91-xxx-xxx-xxxx"
  },
  "health_score": 95
}
```

### Update Mill

```
PATCH /api/mills/:id
```

### Delete Mill

```
DELETE /api/mills/:id
```

---

## Drops API

Manage limited edition drop collections.

### List Drop Collections

```
GET /api/drops
```

**Query Parameters:**
- `visibility` (string): Filter by visibility (draft, preview, live, archived)
- `upcoming` (boolean): Show only upcoming drops
- `active` (boolean): Show only currently active drops
- `limit` (number): Results per page (default: 20)
- `offset` (number): Pagination offset (default: 0)

**Example:**
```bash
curl http://localhost:9000/api/drops?visibility=live&upcoming=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Summer Handloom Collection",
      "slug": "summer-handloom-2025",
      "description": "Lightweight handwoven textiles",
      "theme": "Tropical Paradise",
      "drop_date": "2025-06-01T00:00:00Z",
      "end_date": "2025-06-15T23:59:59Z",
      "visibility": "live",
      "product_count": "12",
      "waitlist_count": "234"
    }
  ],
  "total": 1,
  "hasMore": false
}
```

### Get Drop by ID

```
GET /api/drops/:id
```

### Get Drop by Slug

```
GET /api/drops/slug/:slug
```

### Get Products in Drop

```
GET /api/drops/:id/products
```

Returns all products included in this drop with allocation info.

### Get Waitlist

```
GET /api/drops/:id/waitlist
```

**Query Parameters:**
- `status` (string): Filter by status (active, notified, converted, expired)
- `tier` (string): Filter by customer tier (explorer, artisan, curator, patron)
- `limit` (number): Results per page (default: 100)
- `offset` (number): Pagination offset (default: 0)

### Join Waitlist

```
POST /api/drops/:id/waitlist
```

**Body:**
```json
{
  "user_id": "user-uuid",
  "email": "customer@example.com",
  "tier": "curator"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "collection_id": "drop-uuid",
    "position": 235,
    "tier": "curator",
    "status": "active",
    "joined_at": "2025-10-29T..."
  },
  "message": "Successfully joined waitlist"
}
```

### Create Drop Collection

```
POST /api/drops
```

**Body:**
```json
{
  "name": "Winter Artisan Series",
  "slug": "winter-artisan-2025",
  "description": "Exclusive handcrafted winter collection",
  "theme": "Mountain Heritage",
  "story": "Inspired by Himalayan textile traditions...",
  "drop_date": "2025-11-01T00:00:00Z",
  "end_date": "2025-11-30T23:59:59Z",
  "visibility": "preview",
  "access_tiers": [
    {
      "tier": "patron",
      "early_access_hours": 48
    },
    {
      "tier": "curator",
      "early_access_hours": 24
    }
  ],
  "waitlist_opens_at": "2025-10-15T00:00:00Z",
  "max_waitlist_size": 1000
}
```

### Add Product to Drop

```
POST /api/drops/:id/products
```

**Body:**
```json
{
  "product_id": "product-uuid",
  "allocation": 50,
  "tier_allocation": {
    "patron": 15,
    "curator": 20,
    "artisan": 15
  }
}
```

### Update Drop

```
PATCH /api/drops/:id
```

### Delete Drop

```
DELETE /api/drops/:id
```

Soft delete (sets visibility to 'archived').

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Applies to**: All `/api/*` routes

When rate limit is exceeded:

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Development

### Project Structure

```
apps/api/
├── src/
│   ├── config/
│   │   ├── database.js      # PostgreSQL connection pool
│   │   └── env.js           # Environment configuration
│   ├── middleware/
│   │   ├── errorHandler.js  # Centralized error handling
│   │   └── validate.js      # Request validation
│   ├── services/
│   │   ├── artFormService.js
│   │   ├── artistService.js
│   │   ├── millService.js
│   │   └── dropService.js
│   ├── routes/
│   │   ├── artForms.js
│   │   ├── artists.js
│   │   ├── mills.js
│   │   └── drops.js
│   └── server.js            # Express app entry point
├── package.json
└── README.md
```

### Adding New Endpoints

1. **Create Service** in `src/services/`:
   ```javascript
   export const myService = {
     async getAll() { /* ... */ },
     async getById(id) { /* ... */ },
     async create(data) { /* ... */ },
     async update(id, data) { /* ... */ },
     async delete(id) { /* ... */ }
   }
   ```

2. **Create Routes** in `src/routes/`:
   ```javascript
   import { Router } from 'express'
   import { myService } from '../services/myService.js'
   import { asyncHandler } from '../middleware/errorHandler.js'

   const router = Router()

   router.get('/', asyncHandler(async (req, res) => {
     const data = await myService.getAll()
     res.json({ success: true, data })
   }))

   export default router
   ```

3. **Mount Routes** in `src/server.js`:
   ```javascript
   import myRouter from './routes/my.js'
   app.use('/api/my', myRouter)
   ```

### Testing

Test endpoints with curl:

```bash
# Health check
curl http://localhost:9000/health

# Get all art forms
curl http://localhost:9000/api/art-forms

# Get specific artist
curl http://localhost:9000/api/artists/slug/kalyan-joshi

# Create new mill (JSON)
curl -X POST http://localhost:9000/api/mills \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Mill","slug":"test-mill","mill_type":"handloom"}'
```

---

## Production Deployment

### Environment Variables

Set production environment variables:

```bash
NODE_ENV=production
PORT=9000
DATABASE_URL=postgresql://user:pass@prod-host:5432/nati_commerce
CORS_ORIGINS=https://nati.com,https://admin.nati.com
```

### Process Management

Use PM2 or similar:

```bash
npm install -g pm2
pm2 start src/server.js --name nati-api
pm2 save
pm2 startup
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.nati.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## License

Private - NATI Commerce
