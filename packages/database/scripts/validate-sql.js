#!/usr/bin/env node

/**
 * SQL Migration Validator
 * Checks SQL files for common syntax errors and issues
 */

const fs = require('fs')
const path = require('path')

const MIGRATIONS_DIR = path.join(__dirname, '../migrations')

class SQLValidator {
  constructor() {
    this.errors = []
    this.warnings = []
    this.info = []
  }

  error(file, message) {
    this.errors.push({ file, message })
  }

  warning(file, message) {
    this.warnings.push({ file, message })
  }

  log(message) {
    this.info.push(message)
  }

  validateMigration(filename, content) {
    this.log(`Validating ${filename}...`)

    // Check 1: File should not be empty
    if (!content.trim()) {
      this.error(filename, 'File is empty')
      return
    }

    // Check 2: Check for common SQL keywords
    const hasCreate = /CREATE\s+(TABLE|INDEX|TRIGGER|FUNCTION)/i.test(content)
    if (!hasCreate) {
      this.warning(filename, 'No CREATE statements found')
    }

    // Check 3: Check for balanced parentheses
    const openParens = (content.match(/\(/g) || []).length
    const closeParens = (content.match(/\)/g) || []).length
    if (openParens !== closeParens) {
      this.error(filename, `Unbalanced parentheses: ${openParens} open, ${closeParens} close`)
    }

    // Check 4: Check for proper statement terminators
    const statements = content.split(';').filter((s) => s.trim())
    this.log(`  Found ${statements.length} SQL statements`)

    // Check 5: Check for common typos
    const commonTypos = [
      { pattern: /INTERGER/i, correct: 'INTEGER' },
      { pattern: /VARCAHR/i, correct: 'VARCHAR' },
      { pattern: /TIMESTAMPZ/i, correct: 'TIMESTAMPTZ' },
      { pattern: /BOOLEN/i, correct: 'BOOLEAN' },
    ]

    commonTypos.forEach(({ pattern, correct }) => {
      if (pattern.test(content)) {
        this.error(filename, `Possible typo: found pattern similar to ${correct}`)
      }
    })

    // Check 6: Check for table creation patterns
    const createTableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(/gi
    const tables = []
    let match
    while ((match = createTableRegex.exec(content)) !== null) {
      tables.push(match[1])
    }
    this.log(`  Defines ${tables.length} table(s): ${tables.join(', ')}`)

    // Check 7: Check for index creation
    const indexRegex = /CREATE\s+(?:UNIQUE\s+)?INDEX\s+(\w+)/gi
    const indexes = []
    while ((match = indexRegex.exec(content)) !== null) {
      indexes.push(match[1])
    }
    if (indexes.length > 0) {
      this.log(`  Creates ${indexes.length} index(es)`)
    }

    // Check 8: Check for REFERENCES (foreign keys)
    const referencesCount = (content.match(/REFERENCES\s+\w+/gi) || []).length
    if (referencesCount > 0) {
      this.log(`  Contains ${referencesCount} foreign key reference(s)`)
    }

    // Check 9: Check for vector columns (pgvector)
    if (/vector\(\d+\)/i.test(content)) {
      this.log(`  ✓ Contains vector columns (pgvector)`)
    }

    // Check 10: Check for JSONB columns
    const jsonbCount = (content.match(/\s+JSONB\s+/gi) || []).length
    if (jsonbCount > 0) {
      this.log(`  Contains ${jsonbCount} JSONB column(s)`)
    }

    // Check 11: Check for triggers
    if (/CREATE\s+TRIGGER/i.test(content)) {
      this.log(`  ✓ Contains trigger definitions`)
    }

    // Check 12: Check for comments
    if (/COMMENT\s+ON/i.test(content)) {
      this.log(`  ✓ Contains table/column comments`)
    }

    // Check 13: Check for common constraint types
    if (/PRIMARY\s+KEY/i.test(content)) {
      this.log(`  ✓ Defines primary keys`)
    }
    if (/UNIQUE\s*\(/i.test(content)) {
      this.log(`  ✓ Defines unique constraints`)
    }
    if (/CHECK\s*\(/i.test(content)) {
      this.log(`  ✓ Defines check constraints`)
    }

    // Check 14: Check for DEFAULT values
    const defaultCount = (content.match(/DEFAULT\s+/gi) || []).length
    if (defaultCount > 0) {
      this.log(`  Contains ${defaultCount} DEFAULT value(s)`)
    }

    // Check 15: Check for partition syntax
    if (/PARTITION\s+BY/i.test(content)) {
      this.log(`  ✓ Contains table partitioning`)
    }

    // Check 16: Validate table references in foreign keys
    const foreignKeyRefs = content.match(/REFERENCES\s+(\w+)\s*\(/gi)
    if (foreignKeyRefs) {
      const referencedTables = foreignKeyRefs.map((ref) =>
        ref.match(/REFERENCES\s+(\w+)/i)[1]
      )
      this.log(`  References tables: ${[...new Set(referencedTables)].join(', ')}`)
    }

    // Check 17: Check for NOT NULL constraints
    const notNullCount = (content.match(/NOT\s+NULL/gi) || []).length
    if (notNullCount > 0) {
      this.log(`  Contains ${notNullCount} NOT NULL constraint(s)`)
    }

    console.log('')
  }

  printSummary() {
    console.log('='.repeat(70))
    console.log('SQL VALIDATION SUMMARY')
    console.log('='.repeat(70))

    if (this.info.length > 0) {
      console.log('\nINFORMATION:')
      this.info.forEach((msg) => console.log(`  ℹ ${msg}`))
    }

    if (this.warnings.length > 0) {
      console.log('\nWARNINGS:')
      this.warnings.forEach(({ file, message }) => {
        console.log(`  ⚠ ${file}: ${message}`)
      })
    }

    if (this.errors.length > 0) {
      console.log('\nERRORS:')
      this.errors.forEach(({ file, message }) => {
        console.log(`  ✗ ${file}: ${message}`)
      })
    }

    console.log('\n' + '='.repeat(70))
    console.log(`Total Errors:   ${this.errors.length}`)
    console.log(`Total Warnings: ${this.warnings.length}`)
    console.log('='.repeat(70))

    if (this.errors.length === 0) {
      console.log('\n✅ All SQL migrations passed validation!')
      return 0
    } else {
      console.log('\n❌ SQL validation failed. Please fix the errors above.')
      return 1
    }
  }
}

async function validate() {
  console.log('🔍 Validating SQL Migrations\n')

  const validator = new SQLValidator()

  try {
    // Get all migration files
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort()

    if (files.length === 0) {
      console.error('No migration files found!')
      process.exit(1)
    }

    console.log(`Found ${files.length} migration file(s)\n`)

    // Validate each migration
    files.forEach((file) => {
      const content = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8')
      validator.validateMigration(file, content)
    })

    // Print summary
    const exitCode = validator.printSummary()
    process.exit(exitCode)
  } catch (error) {
    console.error('Validation failed:', error.message)
    process.exit(1)
  }
}

validate()
