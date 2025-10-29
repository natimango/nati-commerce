# NATI Commerce - Quick Start Guide

Get up and running with NATI Commerce in 5 minutes!

## 🚀 Prerequisites

- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

## 📋 Setup Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd nati-commerce

# Install dependencies
npm install
```

### 2. Start Services

```bash
# Start PostgreSQL + Redis
docker compose up -d

# Verify services are running
docker compose ps
```

You should see:
- ✅ nati-postgres (PostgreSQL 16 + pgvector)
- ✅ nati-redis (Redis 7)
- ✅ nati-pgadmin (Database GUI)
- ✅ nati-redis-commander (Redis GUI)

### 3. Setup Database

```bash
cd packages/database

# Run migrations (creates all tables)
npm run migrate

# Load seed data (sample art forms, artists, mills)
npm run seed

# Verify everything works
npm run verify
```

### 4. Success! 🎉

If you see:
```
🎉 All tests passed! Database is properly configured.
```

You're ready to develop!

---

## 🔍 Access Your Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **PostgreSQL** | localhost:5432 | User: `nati_user`<br>Password: `nati_password` |
| **PgAdmin** | http://localhost:5050 | Email: `admin@nati.com`<br>Password: `admin` |
| **Redis** | localhost:6379 | (no auth) |
| **Redis Commander** | http://localhost:8081 | (no auth) |

---

## 🧪 Verify Your Setup

### Option 1: Run Verification Script

```bash
cd packages/database
npm run verify
```

This checks:
- ✅ All extensions installed (uuid-ossp, vector, pg_trgm)
- ✅ All 40+ tables created
- ✅ 100+ indexes created
- ✅ HNSW vector indexes working
- ✅ Triggers configured
- ✅ Seed data loaded

### Option 2: Manual Check via PgAdmin

1. Open http://localhost:5050
2. Login with credentials above
3. Right-click → Create → Server
4. Configure:
   - **General Tab**: Name = `NATI Commerce`
   - **Connection Tab**:
     - Host: `postgres` (container name)
     - Port: `5432`
     - Database: `nati_commerce`
     - Username: `nati_user`
     - Password: `nati_password`
5. Click Save
6. Explore: Servers → NATI Commerce → Databases → nati_commerce → Schemas → public → Tables

You should see tables like:
- `cultural_art_forms`
- `cultural_artists`
- `drops_collections`
- `ai_product_embeddings`
- `events_user_events`
- And many more!

### Option 3: Connect via psql

```bash
docker exec -it nati-postgres psql -U nati_user -d nati_commerce
```

```sql
-- Check tables
\dt

-- View art forms
SELECT name, region FROM cultural_art_forms;

-- View artists
SELECT name, location FROM cultural_artists;

-- Exit
\q
```

---

## 📦 What's Included

### Database Schema

- **Cultural Schema**: Art forms, artists, mills, fabric lineage
- **Product Extensions**: Cultural metadata, artist credits
- **Drop System**: Limited edition collections, waitlists
- **AI Schema**: Vector embeddings (768-dim), analytics, recommendations
- **Events**: User tracking with monthly partitioning
- **CRM**: Customer profiles, loyalty (NATI Circle), communications
- **Warehouse**: ETL staging for BigQuery

### Seed Data

- **6 Art Forms**: Kalamkari, Ikat, Gond, Block Printing, Madhubani, Warli
- **8 Artists**: With real bios, locations, specializations
- **5 Mills**: Certified suppliers for supply chain transparency
- **21 Event Types**: Predefined tracking events

---

## 🛠️ Common Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose stop

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Reset database (⚠️ deletes all data)
docker compose down -v
docker compose up -d
cd packages/database
npm run migrate
npm run seed
```

---

## 🔄 Next Steps

Now that your database is set up, you can:

### 1. **Build Backend API** (Medusa.js)
```bash
cd apps/backend
npm install
npm run dev
```

### 2. **Build Frontend** (Next.js)
```bash
cd apps/storefront
npm install
npm run dev
```

### 3. **Build AI Gateway** (FastAPI)
```bash
cd services/ai-gateway
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. **Explore the Architecture**
- Read [NATI_ARCHITECTURE_V1.2_CONSOLIDATED.md](./NATI_ARCHITECTURE_V1.2_CONSOLIDATED.md)
- Check [DATABASE_TESTING.md](./DATABASE_TESTING.md) for detailed testing

---

## 🆘 Troubleshooting

### Docker not running?
```bash
# Start Docker Desktop, then:
docker compose up -d
```

### Port 5432 already in use?
Another PostgreSQL is running. Either:
- Stop the other instance
- Change port in `docker-compose.yml` (line 13): `"5433:5432"`

### Migration errors?
```bash
# Reset and try again
docker compose down -v
docker compose up -d
cd packages/database
npm run migrate
```

### Can't connect to database?
```bash
# Check if container is running
docker compose ps

# Check logs
docker compose logs postgres

# Test connection
docker exec -it nati-postgres pg_isready -U nati_user
```

---

## 📚 Resources

- **Main README**: [README.md](./README.md)
- **Database Testing**: [DATABASE_TESTING.md](./DATABASE_TESTING.md)
- **Architecture**: [NATI_ARCHITECTURE_V1.2_CONSOLIDATED.md](./NATI_ARCHITECTURE_V1.2_CONSOLIDATED.md)
- **Package Structure**: Check `/packages/` directory

---

## ✅ Success Checklist

Before moving forward, ensure:

- [ ] Docker services running (`docker compose ps`)
- [ ] Migrations completed (`npm run migrate`)
- [ ] Seed data loaded (`npm run seed`)
- [ ] Verification passed (`npm run verify`)
- [ ] Can access PgAdmin at http://localhost:5050
- [ ] Can see tables in database

---

**Ready to build! 🚀**

Questions? Check [DATABASE_TESTING.md](./DATABASE_TESTING.md) for detailed guides.
