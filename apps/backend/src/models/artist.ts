import { model } from '@medusajs/framework/utils'

/**
 * Artist Model
 * Represents artists collaborating with NATI
 */
export const Artist = model.define('artist', {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text(),
  bio: model.text().nullable(),
  location: model.text().nullable(),
  profile_image_url: model.text().nullable(),
  art_form_id: model.text().nullable(),

  // Social media
  instagram_handle: model.text().nullable(),
  website_url: model.text().nullable(),

  // Engagement metrics
  follower_count: model.bigNumber().default(0),
  total_products: model.number().default(0),
  total_earnings: model.bigNumber().default(0),

  // Status
  is_verified: model.boolean().default(false),
  is_active: model.boolean().default(true),

  created_at: model.dateTime().default('now'),
  updated_at: model.dateTime().default('now'),
})

export default Artist
