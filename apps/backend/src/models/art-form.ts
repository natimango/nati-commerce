import { model } from '@medusajs/framework/utils'

/**
 * Art Form Model
 * Represents Indian folk art traditions (Kalamkari, Ikat, Gond, etc.)
 */
export const ArtForm = model.define('art_form', {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text(),
  region: model.text(),
  history: model.text().nullable(),
  technique_description: model.text().nullable(),
  cultural_significance: model.text().nullable(),
  thumbnail_url: model.text().nullable(),
  is_active: model.boolean().default(true),
  created_at: model.dateTime().default('now'),
  updated_at: model.dateTime().default('now'),
})

export default ArtForm
