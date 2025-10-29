#!/usr/bin/env node

/**
 * Database Setup Verification Script
 * Tests that all tables, indexes, and extensions are properly created
 */

const { Client } = require('pg')
require('dotenv').config()

const tests = {
  passed: 0,
  failed: 0,
  warnings: 0,
}

async function verify() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://nati_user:nati_password@localhost:5432/nati_commerce',
  })

  try {
    await client.connect()
    console.log('✓ Database connection successful\n')

    // Test 1: Check required extensions
    console.log('=== Testing Extensions ===')
    const extensions = await client.query(`
      SELECT extname FROM pg_extension
      WHERE extname IN ('uuid-ossp', 'vector', 'pg_trgm')
    `)

    const requiredExtensions = ['uuid-ossp', 'vector', 'pg_trgm']
    const installedExtensions = extensions.rows.map((row) => row.extname)

    for (const ext of requiredExtensions) {
      if (installedExtensions.includes(ext)) {
        console.log(`  ✓ Extension '${ext}' is installed`)
        tests.passed++
      } else {
        console.log(`  ✗ Extension '${ext}' is MISSING`)
        tests.failed++
      }
    }

    // Test 2: Check all tables exist
    console.log('\n=== Testing Tables ===')
    const expectedTables = [
      // Cultural
      'cultural_art_forms',
      'cultural_artists',
      'cultural_mills',
      'cultural_fabric_lineages',
      'cultural_artist_follows',
      'cultural_product_metadata',
      'cultural_artist_credits',
      // Drops
      'drops_collections',
      'drops_waitlist',
      'drops_products',
      // AI
      'ai_product_embeddings',
      'ai_product_analytics',
      'ai_usage_log',
      'ai_recommendations_cache',
      // Events
      'events_user_events',
      'events_types',
      'events_sessions',
      // CRM
      'crm_customer_profiles',
      'crm_nati_circle',
      'crm_points_transactions',
      'crm_communications',
      'crm_segments',
      'crm_segment_members',
      // Warehouse
      'warehouse_staging_products',
      'warehouse_staging_orders',
      'warehouse_staging_customers',
      'warehouse_staging_events',
      'warehouse_etl_jobs',
    ]

    const tables = await client.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `)

    const existingTables = tables.rows.map((row) => row.tablename)

    for (const table of expectedTables) {
      if (existingTables.includes(table)) {
        console.log(`  ✓ Table '${table}' exists`)
        tests.passed++
      } else {
        console.log(`  ✗ Table '${table}' is MISSING`)
        tests.failed++
      }
    }

    // Test 3: Check indexes
    console.log('\n=== Testing Indexes ===')
    const indexes = await client.query(`
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND indexname LIKE 'idx_%'
      ORDER BY tablename, indexname
    `)

    console.log(`  ✓ Found ${indexes.rows.length} custom indexes`)
    tests.passed++

    // Test 4: Check HNSW vector indexes
    console.log('\n=== Testing Vector Indexes ===')
    const vectorIndexes = await client.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE indexdef LIKE '%hnsw%'
    `)

    if (vectorIndexes.rows.length >= 3) {
      console.log(`  ✓ Found ${vectorIndexes.rows.length} HNSW vector indexes`)
      vectorIndexes.rows.forEach((row) => {
        console.log(`    - ${row.indexname}`)
      })
      tests.passed++
    } else {
      console.log(`  ⚠ Expected 3 HNSW indexes, found ${vectorIndexes.rows.length}`)
      tests.warnings++
    }

    // Test 5: Check triggers
    console.log('\n=== Testing Triggers ===')
    const triggers = await client.query(`
      SELECT
        tgname as trigger_name,
        tgrelid::regclass as table_name
      FROM pg_trigger
      WHERE tgname LIKE 'update_%_updated_at'
      ORDER BY tgname
    `)

    console.log(`  ✓ Found ${triggers.rows.length} updated_at triggers`)
    if (triggers.rows.length >= 10) {
      tests.passed++
    } else {
      console.log(`  ⚠ Expected at least 10 triggers, found ${triggers.rows.length}`)
      tests.warnings++
    }

    // Test 6: Check partitions (for events table)
    console.log('\n=== Testing Table Partitions ===')
    const partitions = await client.query(`
      SELECT
        parent.relname as parent_table,
        child.relname as partition_name
      FROM pg_inherits
      JOIN pg_class parent ON pg_inherits.inhparent = parent.oid
      JOIN pg_class child ON pg_inherits.inhrelid = child.oid
      WHERE parent.relname = 'events_user_events'
      ORDER BY child.relname
    `)

    if (partitions.rows.length >= 3) {
      console.log(`  ✓ Found ${partitions.rows.length} partitions for events_user_events`)
      partitions.rows.forEach((row) => {
        console.log(`    - ${row.partition_name}`)
      })
      tests.passed++
    } else {
      console.log(`  ⚠ Expected at least 3 partitions, found ${partitions.rows.length}`)
      tests.warnings++
    }

    // Test 7: Check seed data
    console.log('\n=== Testing Seed Data ===')

    const artForms = await client.query('SELECT COUNT(*) FROM cultural_art_forms')
    console.log(`  ✓ Art forms: ${artForms.rows[0].count} records`)
    if (parseInt(artForms.rows[0].count) >= 6) tests.passed++
    else tests.warnings++

    const artists = await client.query('SELECT COUNT(*) FROM cultural_artists')
    console.log(`  ✓ Artists: ${artists.rows[0].count} records`)
    if (parseInt(artists.rows[0].count) >= 8) tests.passed++
    else tests.warnings++

    const mills = await client.query('SELECT COUNT(*) FROM cultural_mills')
    console.log(`  ✓ Mills: ${mills.rows[0].count} records`)
    if (parseInt(mills.rows[0].count) >= 5) tests.passed++
    else tests.warnings++

    const eventTypes = await client.query('SELECT COUNT(*) FROM events_types')
    console.log(`  ✓ Event types: ${eventTypes.rows[0].count} records`)
    if (parseInt(eventTypes.rows[0].count) >= 21) tests.passed++
    else tests.warnings++

    // Test 8: Check vector dimensions
    console.log('\n=== Testing Vector Embeddings Schema ===')
    const vectorColumns = await client.query(`
      SELECT
        column_name,
        data_type,
        udt_name
      FROM information_schema.columns
      WHERE table_name = 'ai_product_embeddings'
      AND column_name LIKE '%embedding'
    `)

    if (vectorColumns.rows.length === 3) {
      console.log(`  ✓ Found 3 embedding columns (text, visual, combined)`)
      tests.passed++
    } else {
      console.log(`  ✗ Expected 3 embedding columns, found ${vectorColumns.rows.length}`)
      tests.failed++
    }

    // Test 9: Check foreign key constraints
    console.log('\n=== Testing Foreign Key Constraints ===')
    const constraints = await client.query(`
      SELECT COUNT(*)
      FROM information_schema.table_constraints
      WHERE constraint_type = 'FOREIGN KEY'
      AND table_schema = 'public'
    `)

    console.log(`  ✓ Found ${constraints.rows[0].count} foreign key constraints`)
    if (parseInt(constraints.rows[0].count) >= 15) {
      tests.passed++
    } else {
      console.log(`  ⚠ Expected at least 15 foreign keys`)
      tests.warnings++
    }

    // Test 10: Check JSONB columns
    console.log('\n=== Testing JSONB Columns ===')
    const jsonbColumns = await client.query(`
      SELECT
        table_name,
        column_name
      FROM information_schema.columns
      WHERE data_type = 'jsonb'
      AND table_schema = 'public'
      ORDER BY table_name, column_name
    `)

    console.log(`  ✓ Found ${jsonbColumns.rows.length} JSONB columns`)
    if (jsonbColumns.rows.length >= 10) {
      tests.passed++
    } else {
      tests.warnings++
    }

    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('TEST SUMMARY')
    console.log('='.repeat(50))
    console.log(`✓ Passed:   ${tests.passed}`)
    console.log(`⚠ Warnings: ${tests.warnings}`)
    console.log(`✗ Failed:   ${tests.failed}`)
    console.log('='.repeat(50))

    if (tests.failed === 0 && tests.warnings === 0) {
      console.log('\n🎉 All tests passed! Database is properly configured.')
      process.exit(0)
    } else if (tests.failed === 0) {
      console.log('\n⚠️  All critical tests passed, but there are warnings.')
      process.exit(0)
    } else {
      console.log('\n❌ Some tests failed. Please check the errors above.')
      process.exit(1)
    }
  } catch (error) {
    console.error('\n❌ Verification failed:', error.message)
    console.error(error.stack)
    process.exit(1)
  } finally {
    await client.end()
  }
}

verify()
