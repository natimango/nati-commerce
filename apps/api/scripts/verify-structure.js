#!/usr/bin/env node

/**
 * API Structure Verification Script
 * Checks that all API files are present and properly structured
 */

import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const apiDir = join(__dirname, '..')

console.log('🔍 NATI Commerce API Structure Verification\n')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

let passed = 0
let failed = 0

const checkFile = (path, description) => {
  const fullPath = join(apiDir, path)
  const exists = existsSync(fullPath)
  if (exists) {
    console.log(`✓ ${description}`)
    passed++
  } else {
    console.log(`✗ ${description} - MISSING: ${path}`)
    failed++
  }
  return exists
}

console.log('Configuration Files:')
checkFile('.env.example', 'Environment template')
checkFile('package.json', 'Package configuration')
checkFile('README.md', 'API documentation')
checkFile('API_TESTING_GUIDE.md', 'Testing guide')

console.log('\nCore Files:')
checkFile('src/server.js', 'Express server')

console.log('\nConfiguration:')
checkFile('src/config/database.js', 'Database connection pool')
checkFile('src/config/env.js', 'Environment configuration')

console.log('\nMiddleware:')
checkFile('src/middleware/errorHandler.js', 'Error handling middleware')
checkFile('src/middleware/validate.js', 'Validation middleware')

console.log('\nServices:')
checkFile('src/services/artFormService.js', 'Art forms service')
checkFile('src/services/artistService.js', 'Artists service')
checkFile('src/services/millService.js', 'Mills service')
checkFile('src/services/dropService.js', 'Drops service')

console.log('\nRoutes:')
checkFile('src/routes/artForms.js', 'Art forms routes')
checkFile('src/routes/artists.js', 'Artists routes')
checkFile('src/routes/mills.js', 'Mills routes')
checkFile('src/routes/drops.js', 'Drops routes')

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log(`Results: ${passed} passed, ${failed} failed\n`)

// Now let's try to import the modules to check for syntax errors
console.log('Checking module imports...\n')

try {
  console.log('→ Importing database config...')
  await import('../src/config/database.js')
  console.log('  ✓ Database config')

  console.log('→ Importing env config...')
  await import('../src/config/env.js')
  console.log('  ✓ Environment config')

  console.log('→ Importing error handler...')
  await import('../src/middleware/errorHandler.js')
  console.log('  ✓ Error handler middleware')

  console.log('→ Importing validation middleware...')
  await import('../src/middleware/validate.js')
  console.log('  ✓ Validation middleware')

  console.log('→ Importing art form service...')
  await import('../src/services/artFormService.js')
  console.log('  ✓ Art form service')

  console.log('→ Importing artist service...')
  await import('../src/services/artistService.js')
  console.log('  ✓ Artist service')

  console.log('→ Importing mill service...')
  await import('../src/services/millService.js')
  console.log('  ✓ Mill service')

  console.log('→ Importing drop service...')
  await import('../src/services/dropService.js')
  console.log('  ✓ Drop service')

  console.log('→ Importing art forms routes...')
  await import('../src/routes/artForms.js')
  console.log('  ✓ Art forms routes')

  console.log('→ Importing artists routes...')
  await import('../src/routes/artists.js')
  console.log('  ✓ Artists routes')

  console.log('→ Importing mills routes...')
  await import('../src/routes/mills.js')
  console.log('  ✓ Mills routes')

  console.log('→ Importing drops routes...')
  await import('../src/routes/drops.js')
  console.log('  ✓ Drops routes')

  console.log('\n✅ All modules imported successfully!')
  console.log('✅ No syntax errors detected!')

} catch (error) {
  console.error('\n❌ Import error:', error.message)
  console.error('\nStack trace:')
  console.error(error.stack)
  process.exit(1)
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('\n✅ API structure verification complete!')
console.log('\n📋 To test the API locally:')
console.log('   1. Ensure Docker is running: docker compose up -d')
console.log('   2. Migrate database: cd packages/database && npm run migrate && npm run seed')
console.log('   3. Start API server: cd apps/api && npm run dev')
console.log('   4. Test endpoints: curl http://localhost:9000/health\n')
