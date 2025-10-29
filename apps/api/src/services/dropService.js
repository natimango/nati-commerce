import pool from '../config/database.js'

export const dropService = {
  /**
   * Get all drop collections with optional filtering and pagination
   */
  async getAll(filters = {}) {
    const { visibility, upcoming, active, limit = 20, offset = 0 } = filters

    let query = `
      SELECT
        dc.id,
        dc.name,
        dc.slug,
        dc.description,
        dc.theme,
        dc.story,
        dc.drop_date,
        dc.end_date,
        dc.access_tiers,
        dc.visibility,
        dc.banner_image_url,
        dc.teaser_video_url,
        dc.waitlist_opens_at,
        dc.max_waitlist_size,
        dc.created_at,
        dc.updated_at,
        COUNT(DISTINCT dp.id) as product_count,
        COUNT(DISTINCT dw.id) as waitlist_count
      FROM drops_collections dc
      LEFT JOIN drops_products dp ON dc.id = dp.collection_id
      LEFT JOIN drops_waitlist dw ON dc.id = dw.collection_id AND dw.status = 'active'
      WHERE 1=1
    `
    const params = []
    let paramCount = 1

    if (visibility) {
      query += ` AND dc.visibility = $${paramCount}`
      params.push(visibility)
      paramCount++
    }

    if (upcoming === 'true') {
      query += ` AND dc.drop_date > NOW()`
    }

    if (active === 'true') {
      query += ` AND dc.drop_date <= NOW() AND dc.end_date >= NOW()`
    }

    query += ` GROUP BY dc.id`

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`
    const countResult = await pool.query(countQuery, params)
    const total = parseInt(countResult.rows[0].total)

    // Add ordering and pagination
    query += ` ORDER BY dc.drop_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
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
   * Get drop collection by ID
   */
  async getById(id) {
    const query = `
      SELECT
        dc.id,
        dc.name,
        dc.slug,
        dc.description,
        dc.theme,
        dc.story,
        dc.drop_date,
        dc.end_date,
        dc.access_tiers,
        dc.visibility,
        dc.banner_image_url,
        dc.teaser_video_url,
        dc.waitlist_opens_at,
        dc.max_waitlist_size,
        dc.created_at,
        dc.updated_at,
        COUNT(DISTINCT dp.id) as product_count,
        COUNT(DISTINCT dw.id) as waitlist_count
      FROM drops_collections dc
      LEFT JOIN drops_products dp ON dc.id = dp.collection_id
      LEFT JOIN drops_waitlist dw ON dc.id = dw.collection_id AND dw.status = 'active'
      WHERE dc.id = $1
      GROUP BY dc.id
    `

    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      throw new Error('Drop collection not found')
    }

    return result.rows[0]
  },

  /**
   * Get drop collection by slug
   */
  async getBySlug(slug) {
    const query = `
      SELECT
        dc.id,
        dc.name,
        dc.slug,
        dc.description,
        dc.theme,
        dc.story,
        dc.drop_date,
        dc.end_date,
        dc.access_tiers,
        dc.visibility,
        dc.banner_image_url,
        dc.teaser_video_url,
        dc.waitlist_opens_at,
        dc.max_waitlist_size,
        dc.created_at,
        dc.updated_at,
        COUNT(DISTINCT dp.id) as product_count,
        COUNT(DISTINCT dw.id) as waitlist_count
      FROM drops_collections dc
      LEFT JOIN drops_products dp ON dc.id = dp.collection_id
      LEFT JOIN drops_waitlist dw ON dc.id = dw.collection_id AND dw.status = 'active'
      WHERE dc.slug = $1
      GROUP BY dc.id
    `

    const result = await pool.query(query, [slug])

    if (result.rows.length === 0) {
      throw new Error('Drop collection not found')
    }

    return result.rows[0]
  },

  /**
   * Get products in a drop collection
   */
  async getProducts(collectionId) {
    const query = `
      SELECT
        dp.id,
        dp.collection_id,
        dp.product_id,
        dp.allocation,
        dp.tier_allocation,
        dp.created_at
      FROM drops_products dp
      WHERE dp.collection_id = $1
      ORDER BY dp.created_at ASC
    `

    const result = await pool.query(query, [collectionId])
    return result.rows
  },

  /**
   * Get waitlist for a drop collection
   */
  async getWaitlist(collectionId, filters = {}) {
    const { status, tier, limit = 100, offset = 0 } = filters

    let query = `
      SELECT
        id,
        collection_id,
        user_id,
        email,
        tier,
        position,
        joined_at,
        notified_at,
        status
      FROM drops_waitlist
      WHERE collection_id = $1
    `
    const params = [collectionId]
    let paramCount = 2

    if (status) {
      query += ` AND status = $${paramCount}`
      params.push(status)
      paramCount++
    }

    if (tier) {
      query += ` AND tier = $${paramCount}`
      params.push(tier)
      paramCount++
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`
    const countResult = await pool.query(countQuery, params)
    const total = parseInt(countResult.rows[0].total)

    // Add ordering and pagination
    query += ` ORDER BY position ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, offset)

    const result = await pool.query(query, params)

    return {
      data: result.rows,
      total,
      limit,
      offset,
    }
  },

  /**
   * Join waitlist for a drop collection
   */
  async joinWaitlist(collectionId, data) {
    const { user_id, email, tier = 'explorer' } = data

    // Check if collection exists and waitlist is open
    const collection = await this.getById(collectionId)

    if (collection.visibility === 'draft') {
      throw new Error('This drop is not yet available for waitlist')
    }

    if (collection.waitlist_opens_at && new Date(collection.waitlist_opens_at) > new Date()) {
      throw new Error('Waitlist is not yet open')
    }

    // Check if user already joined
    const existingQuery = `
      SELECT id FROM drops_waitlist
      WHERE collection_id = $1 AND (user_id = $2 OR email = $3)
      AND status = 'active'
    `
    const existing = await pool.query(existingQuery, [collectionId, user_id, email])

    if (existing.rows.length > 0) {
      throw new Error('Already on waitlist for this drop')
    }

    // Get next position
    const positionQuery = `
      SELECT COALESCE(MAX(position), 0) + 1 as next_position
      FROM drops_waitlist
      WHERE collection_id = $1
    `
    const positionResult = await pool.query(positionQuery, [collectionId])
    const position = positionResult.rows[0].next_position

    // Check max waitlist size
    if (collection.max_waitlist_size && position > collection.max_waitlist_size) {
      throw new Error('Waitlist is full')
    }

    // Insert waitlist entry
    const insertQuery = `
      INSERT INTO drops_waitlist (
        collection_id,
        user_id,
        email,
        tier,
        position,
        status
      ) VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *
    `

    const result = await pool.query(insertQuery, [
      collectionId,
      user_id,
      email,
      tier,
      position,
    ])

    return result.rows[0]
  },

  /**
   * Create new drop collection
   */
  async create(data) {
    const {
      name,
      slug,
      description,
      theme,
      story,
      drop_date,
      end_date,
      access_tiers,
      visibility = 'draft',
      banner_image_url,
      teaser_video_url,
      waitlist_opens_at,
      max_waitlist_size,
    } = data

    const query = `
      INSERT INTO drops_collections (
        name,
        slug,
        description,
        theme,
        story,
        drop_date,
        end_date,
        access_tiers,
        visibility,
        banner_image_url,
        teaser_video_url,
        waitlist_opens_at,
        max_waitlist_size
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `

    const result = await pool.query(query, [
      name,
      slug,
      description,
      theme,
      story,
      drop_date,
      end_date,
      access_tiers || [],
      visibility,
      banner_image_url,
      teaser_video_url,
      waitlist_opens_at,
      max_waitlist_size,
    ])

    return result.rows[0]
  },

  /**
   * Add product to drop collection
   */
  async addProduct(collectionId, productData) {
    const { product_id, allocation, tier_allocation } = productData

    // Check if collection exists
    await this.getById(collectionId)

    const query = `
      INSERT INTO drops_products (
        collection_id,
        product_id,
        allocation,
        tier_allocation
      ) VALUES ($1, $2, $3, $4)
      RETURNING *
    `

    const result = await pool.query(query, [
      collectionId,
      product_id,
      allocation,
      tier_allocation || {},
    ])

    return result.rows[0]
  },

  /**
   * Update drop collection
   */
  async update(id, data) {
    // First check if collection exists
    await this.getById(id)

    const allowedFields = [
      'name',
      'slug',
      'description',
      'theme',
      'story',
      'drop_date',
      'end_date',
      'access_tiers',
      'visibility',
      'banner_image_url',
      'teaser_video_url',
      'waitlist_opens_at',
      'max_waitlist_size',
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
      UPDATE drops_collections
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await pool.query(query, values)
    return result.rows[0]
  },

  /**
   * Delete drop collection (soft delete by setting visibility to archived)
   */
  async delete(id) {
    // First check if collection exists
    await this.getById(id)

    const query = `
      UPDATE drops_collections
      SET visibility = 'archived'
      WHERE id = $1
      RETURNING id
    `

    await pool.query(query, [id])
    return { id, deleted: true }
  },
}
