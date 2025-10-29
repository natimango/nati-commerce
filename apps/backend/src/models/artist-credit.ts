import { model } from '@medusajs/framework/utils'

/**
 * Artist Credit Model
 * Links artists to products with contribution details
 */
export const ArtistCredit = model.define('artist_credit', {
  id: model.id().primaryKey(),
  product_id: model.text(),
  artist_id: model.text(),

  // Contribution details
  role: model.enum(['designer', 'weaver', 'painter', 'embroiderer', 'collaborator']),
  contribution_percentage: model.number(), // For revenue sharing

  // Display
  display_order: model.number().default(0),
  is_featured: model.boolean().default(false),

  created_at: model.dateTime().default('now'),
  updated_at: model.dateTime().default('now'),
})

// Composite unique constraint: product_id + artist_id + role
export default ArtistCredit
