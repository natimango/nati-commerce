import { z } from 'zod'

/**
 * Product Cultural Metadata Types
 */
export interface ProductCulturalMetadata {
  id: string
  product_id: string
  story_title?: string | null
  story_content?: string | null
  inspiration?: string | null
  art_form_id?: string | null
  technique_used?: string | null
  pattern_name?: string | null
  fabric_type?: string | null
  fabric_lineage_id?: string | null
  material_composition?: Record<string, number> | null
  sustainability_score?: number | null
  certifications?: string[] | null
  carbon_footprint_kg?: number | null
  production_method?: 'handloom' | 'hand_painted' | 'block_print' | 'screen_print' | 'mixed' | null
  time_to_produce_hours?: number | null
  artisan_count?: number | null
  is_limited_edition: boolean
  edition_size?: number | null
  edition_number?: number | null
  drop_id?: string | null
  created_at: Date
  updated_at: Date
}

export const ProductCulturalMetadataSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  story_title: z.string().max(255).nullable().optional(),
  story_content: z.string().nullable().optional(),
  inspiration: z.string().nullable().optional(),
  art_form_id: z.string().uuid().nullable().optional(),
  technique_used: z.string().max(255).nullable().optional(),
  pattern_name: z.string().max(255).nullable().optional(),
  fabric_type: z.string().max(255).nullable().optional(),
  fabric_lineage_id: z.string().uuid().nullable().optional(),
  material_composition: z.record(z.number()).nullable().optional(),
  sustainability_score: z.number().min(0).max(100).nullable().optional(),
  certifications: z.array(z.string()).nullable().optional(),
  carbon_footprint_kg: z.number().nonnegative().nullable().optional(),
  production_method: z.enum(['handloom', 'hand_painted', 'block_print', 'screen_print', 'mixed']).nullable().optional(),
  time_to_produce_hours: z.number().nonnegative().nullable().optional(),
  artisan_count: z.number().int().positive().nullable().optional(),
  is_limited_edition: z.boolean().default(false),
  edition_size: z.number().int().positive().nullable().optional(),
  edition_number: z.number().int().positive().nullable().optional(),
  drop_id: z.string().uuid().nullable().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})

/**
 * Artist Credit Types
 */
export interface ArtistCredit {
  id: string
  product_id: string
  artist_id: string
  role: 'designer' | 'weaver' | 'painter' | 'embroiderer' | 'collaborator'
  contribution_percentage: number
  display_order: number
  is_featured: boolean
  created_at: Date
  updated_at: Date
}

export const ArtistCreditSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  artist_id: z.string().uuid(),
  role: z.enum(['designer', 'weaver', 'painter', 'embroiderer', 'collaborator']),
  contribution_percentage: z.number().min(0).max(100),
  display_order: z.number().int().nonnegative().default(0),
  is_featured: z.boolean().default(false),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface ProductWithCulturalData {
  id: string
  title: string
  description?: string
  thumbnail?: string
  handle: string
  cultural_metadata?: ProductCulturalMetadata
  artist_credits?: (ArtistCredit & { artist?: any })[]
}
