# Database Package

This package contains all database schemas, migrations, and seed data for NATI Commerce.

## Structure

```
database/
├── migrations/       # SQL migration files (numbered)
├── seeds/           # Seed data for development
├── scripts/         # Migration and seed scripts
└── README.md
```

## Running Migrations

```bash
# Run all pending migrations
npm run migrate

# Create a new migration
npm run migrate:create my_migration_name

# Seed the database
npm run seed

# Reset database (drop all and recreate)
npm run reset
```

## Migration Naming Convention

Migrations are numbered sequentially:
- `001_initial_schema.sql`
- `002_add_cultural_metadata.sql`
- etc.

## Schema Namespaces

Our database uses logical namespaces via table prefixes:

- `core_*` - E-commerce core (products, orders, users)
- `cultural_*` - Art forms, artists, fabric lineage
- `drops_*` - Drop collections and waitlists
- `ai_*` - Embeddings, predictions, analytics
- `events_*` - User event tracking
- `crm_*` - Customer profiles and communications
- `warehouse_staging_*` - ETL buffer for BigQuery
