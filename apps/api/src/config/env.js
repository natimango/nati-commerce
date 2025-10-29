import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 9000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://nati_user:nati_password@localhost:5432/nati_commerce',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}
