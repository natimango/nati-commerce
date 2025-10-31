import pool from '../config/database.js'

export const millService = {
  async getAll(filters = {}) {
    const { is_active, mill_type, limit = 50, offset = 0 } = filters

    let query = "SELECT id, name, location, mill_type, certifications, contact_email, contact_phone, is_active, created_at, updated_at FROM cultural_mills WHERE 1=1"
    const params = []
    let paramCount = 1

    if (is_active !== undefined) {
      query += " AND is_active = $" + paramCount.toString()
      params.push(is_active)
      paramCount++
    }

    if (mill_type) {
      query += " AND mill_type = $" + paramCount.toString()
      params.push(mill_type)
      paramCount++
    }

    const countQuery = "SELECT COUNT(*) as total FROM (" + query + ") as filtered"
    const countResult = await pool.query(countQuery, params)
    const total = parseInt(countResult.rows[0].total)

    query += " ORDER BY name ASC LIMIT $" + paramCount.toString() + " OFFSET $" + (paramCount + 1).toString()
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
    const query = "SELECT id, name, location, mill_type, certifications, contact_email, contact_phone, is_active, created_at, updated_at FROM cultural_mills WHERE id = $1"
    const result = await pool.query(query, [id])
    if (result.rows.length === 0) {
      throw new Error('Mill not found')
    }
    return result.rows[0]
  },

  async getFabricLineages(millId) {
    const query = "SELECT fl.id, fl.name, fl.weaving_mill_id, fl.dyeing_mill_id, fl.printing_mill_id, fl.finishing_mill_id, fl.fabric_type, fl.weight_gsm, fl.thread_count, fl.origin_country, fl.origin_state, fl.is_organic, fl.certifications, fl.water_usage_liters, fl.carbon_footprint_kg, fl.created_at, fl.updated_at FROM cultural_fabric_lineages fl WHERE fl.weaving_mill_id = $1 OR fl.dyeing_mill_id = $1 OR fl.printing_mill_id = $1 OR fl.finishing_mill_id = $1 ORDER BY fl.created_at DESC"
    const result = await pool.query(query, [millId])
    return result.rows
  },

  async create(data) {
    const { name, location, mill_type, certifications, contact_email, contact_phone, is_active = true } = data
    const query = "INSERT INTO cultural_mills (name, location, mill_type, certifications, contact_email, contact_phone, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"
    const result = await pool.query(query, [name, location, mill_type, certifications || {}, contact_email, contact_phone, is_active])
    return result.rows[0]
  },

  async update(id, data) {
    await this.getById(id)
    const allowedFields = ['name', 'location', 'mill_type', 'certifications', 'contact_email', 'contact_phone', 'is_active']
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
    const query = "UPDATE cultural_mills SET " + updates.join(', ') + " WHERE id = $" + paramCount.toString() + " RETURNING *"
    const result = await pool.query(query, values)
    return result.rows[0]
  },

  async delete(id) {
    await this.getById(id)
    const query = "UPDATE cultural_mills SET is_active = false WHERE id = $1 RETURNING id"
    await pool.query(query, [id])
    return { id, deleted: true }
  },
}
