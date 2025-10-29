// Art Forms
export * from './art-form'

// Artists
export * from './artist'

// Products
export * from './product'

// Drops
export * from './drop'

// Common utility types
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
