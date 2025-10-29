export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors,
    })
  }

  // Database errors
  if (err.code) {
    // Unique constraint violation
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Resource already exists',
        detail: err.detail,
      })
    }

    // Foreign key violation
    if (err.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'Referenced resource not found',
        detail: err.detail,
      })
    }
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  })
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
