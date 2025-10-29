import pool from '../config/database.js'

export const millService = {
  /**
   * Get all mills with optional filtering and pagination
   */
  async getAll(filters = {}) {
    const { is_active, mill_type, region, limit = 50, offset = 0 } = filters

    let query = `
      SELECT
        id,
        name,
        slug,
        location,
        region,
        country,
        mill_type,
        description,
        certifications,
        capacity_per_month,
        established_year,
        contact_info,
        is_active,
        health_score,
        created_at,
        updated_at
      FROM cultural_mills
      WHERE 1=1
    `
    const params = []
    let paramCount = 1

    if (is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`
      params.push(is_active)
      paramCount++
    }

    if (mill_type) {
      query += ` AND mill_type = $${paramCount}`
      params.push(mill_type)
      paramCount++
    }

    if (region) {
      query += ` AND region ILIKE $${paramCount}`
      params.push(`%${region}%`)
      paramCount++
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`
    const countResult = await pool.query(countQuery, params)
    const total = parseInt(countResult.rows[0].total)

    // Add ordering and pagination
    query += ` ORDER BY name ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, offset)

    const result = await pool.query(query, params)

    return {
      data: result.rows,
      total,
      limit,
      offset,
      hasMore: offset + result.rows.length < total,
    }
  },

  /**
   * Get mill by ID
   */
  async getById(id) {
    const query = `
      SELECT
        id,
        name,
        slug,
        location,
        region,
        country,
        mill_type,
        description,
        certifications,
        capacity_per_month,
        established_year,
        contact_info,
        is_active,
        health_score,
        created_at,
        updated_at
      FROM cultural_mills
      WHERE id = $1
    `

    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      throw new Error('Mill not found')
    }

    return result.rows[0]
  },

  /**
   * Get mill by slug
   */
  async getBySlug(slug) {
    const query = `
      SELECT
        id,
        name,
        slug,
        location,
        region,
        country,
        mill_type,
        description,
        certifications,
        capacity_per_month,
        established_year,
        contact_info,
        is_active,
        health_score,
        created_at,
        updated_at
      FROM cultural_mills
      WHERE slug = $1
    `

    const result = await pool.query(query, [slug])

    if (result.rows.length === 0) {
      throw new Error('Mill not found')
    }

    return result.rows[0]
  },

  /**
   * Get fabric lineages for a mill
   */
  async getFabricLineages(millId) {
    const query = `
      SELECT
        fl.id,
        fl.fabric_batch_id,
        fl.mill_id,
        fl.origin_location,
        fl.harvest_date,
        fl.processing_steps,
        fl.certifications,
        fl.sustainability_metrics,
        fl.created_at,
        m.name as mill_name,
        m.mill_type
      FROM cultural_fabric_lineages fl
      JOIN cultural_mills m ON fl.mill_id = m.id
      WHERE fl.mill_id = $1
      ORDER BY fl.harvest_date DESC
    `

    const result = await pool.query(query, [millId])
    return result.rows
  },

  /**
   * Create new mill
   */
  async create(data) {
    const {
      name,
      slug,
      location,
      region,
      country = 'India',
      mill_type,
      description,
      certifications,
      capacity_per_month,
      established_year,
      contact_info,
      is_active = true,
      health_score = 100,
    } = data

    const query = `
      INSERT INTO cultural_mills (
        name,
        slug,
        location,
        region,
        country,
        mill_type,
        description,
        certifications,
        capacity_per_month,
        established_year,
        contact_info,
        is_active,
        health_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `

    const result = await pool.query(query, [
      name,
      slug,
      location,
      region,
      country,
      mill_type,
      description,
      certifications || {},
      capacity_per_month,
      established_year,
      contact_info || {},
      is_active,
      health_score,
    ])

    return result.rows[0]
  },

  /**
   * Update mill
   */
  async update(id, data) {
    // First check if mill exists
    await this.getById(id)

    const allowedFields = [
      'name',
      'slug',
      'location',
      'region',
      'country',
      'mill_type',
      'description',
      'certifications',
      'capacity_per_month',
      'established_year',
      'contact_info',
      'is_active',
      'health_score',
    ]

    const updates = []
    const values = []
    let paramCount = 1

    Object.keys(data).forEach((key) => {
      if (allowedFields.includes(key) && data[key] !== undefined) {
        updates.push(`${key} = $${paramCount}`)
        values.push(data[key])
        paramCount++
      }
    })

    if (updates.length === 0) {
      throw new Error('No valid fields to update')
    }

    values.push(id)
    const query = `
      UPDATE cultural_mills
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await pool.query(query, values)
    return result.rows[0]
  },

  /**
   * Delete mill (soft delete by setting is_active = false)
   */
  async delete(id) {
    // First check if mill exists
    await this.getById(id)

    const query = `
      UPDATE cultural_mills
      SET is_active = false
      WHERE id = $1
      RETURNING id
    `

    await pool.query(query, [id])
    return { id, deleted: true }
  },
}
