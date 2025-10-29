import { z } from 'zod'

/**
 * Artist Types
 */
export interface Artist {
  id: string
  name: string
  slug: string
  bio?: string | null
  location?: string | null
  profile_image_url?: string | null
  art_form_id?: string | null
  instagram_handle?: string | null
  website_url?: string | null
  follower_count: number
  total_products: number
  total_earnings: number
  is_verified: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export const ArtistSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  bio: z.string().nullable().optional(),
  location: z.string().max(255).nullable().optional(),
  profile_image_url: z.string().url().nullable().optional(),
  art_form_id: z.string().uuid().nullable().optional(),
  instagram_handle: z.string().max(255).nullable().optional(),
  website_url: z.string().url().nullable().optional(),
  follower_count: z.number().int().nonnegative().default(0),
  total_products: z.number().int().nonnegative().default(0),
  total_earnings: z.number().nonnegative().default(0),
  is_verified: z.boolean().default(false),
  is_active: z.boolean().default(true),
  created_at: z.date(),
  updated_at: z.date(),
})

export const CreateArtistSchema = ArtistSchema.omit({
  id: true,
  follower_count: true,
  total_products: true,
  total_earnings: true,
  created_at: true,
  updated_at: true,
})

export type CreateArtistInput = z.infer<typeof CreateArtistSchema>

export interface ArtistWithProducts extends Artist {
  products?: any[]
  art_form?: {
    id: string
    name: string
  }
}
