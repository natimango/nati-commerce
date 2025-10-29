import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { config } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import artFormsRouter from './routes/artForms.js'
import artistsRouter from './routes/artists.js'
import millsRouter from './routes/mills.js'
import dropsRouter from './routes/drops.js'

const app = express()

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1)

// Security middleware
app.use(helmet())
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// Compression
app.use(compression())

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  })
})

// API routes
app.use('/api/art-forms', artFormsRouter)
app.use('/api/artists', artistsRouter)
app.use('/api/mills', millsRouter)
app.use('/api/drops', dropsRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
const server = app.listen(config.port, () => {
  console.log(`
🚀 NATI Commerce API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Environment: ${config.nodeEnv}
Port:        ${config.port}
Database:    ${config.databaseUrl.split('@')[1] || 'connected'}
CORS:        ${config.corsOrigins.join(', ')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API Endpoints:
  GET  /health

  Art Forms:
    GET    /api/art-forms
    GET    /api/art-forms/:id
    GET    /api/art-forms/slug/:slug
    GET    /api/art-forms/:id/artists
    POST   /api/art-forms
    PATCH  /api/art-forms/:id
    DELETE /api/art-forms/:id

  Artists:
    GET    /api/artists
    GET    /api/artists/:id
    GET    /api/artists/slug/:slug
    GET    /api/artists/:id/credits
    POST   /api/artists
    POST   /api/artists/:id/follow
    POST   /api/artists/:id/unfollow
    PATCH  /api/artists/:id
    DELETE /api/artists/:id

  Mills:
    GET    /api/mills
    GET    /api/mills/:id
    GET    /api/mills/slug/:slug
    GET    /api/mills/:id/lineages
    POST   /api/mills
    PATCH  /api/mills/:id
    DELETE /api/mills/:id

  Drops:
    GET    /api/drops
    GET    /api/drops/:id
    GET    /api/drops/slug/:slug
    GET    /api/drops/:id/products
    GET    /api/drops/:id/waitlist
    POST   /api/drops
    POST   /api/drops/:id/products
    POST   /api/drops/:id/waitlist
    PATCH  /api/drops/:id
    DELETE /api/drops/:id

Ready to accept requests!
  `)
})

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Closing server gracefully...`)
  server.close(() => {
    console.log('Server closed.')
    process.exit(0)
  })

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout.')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

export default app
