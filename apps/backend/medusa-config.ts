import { defineConfig } from '@medusajs/framework/utils'
import { Modules } from '@medusajs/framework/utils'

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:3000',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:7001',
      authCors: process.env.AUTH_CORS || 'http://localhost:3000,http://localhost:7001',
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
  },
  admin: {
    disable: process.env.DISABLE_ADMIN === 'true',
    backendUrl: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
  },
  modules: [
    {
      resolve: '@medusajs/cache-redis',
      options: {
        redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
        ttl: 30,
      },
    },
    {
      resolve: '@medusajs/event-bus-redis',
      options: {
        redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    },
  ],
})
