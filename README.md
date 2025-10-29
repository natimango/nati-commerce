# NATI Commerce

**AI-native D2C e-commerce platform for Indian folk art revival**

## 🎨 About NATI

NATI (Native Art Textile India) is more than an e-commerce platform—it's a cultural technology platform designed to revive Indian folk art traditions through AI-powered storytelling, artist collaboration, and transparent supply chains.

### Key Features
- 🎭 **Art-First Product Model** - Products as carriers of cultural stories
- 🚀 **Drop-Based Releases** - Limited edition collections with scarcity + storytelling
- 👨‍🎨 **Artist Collaboration** - Credit tracking, commission splits, follower system
- 🔍 **Supply Chain Transparency** - Fabric lineage from mill to garment
- 🤖 **AI-Powered Personalization** - Gemini-based recommendations, chat, vision
- 💎 **NATI Circle** - Loyalty program with tier-based benefits
- 📊 **Event-Driven Analytics** - Complete user journey tracking

## 🏗️ Architecture

This project uses **v1.2 Consolidated Architecture** (Gemini Brain):
- **6-8 services** (lean approach)
- **PostgreSQL + pgvector** as single source of truth
- **Gemini AI** with provider gateway for flexibility
- **Cost**: ₹40-90k/month
- **Timeline**: 6-8 weeks to MVP

See [NATI_ARCHITECTURE_V1.2_CONSOLIDATED.md](./NATI_ARCHITECTURE_V1.2_CONSOLIDATED.md) for complete details.

## 📦 Monorepo Structure

```
nati-commerce/
├── apps/
│   ├── storefront/        # Next.js 15 customer-facing store
│   └── admin/             # Medusa Admin dashboard
├── packages/
│   ├── ui/                # Shared React components
│   ├── config/            # Shared configuration (TS, ESLint, etc.)
│   ├── types/             # Shared TypeScript types
│   └── database/          # Database schemas & migrations
├── services/
│   ├── ai-gateway/        # FastAPI AI provider router
│   └── event-router/      # Google Pub/Sub event processor
└── database/
    ├── init/              # PostgreSQL initialization scripts
    └── migrations/        # Database migration files
```

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router + RSC)
- TypeScript + Tailwind CSS
- tRPC (type-safe APIs)
- Vercel (hosting)

### Backend
- Medusa.js 2.0 (e-commerce core)
- PostgreSQL 16 + pgvector
- Redis 7 (cache + queue)
- FastAPI (AI Gateway)

### AI
- Google Gemini 2.0 Flash
- Gemini Vision (image analysis)
- pgvector (HNSW indexing)

### Infrastructure
- Google Cloud Platform
- Docker & Docker Compose
- Turborepo (monorepo)

## 🚀 Quick Start

**📖 See [QUICKSTART.md](./QUICKSTART.md) for the complete 5-minute setup guide!**

### TL;DR

```bash
# 1. Install and start services
npm install
docker compose up -d

# 2. Setup database
cd packages/database
npm run migrate
npm run seed
npm run verify

# 3. Start development
cd ../..
npm run dev
```

### Detailed Guides

- **Quick Setup**: [QUICKSTART.md](./QUICKSTART.md) - Get running in 5 minutes
- **Database Testing**: [DATABASE_TESTING.md](./DATABASE_TESTING.md) - Complete testing guide
- **Architecture**: [NATI_ARCHITECTURE_V1.2_CONSOLIDATED.md](./NATI_ARCHITECTURE_V1.2_CONSOLIDATED.md)

Access points:
- **Storefront**: http://localhost:3000
- **Medusa API**: http://localhost:9000
- **Medusa Admin**: http://localhost:7001
- **AI Gateway**: http://localhost:8000
- **PgAdmin**: http://localhost:5050
- **Redis Commander**: http://localhost:8081

## 📚 Development Workflow

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add drop countdown timer
fix: resolve cart persistence issue
docs: update API documentation
```

### Code Formatting

```bash
# Format all files
npm run format

# Check formatting
npm run format:check

# Lint
npm run lint
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Building

```bash
# Build all packages
npm run build
```

## 📊 Database Management

### PgAdmin Access
- URL: http://localhost:5050
- Email: admin@nati.com
- Password: admin

### Redis Commander Access
- URL: http://localhost:8081

### Connection Details
- **PostgreSQL**: localhost:5432
- **Database**: nati_commerce
- **User**: nati_user
- **Password**: nati_password

## 🗂️ Database Schema

The database is organized into logical namespaces:

- `core_*` - Products, orders, users, inventory
- `cultural_*` - Art forms, artists, fabric lineage
- `drops_*` - Drop collections, waitlists
- `ai_*` - Embeddings, recommendations, predictions
- `events_*` - User events, tracking
- `crm_*` - Customer profiles, communications
- `warehouse_staging_*` - ETL buffer

## 🔐 Environment Variables

Key environment variables needed:

```bash
# Database
DATABASE_URL=postgresql://nati_user:nati_password@localhost:5432/nati_commerce
REDIS_URL=redis://localhost:6379

# AI
GEMINI_API_KEY=your-gemini-api-key

# Payments
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# CMS
SANITY_PROJECT_ID=your-sanity-project-id
```

See [.env.example](./.env.example) for complete list.

## 📈 Roadmap

### Phase 0: Setup ✅ (Current)
- [x] Monorepo structure
- [x] Docker Compose
- [x] Configuration files
- [ ] Database migrations
- [ ] Medusa.js setup

### Phase 1: Backend (Weeks 2-3)
- [ ] Medusa.js with custom models
- [ ] Database schema implementation
- [ ] Core API endpoints

### Phase 2: Events & AI (Weeks 3-4)
- [ ] Event Router (Pub/Sub)
- [ ] AI Gateway (FastAPI)
- [ ] Provider routing

### Phase 3: Drop System (Week 5)
- [ ] Drop collections
- [ ] Waitlist system
- [ ] Real-time countdown

### Phase 4: Frontend (Weeks 6-7)
- [ ] Next.js storefront
- [ ] Product pages
- [ ] Cart & checkout

### Phase 5: AI Features (Week 8)
- [ ] Product embeddings
- [ ] Recommendations
- [ ] AI chatbot

### Phase 6-10: See [NATI_ARCHITECTURE_V1.2_CONSOLIDATED.md](./NATI_ARCHITECTURE_V1.2_CONSOLIDATED.md)

## 🤝 Contributing

### Branch Naming
- `feat/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/update-name` - Documentation
- `refactor/component-name` - Refactoring

### Pull Request Process
1. Create a feature branch
2. Make changes with conventional commits
3. Run tests and linting
4. Submit PR with description

## 📝 License

UNLICENSED - Proprietary software for NATI Commerce

## 📞 Support

For questions or issues, please contact the NATI development team.

---

**Built with ❤️ for Indian folk art revival**
