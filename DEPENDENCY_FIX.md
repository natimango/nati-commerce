# Quick Fix for Dependency Conflict

The root `npm install` is failing due to Medusa.js version conflicts. Since we're just testing the database (which doesn't need Medusa), we can skip the root install and go directly to database testing.

## Continue with Database Testing

Run these commands instead:

```bash
# Skip root dependencies for now, go directly to database
cd packages/database

# Install only database dependencies
npm install

# Start Docker (make sure Docker Desktop is running first!)
cd ../..
docker compose up -d

# Wait for PostgreSQL to initialize (about 10 seconds)
sleep 10

# Go back to database package
cd packages/database

# Run migrations
npm run migrate

# Load seed data
npm run seed

# Verify setup
npm run verify

# Run tests
npm run test
```

This will test the database completely without needing the Medusa.js backend installed yet.

## If You Want to Fix the Full Install

Later, when we're ready to build the backend, we'll update the Medusa dependencies to use stable v1 instead of v2.
