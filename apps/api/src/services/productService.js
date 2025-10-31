import pool from '../config/database.js'

export const productService = {
  /**
   * Get all products with pagination and filters
   */
  async getAll(filters = {}) {
    const {
      page = 1,
      limit = 12,
      sort = 'newest',
      art_form,
      artist,
      price_min,
      price_max,
      in_stock,
      is_limited_edition,
    } = filters

    const offset = (page - 1) * limit
    const params = []
    let paramIndex = 1

    // Base query with all product data
    let query = `
      SELECT
        p.*,
        af.name as art_form,
        af.slug as art_form_slug,
        a.name as artist_name,
        a.slug as artist_slug
      FROM products p
      LEFT JOIN cultural_art_forms af ON p.art_form_id = af.id
      LEFT JOIN cultural_artists a ON p.artist_id = a.id
      WHERE 1=1
    `

    // Apply filters
    if (art_form) {
      query += ` AND af.slug = $${paramIndex++}`
      params.push(art_form)
    }

    if (artist) {
      query += ` AND a.slug = $${paramIndex++}`
      params.push(artist)
    }

    if (price_min !== undefined) {
      query += ` AND p.price >= $${paramIndex++}`
      params.push(price_min)
    }

    if (price_max !== undefined) {
      query += ` AND p.price <= $${paramIndex++}`
      params.push(price_max)
    }

    if (in_stock !== undefined) {
      query += ` AND p.in_stock = $${paramIndex++}`
      params.push(in_stock)
    }

    if (is_limited_edition !== undefined) {
      query += ` AND p.is_limited_edition = $${paramIndex++}`
      params.push(is_limited_edition)
    }

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY p.price ASC'
        break
      case 'price_desc':
        query += ' ORDER BY p.price DESC'
        break
      case 'popular':
        query += ' ORDER BY p.view_count DESC, p.created_at DESC'
        break
      case 'newest':
      default:
        query += ' ORDER BY p.created_at DESC'
        break
    }

    // Add pagination
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(limit, offset)

    // Execute query
    const result = await pool.query(query, params)

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN cultural_art_forms af ON p.art_form_id = af.id
      LEFT JOIN cultural_artists a ON p.artist_id = a.id
      WHERE 1=1
    `

    const countParams = []
    let countParamIndex = 1

    if (art_form) {
      countQuery += ` AND af.slug = $${countParamIndex++}`
      countParams.push(art_form)
    }

    if (artist) {
      countQuery += ` AND a.slug = $${countParamIndex++}`
      countParams.push(artist)
    }

    if (price_min !== undefined) {
      countQuery += ` AND p.price >= $${countParamIndex++}`
      countParams.push(price_min)
    }

    if (price_max !== undefined) {
      countQuery += ` AND p.price <= $${countParamIndex++}`
      countParams.push(price_max)
    }

    if (in_stock !== undefined) {
      countQuery += ` AND p.in_stock = $${countParamIndex++}`
      countParams.push(in_stock)
    }

    if (is_limited_edition !== undefined) {
      countQuery += ` AND p.is_limited_edition = $${countParamIndex++}`
      countParams.push(is_limited_edition)
    }

    const countResult = await pool.query(countQuery, countParams)
    const total = parseInt(countResult.rows[0].total)

    return {
      products: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    }
  },

  /**
   * Get single product by slug or ID
   */
  async getBySlugOrId(slugOrId) {
    const query = `
      SELECT
        p.*,
        af.name as art_form,
        af.slug as art_form_slug,
        a.name as artist_name,
        a.slug as artist_slug,
        a.id as artist_id
      FROM products p
      LEFT JOIN cultural_art_forms af ON p.art_form_id = af.id
      LEFT JOIN cultural_artists a ON p.artist_id = a.id
      WHERE p.slug = $1 OR p.id::text = $1
    `

    const result = await pool.query(query, [slugOrId])

    if (result.rows.length === 0) {
      return null
    }

    // Increment view count
    await pool.query(
      'UPDATE products SET view_count = view_count + 1 WHERE id = $1',
      [result.rows[0].id]
    )

    return result.rows[0]
  },

  /**
   * Get featured products
   */
  async getFeatured(limit = 8) {
    const query = `
      SELECT
        p.*,
        af.name as art_form,
        a.name as artist_name
      FROM products p
      LEFT JOIN cultural_art_forms af ON p.art_form_id = af.id
      LEFT JOIN cultural_artists a ON p.artist_id = a.id
      WHERE p.is_featured = true AND p.in_stock = true
      ORDER BY p.created_at DESC
      LIMIT $1
    `

    const result = await pool.query(query, [limit])
    return result.rows
  },

  /**
   * Search products by query
   */
  async search(searchQuery, filters = {}) {
    const { page = 1, limit = 12 } = filters
    const offset = (page - 1) * limit

    const query = `
      SELECT
        p.*,
        af.name as art_form,
        a.name as artist_name,
        ts_rank(
          to_tsvector('english', p.name || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(af.name, '') || ' ' || COALESCE(a.name, '')),
          plainto_tsquery('english', $1)
        ) as rank
      FROM products p
      LEFT JOIN cultural_art_forms af ON p.art_form_id = af.id
      LEFT JOIN cultural_artists a ON p.artist_id = a.id
      WHERE to_tsvector('english', p.name || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(af.name, '') || ' ' || COALESCE(a.name, '')) @@ plainto_tsquery('english', $1)
      ORDER BY rank DESC, p.created_at DESC
      LIMIT $2 OFFSET $3
    `

    const result = await pool.query(query, [searchQuery, limit, offset])

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN cultural_art_forms af ON p.art_form_id = af.id
      LEFT JOIN cultural_artists a ON p.artist_id = a.id
      WHERE to_tsvector('english', p.name || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(af.name, '') || ' ' || COALESCE(a.name, '')) @@ plainto_tsquery('english', $1)
    `

    const countResult = await pool.query(countQuery, [searchQuery])
    const total = parseInt(countResult.rows[0].total)

    return {
      products: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    }
  },

  /**
   * Create new product
   */
  async create(productData) {
    const {
      name,
      slug,
      description,
      price,
      compare_at_price,
      images,
      thumbnail,
      in_stock,
      stock_quantity,
      art_form_id,
      artist_id,
      fabric_type,
      production_method,
      story_title,
      story_content,
      inspiration,
      sustainability_score,
      certifications,
      is_limited_edition,
      edition_size,
      is_featured,
    } = productData

    const query = `
      INSERT INTO products (
        name, slug, description, price, compare_at_price, images, thumbnail,
        in_stock, stock_quantity, art_form_id, artist_id, fabric_type,
        production_method, story_title, story_content, inspiration,
        sustainability_score, certifications, is_limited_edition, edition_size,
        is_featured
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21
      ) RETURNING *
    `

    const result = await pool.query(query, [
      name,
      slug,
      description,
      price,
      compare_at_price,
      JSON.stringify(images),
      thumbnail,
      in_stock,
      stock_quantity,
      art_form_id,
      artist_id,
      fabric_type,
      production_method,
      story_title,
      story_content,
      inspiration,
      sustainability_score,
      JSON.stringify(certifications),
      is_limited_edition,
      edition_size,
      is_featured || false,
    ])

    return result.rows[0]
  },
}
