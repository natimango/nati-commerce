import { model } from '@medusajs/framework/utils'

/**
 * Drop Collection Model
 * Represents limited-time product releases
 */
export const DropCollection = model.define('drop_collection', {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text(),

  // Story & theme
  theme: model.text(),
  story: model.text().nullable(),
  hero_image_url: model.text().nullable(),
  teaser_video_url: model.text().nullable(),

  // Timing
  announcement_at: model.dateTime(),
  launch_at: model.dateTime(),
  ends_at: model.dateTime().nullable(),

  // Status
  status: model.enum(['upcoming', 'live', 'ended', 'cancelled']).default('upcoming'),

  // Waitlist
  waitlist_enabled: model.boolean().default(true),
  pre_access_hours: model.number().default(24),

  // Metrics
  total_products: model.number().default(0),
  total_inventory: model.number().default(0),
  waitlist_count: model.number().default(0),
  conversion_rate: model.float().nullable(),
  sell_out_time_minutes: model.number().nullable(),

  created_at: model.dateTime().default('now'),
  updated_at: model.dateTime().default('now'),
})

export default DropCollection
