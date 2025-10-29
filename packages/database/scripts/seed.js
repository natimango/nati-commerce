#!/usr/bin/env node

/**
 * Database Seed Runner
 * Loads seed data for development
 */

const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
require('dotenv').config()

const SEEDS_DIR = path.join(__dirname, '../seeds')

async function runSeeds() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://nati_user:nati_password@localhost:5432/nati_commerce',
  })

  try {
    await client.connect()
    console.log('✓ Connected to database')

    // Get all seed files
    const seedFiles = fs
      .readdirSync(SEEDS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort()

    for (const file of seedFiles) {
      console.log(`→ Running seed: ${file}`)
      const sql = fs.readFileSync(path.join(SEEDS_DIR, file), 'utf8')

      try {
        await client.query(sql)
        console.log(`✓ Completed ${file}`)
      } catch (error) {
        console.error(`✗ Failed to run ${file}:`, error.message)
        // Continue with other seeds even if one fails (idempotent inserts)
      }
    }

    console.log('\n✓ Seeding complete!')
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runSeeds()
