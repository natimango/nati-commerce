import pool from '../config/database.js'

export const dropService = {
  async getAll(filters = {}) {
    const { status, upcoming, active, limit = 20, offset = 0 } = filters

    let query = "SELECT dc.id, dc.name, dc.slug, dc.theme, dc.story, dc.hero_image_url, dc.teaser_video_url, dc.announcement_at, dc.launch_at, dc.ends_at, dc.status, dc.waitlist_enabled, dc.pre_access_hours, dc.total_products, dc.total_inventory, dc.waitlist_count, dc.conversion_rate, dc.created_at, dc.updated_at FROM drops_collections dc WHERE 1=1"
    const params = []
    let paramCount = 1

    if (status) {
      query += " AND dc.status = $" + paramCount.toString()
      params.push(status)
      paramCount++
    }

    if (upcoming === 'true') {
      query += " AND dc.launch_at > NOW()"
    }

    if (active === 'true') {
      query += " AND dc.status = 'live'"
    }

    const countQuery = "SELECT COUNT(*) as total FROM (" + query + ") as filtered"
    const countResult = await pool.query(countQuery, params)
    const total = parseInt(countResult.rows[0].total)

    query += " ORDER BY dc.launch_at DESC LIMIT $" + paramCount.toString() + " OFFSET $" + (paramCount + 1).toString()
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

  async getById(id) {
    const query = "SELECT id, name, slug, theme, story, hero_image_url, teaser_video_url, announcement_at, launch_at, ends_at, status, waitlist_enabled, pre_access_hours, total_products, total_inventory, waitlist_count, conversion_rate, created_at, updated_at FROM drops_collections WHERE id = $1"
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      throw new Error('Drop collection not found')
    }

    return result.rows[0]
  },

  async getBySlug(slug) {
    const query = "SELECT id, name, slug, theme, story, hero_image_url, teaser_video_url, announcement_at, launch_at, ends_at, status, waitlist_enabled, pre_access_hours, total_products, total_inventory, waitlist_count, conversion_rate, created_at, updated_at FROM drops_collections WHERE slug = $1"
    const result = await pool.query(query, [slug])

    if (result.rows.length === 0) {
      throw new Error('Drop collection not found')
    }

    return result.rows[0]
  },

  async getProducts(dropId) {
    const query = "SELECT id, drop_id, product_id, display_order, is_featured, allocated_inventory, reserved_inventory, sold_inventory, created_at FROM drops_products WHERE drop_id = $1 ORDER BY display_order ASC"
    const result = await pool.query(query, [dropId])
    return result.rows
  },

  async getWaitlist(dropId, filters = {}) {
    const { status, tier, limit = 100, offset = 0 } = filters

    let query = "SELECT id, drop_id, user_id, email, tier, status, joined_at, notified_at, converted_at, notification_opened FROM drops_waitlist WHERE drop_id = $1"
    const params = [dropId]
    let paramCount = 2

    if (status) {
      query += " AND status = $" + paramCount.toString()
      params.push(status)
      paramCount++
    }

    if (tier) {
      query += " AND tier = $" + paramCount.toString()
      params.push(tier)
      paramCount++
    }

    const countQuery = "SELECT COUNT(*) as total FROM (" + query + ") as filtered"
    const countResult = await pool.query(countQuery, params)
    const total = parseInt(countResult.rows[0].total)

    query += " ORDER BY joined_at ASC LIMIT $" + paramCount.toString() + " OFFSET $" + (paramCount + 1).toString()
    params.push(limit, offset)

    const result = await pool.query(query, params)

    return {
      data: result.rows,
      total,
      limit,
      offset,
    }
  },

  async joinWaitlist(dropId, data) {
    const { user_id, email, tier = 'standard' } = data

    const drop = await this.getById(dropId)

    if (drop.status === 'cancelled') {
      throw new Error('This drop has been cancelled')
    }

    const existingQuery = "SELECT id FROM drops_waitlist WHERE drop_id = $1 AND user_id = $2"
    const existing = await pool.query(existingQuery, [dropId, user_id])

    if (existing.rows.length > 0) {
      throw new Error('Already on waitlist for this drop')
    }

    const insertQuery = "INSERT INTO drops_waitlist (drop_id, user_id, email, tier, status) VALUES ($1, $2, $3, $4, 'waiting') RETURNING *"
    const result = await pool.query(insertQuery, [dropId, user_id, email, tier])

    return result.rows[0]
  },

  async create(data) {
    const {
      name,
      slug,
      theme,
      story,
      hero_image_url,
      teaser_video_url,
      announcement_at,
      launch_at,
      ends_at,
      status = 'upcoming',
      waitlist_enabled = true,
      pre_access_hours = 24,
    } = data

    const query = "INSERT INTO drops_collections (name, slug, theme, story, hero_image_url, teaser_video_url, announcement_at, launch_at, ends_at, status, waitlist_enabled, pre_access_hours) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *"
    const result = await pool.query(query, [
      name,
      slug,
      theme,
      story,
      hero_image_url,
      teaser_video_url,
      announcement_at,
      launch_at,
      ends_at,
      status,
      waitlist_enabled,
      pre_access_hours,
    ])

    return result.rows[0]
  },

  async addProduct(dropId, productData) {
    const { product_id, display_order = 0, is_featured = false, allocated_inventory = 0 } = productData

    await this.getById(dropId)

    const query = "INSERT INTO drops_products (drop_id, product_id, display_order, is_featured, allocated_inventory) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    const result = await pool.query(query, [dropId, product_id, display_order, is_featured, allocated_inventory])

    return result.rows[0]
  },

  async update(id, data) {
    await this.getById(id)

    const allowedFields = ['name', 'slug', 'theme', 'story', 'hero_image_url', 'teaser_video_url', 'announcement_at', 'launch_at', 'ends_at', 'status', 'waitlist_enabled', 'pre_access_hours']

    const updates = []
    const values = []
    let paramCount = 1

    Object.keys(data).forEach((key) => {
      if (allowedFields.includes(key) && data[key] !== undefined) {
        updates.push(key + " = $" + paramCount.toString())
        values.push(data[key])
        paramCount++
      }
    })

    if (updates.length === 0) {
      throw new Error('No valid fields to update')
    }

    values.push(id)
    const query = "UPDATE drops_collections SET " + updates.join(', ') + " WHERE id = $" + paramCount.toString() + " RETURNING *"
    const result = await pool.query(query, values)
    return result.rows[0]
  },

  async delete(id) {
    await this.getById(id)
    const query = "UPDATE drops_collections SET status = 'cancelled' WHERE id = $1 RETURNING id"
    await pool.query(query, [id])
    return { id, deleted: true }
  },
}
