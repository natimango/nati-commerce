import pool from '../config/database.js'

export const artFormService = {
  // Get all art forms
  async getAll(filters = {}) {
    const { is_active, region, limit = 50, offset = 0 } = filters

    let query = 'SELECT * FROM cultural_art_forms WHERE 1=1'
    const params = []
    let paramCount = 1

    if (is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`
      params.push(is_active)
      paramCount++
    }

    if (region) {
      query += ` AND region ILIKE $${paramCount}`
      params.push(`%${region}%`)
      paramCount++
    }

    query += ` ORDER BY name LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, offset)

    const result = await pool.query(query, params)

    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM cultural_art_forms WHERE 1=1' +
      (is_active !== undefined ? ' AND is_active = $1' : '') +
      (region ? ` AND region ILIKE $${is_active !== undefined ? 2 : 1}` : '')

    const countParams = []
    if (is_active !== undefined) countParams.push(is_active)
    if (region) countParams.push(`%${region}%`)

    const countResult = await pool.query(countQuery, countParams)

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset,
    }
  },

  // Get art form by ID
  async getById(id) {
    const result = await pool.query(
      'SELECT * FROM cultural_art_forms WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      const error = new Error('Art form not found')
      error.statusCode = 404
      throw error
    }

    return result.rows[0]
  },

  // Get art form by slug
  async getBySlug(slug) {
    const result = await pool.query(
      'SELECT * FROM cultural_art_forms WHERE slug = $1',
      [slug]
    )

    if (result.rows.length === 0) {
      const error = new Error('Art form not found')
      error.statusCode = 404
      throw error
    }

    return result.rows[0]
  },

  // Create new art form
  async create(data) {
    const {
      name,
      slug,
      region,
      history,
      technique_description,
      cultural_significance,
      thumbnail_url,
      is_active = true,
    } = data

    const result = await pool.query(
      `INSERT INTO cultural_art_forms (
        name, slug, region, history, technique_description,
        cultural_significance, thumbnail_url, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [name, slug, region, history, technique_description, cultural_significance, thumbnail_url, is_active]
    )

    return result.rows[0]
  },

  // Update art form
  async update(id, data) {
    const {
      name,
      slug,
      region,
      history,
      technique_description,
      cultural_significance,
      thumbnail_url,
      is_active,
    } = data

    const result = await pool.query(
      `UPDATE cultural_art_forms SET
        name = COALESCE($2, name),
        slug = COALESCE($3, slug),
        region = COALESCE($4, region),
        history = COALESCE($5, history),
        technique_description = COALESCE($6, technique_description),
        cultural_significance = COALESCE($7, cultural_significance),
        thumbnail_url = COALESCE($8, thumbnail_url),
        is_active = COALESCE($9, is_active),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [id, name, slug, region, history, technique_description, cultural_significance, thumbnail_url, is_active]
    )

    if (result.rows.length === 0) {
      const error = new Error('Art form not found')
      error.statusCode = 404
      throw error
    }

    return result.rows[0]
  },

  // Delete art form
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM cultural_art_forms WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      const error = new Error('Art form not found')
      error.statusCode = 404
      throw error
    }

    return result.rows[0]
  },

  // Get artists for an art form
  async getArtists(id) {
    const result = await pool.query(
      `SELECT a.* FROM cultural_artists a
       WHERE a.art_form_id = $1 AND a.is_active = true
       ORDER BY a.name`,
      [id]
    )

    return result.rows
  },
}
