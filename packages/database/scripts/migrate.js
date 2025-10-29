#!/usr/bin/env node

/**
 * Database Migration Runner
 * Runs all pending SQL migrations in order
 */

const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
require('dotenv').config()

const MIGRATIONS_DIR = path.join(__dirname, '../migrations')

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://nati_user:nati_password@localhost:5432/nati_commerce',
  })

  try {
    await client.connect()
    console.log('✓ Connected to database')

    // Create migrations tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    // Get list of executed migrations
    const { rows: executedMigrations } = await client.query(
      'SELECT migration_name FROM schema_migrations ORDER BY id'
    )
    const executedSet = new Set(executedMigrations.map((row) => row.migration_name))

    // Get all migration files
    const migrationFiles = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort()

    let migrationsRun = 0

    for (const file of migrationFiles) {
      if (executedSet.has(file)) {
        console.log(`⊘ Skipping ${file} (already executed)`)
        continue
      }

      console.log(`→ Running migration: ${file}`)
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8')

      try {
        await client.query('BEGIN')
        await client.query(sql)
        await client.query('INSERT INTO schema_migrations (migration_name) VALUES ($1)', [file])
        await client.query('COMMIT')
        console.log(`✓ Completed ${file}`)
        migrationsRun++
      } catch (error) {
        await client.query('ROLLBACK')
        console.error(`✗ Failed to run ${file}:`, error.message)
        throw error
      }
    }

    console.log(`\n✓ Migration complete! ${migrationsRun} migrations executed.`)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigrations()
