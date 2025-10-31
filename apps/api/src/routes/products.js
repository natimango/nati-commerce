import express from 'express'
import { productService } from '../services/productService.js'

const router = express.Router()

/**
 * GET /api/products
 * Get all products with pagination and filters
 */
router.get('/', async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort,
      art_form: req.query.art_form,
      artist: req.query.artist,
      price_min: req.query.price_min,
      price_max: req.query.price_max,
      in_stock: req.query.in_stock === 'true',
      is_limited_edition: req.query.is_limited_edition === 'true',
    }

    const result = await productService.getAll(filters)
    res.json(result)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

/**
 * GET /api/products/featured
 * Get featured products
 */
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8
    const products = await productService.getFeatured(limit)
    res.json(products)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    res.status(500).json({ error: 'Failed to fetch featured products' })
  }
})

/**
 * GET /api/products/search
 * Search products
 */
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' })
    }

    const filters = {
      page: req.query.page,
      limit: req.query.limit,
    }

    const result = await productService.search(query, filters)
    res.json(result)
  } catch (error) {
    console.error('Error searching products:', error)
    res.status(500).json({ error: 'Failed to search products' })
  }
})

/**
 * GET /api/products/:slugOrId
 * Get single product by slug or ID
 */
router.get('/:slugOrId', async (req, res) => {
  try {
    const product = await productService.getBySlugOrId(req.params.slugOrId)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

/**
 * POST /api/products
 * Create new product (admin only - add auth middleware later)
 */
router.post('/', async (req, res) => {
  try {
    const product = await productService.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

export default router
