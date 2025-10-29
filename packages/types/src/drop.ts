import { z } from 'zod'

/**
 * Drop Collection Types
 */
export type DropStatus = 'upcoming' | 'live' | 'ended' | 'cancelled'

export interface DropCollection {
  id: string
  name: string
  slug: string
  theme: string
  story?: string | null
  hero_image_url?: string | null
  teaser_video_url?: string | null
  announcement_at: Date
  launch_at: Date
  ends_at?: Date | null
  status: DropStatus
  waitlist_enabled: boolean
  pre_access_hours: number
  total_products: number
  total_inventory: number
  waitlist_count: number
  conversion_rate?: number | null
  sell_out_time_minutes?: number | null
  created_at: Date
  updated_at: Date
}

export const DropCollectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  theme: z.string().min(1),
  story: z.string().nullable().optional(),
  hero_image_url: z.string().url().nullable().optional(),
  teaser_video_url: z.string().url().nullable().optional(),
  announcement_at: z.date(),
  launch_at: z.date(),
  ends_at: z.date().nullable().optional(),
  status: z.enum(['upcoming', 'live', 'ended', 'cancelled']).default('upcoming'),
  waitlist_enabled: z.boolean().default(true),
  pre_access_hours: z.number().int().nonnegative().default(24),
  total_products: z.number().int().nonnegative().default(0),
  total_inventory: z.number().int().nonnegative().default(0),
  waitlist_count: z.number().int().nonnegative().default(0),
  conversion_rate: z.number().min(0).max(1).nullable().optional(),
  sell_out_time_minutes: z.number().nonnegative().nullable().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})

export const CreateDropCollectionSchema = DropCollectionSchema.omit({
  id: true,
  total_products: true,
  total_inventory: true,
  waitlist_count: true,
  conversion_rate: true,
  sell_out_time_minutes: true,
  created_at: true,
  updated_at: true,
})

export type CreateDropCollectionInput = z.infer<typeof CreateDropCollectionSchema>

export interface DropWithProducts extends DropCollection {
  products?: any[]
}
