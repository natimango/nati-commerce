import { z } from 'zod'

/**
 * Art Form Types
 */
export interface ArtForm {
  id: string
  name: string
  slug: string
  region: string
  history?: string | null
  technique_description?: string | null
  cultural_significance?: string | null
  thumbnail_url?: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export const ArtFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  region: z.string().min(1).max(255),
  history: z.string().nullable().optional(),
  technique_description: z.string().nullable().optional(),
  cultural_significance: z.string().nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  is_active: z.boolean().default(true),
  created_at: z.date(),
  updated_at: z.date(),
})

export const CreateArtFormSchema = ArtFormSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export type CreateArtFormInput = z.infer<typeof CreateArtFormSchema>
