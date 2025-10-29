import pool from '../config/database.js'

export const artistService = {
  // Get all artists
  async getAll(filters = {}) {
    const { is_active, is_verified, art_form_id, limit = 50, offset = 0 } = filters

    let query = `
      SELECT a.*, af.name as art_form_name
      FROM cultural_artists a
      LEFT JOIN cultural_art_forms af ON a.art_form_id = af.id
      WHERE 1=1
    `
    const params = []
    let paramCount = 1

    if (is_active !== undefined) {
      query += ` AND a.is_active = $${paramCount}`
      params.push(is_active)
      paramCount++
    }

    if (is_verified !== undefined) {
      query += ` AND a.is_verified = $${paramCount}`
      params.push(is_verified)
      paramCount++
    }

    if (art_form_id) {
      query += ` AND a.art_form_id = $${paramCount}`
      params.push(art_form_id)
      paramCount++
    }

    query += ` ORDER BY a.follower_count DESC, a.name LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, offset)

    const result = await pool.query(query, params)

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM cultural_artists WHERE 1=1'
    const countParams = []
    let countParamNum = 1

    if (is_active !== undefined) {
      countQuery += ` AND is_active = $${countParamNum}`
      countParams.push(is_active)
      countParamNum++
    }

    if (is_verified !== undefined) {
      countQuery += ` AND is_verified = $${countParamNum}`
      countParams.push(is_verified)
      countParamNum++
    }

    if (art_form_id) {
      countQuery += ` AND art_form_id = $${countParamNum}`
      countParams.push(art_form_id)
    }

    const countResult = await pool.query(countQuery, countParams)

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset,
    }
  },

  // Get artist by ID
  async getById(id) {
    const result = await pool.query(
      `SELECT a.*, af.name as art_form_name, af.region as art_form_region
       FROM cultural_artists a
       LEFT JOIN cultural_art_forms af ON a.art_form_id = af.id
       WHERE a.id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      const error = new Error('Artist not found')
      error.statusCode = 404
      throw error
    }

    return result.rows[0]
  },

  // Get artist by slug
  async getBySlug(slug) {
    const result = await pool.query(
      `SELECT a.*, af.name as art_form_name, af.region as art_form_region
       FROM cultural_artists a
       LEFT JOIN cultural_art_forms af ON a.art_form_id = af.id
       WHERE a.slug = $1`,
      [slug]
    )

    if (result.rows.length === 0) {
      const error = new Error('Artist not found')
      error.statusCode = 404
      throw error
    }

    return result.rows[0]
  },

  // Create new artist
  async create(data) {
    const {
      name,
      slug,
      bio,
      location,
      profile_image_url,
      art_form_id,
      instagram_handle,
      website_url,
      is_verified = false,
      is_active = true,
    } = data

    const result = await pool.query(
      `INSERT INTO cultural_artists (
        name, slug, bio, location, profile_image_url, art_form_id,
        instagram_handle, website_url, is_verified, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [name, slug, bio, location, profile_image_url, art_form_id, instagram_handle, website_url, is_verified, is_active]
    )

    return result.rows[0]
  },

  // Update artist
  async update(id, data) {
    const {
      name,
      slug,
      bio,
      location,
      profile_image_url,
      art_form_id,
      instagram_handle,
      website_url,
      is_verified,
      is_active,
    } = data

    const result = await pool.query(
      `UPDATE cultural_artists SET
        name = COALESCE($2, name),
        slug = COALESCE($3, slug),
        bio = COALESCE($4, bio),
        location = COALESCE($5, location),
        profile_image_url = COALESCE($6, profile_image_url),
        art_form_id = COALESCE($7, art_form_id),
        instagram_handle = COALESCE($8, instagram_handle),
        website_url = COALESCE($9, website_url),
        is_verified = COALESCE($10, is_verified),
        is_active = COALESCE($11, is_active),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [id, name, slug, bio, location, profile_image_url, art_form_id, instagram_handle, website_url, is_verified, is_active]
    )

    if (result.rows.length === 0) {
      const error = new Error('Artist not found')
      error.statusCode = 404
      throw error
    }

    return result.rows[0]
  },

  // Delete artist
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM cultural_artists WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      const error = new Error('Artist not found')
      error.statusCode = 404
      throw error
    }

    return result.rows[0]
  },

  // Get artist's product credits
  async getProductCredits(id) {
    const result = await pool.query(
      `SELECT
        ac.*,
        COUNT(*) as total_products,
        SUM(ac.contribution_percentage) as total_contribution
       FROM cultural_artist_credits ac
       WHERE ac.artist_id = $1
       GROUP BY ac.id`,
      [id]
    )

    return result.rows
  },

  // Update follower count
  async updateFollowerCount(id, increment = 1) {
    const result = await pool.query(
      `UPDATE cultural_artists SET
        follower_count = follower_count + $2,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [id, increment]
    )

    if (result.rows.length === 0) {
      const error = new Error('Artist not found')
      error.statusCode = 404
      throw error
    }

    return result.rows[0]
  },
}
