import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://nati_user:nati_password@localhost:5432/nati_commerce',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test connection
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected database error:', err)
  process.exit(-1)
})

export default pool
