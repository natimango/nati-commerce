import { model } from '@medusajs/framework/utils'

/**
 * Product Cultural Metadata
 * Extends Medusa Product with cultural storytelling data
 */
export const ProductCulturalMetadata = model.define('product_cultural_metadata', {
  id: model.id().primaryKey(),
  product_id: model.text(), // FK to Medusa product

  // Cultural story
  story_title: model.text().nullable(),
  story_content: model.text().nullable(),
  inspiration: model.text().nullable(),

  // Art classification
  art_form_id: model.text().nullable(),
  technique_used: model.text().nullable(),
  pattern_name: model.text().nullable(),

  // Fabric & materials
  fabric_type: model.text().nullable(),
  fabric_lineage_id: model.text().nullable(),
  material_composition: model.json().nullable(), // {cotton: 60, silk: 40}

  // Sustainability
  sustainability_score: model.number().nullable(),
  certifications: model.json().nullable(), // ['GOTS', 'Fair Trade']
  carbon_footprint_kg: model.float().nullable(),

  // Production
  production_method: model.enum(['handloom', 'hand_painted', 'block_print', 'screen_print', 'mixed']).nullable(),
  time_to_produce_hours: model.number().nullable(),
  artisan_count: model.number().nullable(),

  // Limited edition
  is_limited_edition: model.boolean().default(false),
  edition_size: model.number().nullable(),
  edition_number: model.number().nullable(),

  // Drop association
  drop_id: model.text().nullable(),

  created_at: model.dateTime().default('now'),
  updated_at: model.dateTime().default('now'),
})

export default ProductCulturalMetadata
