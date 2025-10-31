// Product Types
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price?: number
  images: string[]
  thumbnail: string

  // Inventory
  in_stock: boolean
  stock_quantity: number

  // Variants
  variants?: ProductVariant[]

  // Cultural metadata
  artist_name?: string
  artist_id?: string
  art_form?: string
  art_form_id?: string
  fabric_type?: string
  production_method?: 'handloom' | 'hand_painted' | 'block_print' | 'screen_print' | 'mixed'

  // Story
  story_title?: string
  story_content?: string
  inspiration?: string

  // Sustainability
  sustainability_score?: number
  certifications?: string[]

  // Limited edition
  is_limited_edition: boolean
  edition_size?: number
  edition_number?: number

  // Drop
  drop_id?: string
  drop_name?: string

  // Metadata
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  title: string // e.g., "Medium / Blue"
  price: number
  sku?: string

  // Options
  size?: string
  color?: string

  // Inventory
  in_stock: boolean
  stock_quantity: number

  created_at: string
  updated_at: string
}

export interface ProductListParams {
  page?: number
  limit?: number
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
  art_form?: string
  artist?: string
  price_min?: number
  price_max?: number
  in_stock?: boolean
  is_limited_edition?: boolean
}

export interface ProductListResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

// Art Form Type
export interface ArtForm {
  id: string
  name: string
  slug: string
  region: string
  history?: string
  technique_description?: string
  cultural_significance?: string
  thumbnail_url?: string
  is_active: boolean
}

// Artist Type
export interface Artist {
  id: string
  name: string
  slug: string
  bio?: string
  location?: string
  profile_image_url?: string
  art_form_id?: string
  art_form_name?: string
  instagram_handle?: string
  website_url?: string
  is_active: boolean
}
