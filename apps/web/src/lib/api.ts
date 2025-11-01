import axios from 'axios'
import type { Product, ProductListParams, ProductListResponse, ArtForm, Artist } from '@/types/product'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Products
export async function getProducts(params?: ProductListParams): Promise<ProductListResponse> {
  const response = await api.get('/api/products', { params })
  return response.data
}

export async function getProduct(slugOrId: string): Promise<Product> {
  const response = await api.get(`/api/products/${slugOrId}`)
  return response.data
}

export async function getProductsByArtForm(artFormSlug: string, params?: ProductListParams): Promise<ProductListResponse> {
  const response = await api.get(`/api/art-forms/${artFormSlug}/products`, { params })
  return response.data
}

export async function getProductsByArtist(artistSlug: string, params?: ProductListParams): Promise<ProductListResponse> {
  const response = await api.get(`/api/artists/${artistSlug}/products`, { params })
  return response.data
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const response = await api.get('/api/products/featured', { params: { limit } })
  return response.data
}

// Art Forms
export async function getArtForms(): Promise<ArtForm[]> {
  const response = await api.get('/api/art-forms')
  return response.data.data || response.data
}

export async function getArtForm(slug: string): Promise<ArtForm> {
  const response = await api.get(`/api/art-forms/${slug}`)
  return response.data.data || response.data
}

// Artists
export async function getArtists(): Promise<Artist[]> {
  const response = await api.get('/api/artists')
  return response.data.data || response.data
}

export async function getArtist(slug: string): Promise<Artist> {
  const response = await api.get(`/api/artists/${slug}`)
  return response.data.data || response.data
}

// Search
export async function searchProducts(query: string, params?: ProductListParams): Promise<ProductListResponse> {
  const response = await api.get('/api/products/search', { params: { q: query, ...params } })
  return response.data
}
