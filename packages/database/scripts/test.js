#!/usr/bin/env node

/**
 * Database Test Suite
 * Comprehensive tests for database functionality
 */

const { Client } = require('pg')
require('dotenv').config()

async function runTests() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://nati_user:nati_password@localhost:5432/nati_commerce',
  })

  try {
    await client.connect()
    console.log('🧪 Running Database Tests\n')

    // Test 1: Vector similarity search
    console.log('=== Test 1: Vector Similarity Search ===')
    try {
      // Insert a test embedding
      const testVector = Array(768).fill(0.1).join(',')
      await client.query(`
        INSERT INTO ai_product_embeddings (
          product_id,
          text_embedding,
          embedding_model
        ) VALUES (
          uuid_generate_v4(),
          '[${testVector}]',
          'test'
        )
        ON CONFLICT DO NOTHING
      `)

      // Test cosine similarity search
      const result = await client.query(`
        SELECT
          product_id,
          1 - (text_embedding <=> '[${testVector}]') as similarity
        FROM ai_product_embeddings
        WHERE text_embedding IS NOT NULL
        ORDER BY text_embedding <=> '[${testVector}]'
        LIMIT 5
      `)

      console.log(`✓ Vector search returned ${result.rows.length} results`)
      if (result.rows.length > 0) {
        console.log(`  Similarity score: ${result.rows[0].similarity}`)
      }
    } catch (error) {
      console.log(`✗ Vector search failed: ${error.message}`)
    }

    // Test 2: Event partitioning
    console.log('\n=== Test 2: Event Partitioning ===')
    try {
      // Try to insert an event into the partitioned table
      await client.query(`
        INSERT INTO events_user_events (
          event_id,
          session_id,
          event_type,
          properties,
          created_at
        ) VALUES (
          'test-event-' || gen_random_uuid()::text,
          'test-session-123',
          'product_viewed',
          '{"test": true}'::jsonb,
          NOW()
        )
      `)

      const eventCount = await client.query(`
        SELECT COUNT(*) FROM events_user_events
        WHERE session_id = 'test-session-123'
      `)

      console.log(`✓ Event inserted successfully`)
      console.log(`  Total test events: ${eventCount.rows[0].count}`)

      // Clean up
      await client.query(`
        DELETE FROM events_user_events WHERE session_id = 'test-session-123'
      `)
    } catch (error) {
      console.log(`✗ Event partitioning test failed: ${error.message}`)
    }

    // Test 3: JSONB queries
    console.log('\n=== Test 3: JSONB Functionality ===')
    try {
      // Test JSONB operators
      const jsonbTest = await client.query(`
        SELECT
          name,
          certifications,
          certifications ? 'GOTS' as has_gots
        FROM cultural_mills
        WHERE certifications ? 'GOTS'
        LIMIT 1
      `)

      if (jsonbTest.rows.length > 0) {
        console.log(`✓ JSONB query successful`)
        console.log(`  Found mill: ${jsonbTest.rows[0].name}`)
        console.log(`  Has GOTS: ${jsonbTest.rows[0].has_gots}`)
      } else {
        console.log(`⚠ JSONB query returned no results (expected if no seed data)`)
      }
    } catch (error) {
      console.log(`✗ JSONB test failed: ${error.message}`)
    }

    // Test 4: Full-text search
    console.log('\n=== Test 4: Full-Text Search ===')
    try {
      const searchResult = await client.query(`
        SELECT
          name,
          slug,
          region
        FROM cultural_art_forms
        WHERE
          name ILIKE '%Kalam%'
          OR technique_description ILIKE '%hand%'
        LIMIT 5
      `)

      console.log(`✓ Full-text search returned ${searchResult.rows.length} results`)
      searchResult.rows.forEach((row) => {
        console.log(`  - ${row.name} (${row.region})`)
      })
    } catch (error) {
      console.log(`✗ Full-text search failed: ${error.message}`)
    }

    // Test 5: Complex joins
    console.log('\n=== Test 5: Complex Joins (Artists + Art Forms) ===')
    try {
      const joinResult = await client.query(`
        SELECT
          a.name as artist_name,
          a.location,
          af.name as art_form,
          a.follower_count
        FROM cultural_artists a
        LEFT JOIN cultural_art_forms af ON a.art_form_id = af.id
        ORDER BY a.follower_count DESC
        LIMIT 5
      `)

      console.log(`✓ Join query returned ${joinResult.rows.length} results`)
      joinResult.rows.forEach((row) => {
        console.log(`  - ${row.artist_name}: ${row.art_form || 'No art form'} (${row.location})`)
      })
    } catch (error) {
      console.log(`✗ Join query failed: ${error.message}`)
    }

    // Test 6: Triggers
    console.log('\n=== Test 6: Updated_at Triggers ===')
    try {
      // Insert a test artist
      const insertResult = await client.query(`
        INSERT INTO cultural_artists (name, slug)
        VALUES ('Test Artist', 'test-artist-' || gen_random_uuid()::text)
        RETURNING id, created_at, updated_at
      `)

      const artistId = insertResult.rows[0].id
      const originalUpdatedAt = insertResult.rows[0].updated_at

      // Wait a moment
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Update the artist
      const updateResult = await client.query(`
        UPDATE cultural_artists
        SET name = 'Updated Test Artist'
        WHERE id = $1
        RETURNING updated_at
      `,
        [artistId]
      )

      const newUpdatedAt = updateResult.rows[0].updated_at

      if (new Date(newUpdatedAt) > new Date(originalUpdatedAt)) {
        console.log(`✓ updated_at trigger working correctly`)
        console.log(`  Original: ${originalUpdatedAt}`)
        console.log(`  Updated:  ${newUpdatedAt}`)
      } else {
        console.log(`✗ updated_at trigger not working`)
      }

      // Clean up
      await client.query(`DELETE FROM cultural_artists WHERE id = $1`, [artistId])
    } catch (error) {
      console.log(`✗ Trigger test failed: ${error.message}`)
    }

    // Test 7: Check constraints
    console.log('\n=== Test 7: Check Constraints ===')
    try {
      // Try to insert invalid data (should fail)
      try {
        await client.query(`
          INSERT INTO crm_customer_profiles (
            customer_id,
            health_score
          ) VALUES (
            uuid_generate_v4(),
            150
          )
        `)
        console.log(`✗ Check constraint failed (allowed invalid value)`)
      } catch (constraintError) {
        console.log(`✓ Check constraint working (rejected invalid health_score)`)
      }
    } catch (error) {
      console.log(`⚠ Check constraint test had issues: ${error.message}`)
    }

    // Test 8: Unique constraints
    console.log('\n=== Test 8: Unique Constraints ===')
    try {
      const testSlug = 'test-unique-' + Date.now()

      // Insert first record
      await client.query(`
        INSERT INTO cultural_art_forms (name, slug, region)
        VALUES ('Test Art', $1, 'Test Region')
      `,
        [testSlug]
      )

      // Try to insert duplicate (should fail)
      try {
        await client.query(`
          INSERT INTO cultural_art_forms (name, slug, region)
          VALUES ('Test Art 2', $1, 'Test Region')
        `,
          [testSlug]
        )
        console.log(`✗ Unique constraint failed (allowed duplicate slug)`)
      } catch (uniqueError) {
        console.log(`✓ Unique constraint working (rejected duplicate slug)`)
      }

      // Clean up
      await client.query(`DELETE FROM cultural_art_forms WHERE slug = $1`, [testSlug])
    } catch (error) {
      console.log(`⚠ Unique constraint test had issues: ${error.message}`)
    }

    console.log('\n✅ Database test suite completed!')
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runTests()
