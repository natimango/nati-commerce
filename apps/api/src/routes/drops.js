import { Router } from 'express'
import { dropService } from '../services/dropService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

// GET /api/drops - Get all drop collections
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { visibility, upcoming, active, limit, offset } = req.query

    const result = await dropService.getAll({
      visibility,
      upcoming,
      active,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    })

    res.json({
      success: true,
      ...result,
    })
  })
)

// GET /api/drops/:id - Get drop collection by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const drop = await dropService.getById(req.params.id)

    res.json({
      success: true,
      data: drop,
    })
  })
)

// GET /api/drops/slug/:slug - Get drop collection by slug
router.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const drop = await dropService.getBySlug(req.params.slug)

    res.json({
      success: true,
      data: drop,
    })
  })
)

// GET /api/drops/:id/products - Get products in a drop
router.get(
  '/:id/products',
  asyncHandler(async (req, res) => {
    const products = await dropService.getProducts(req.params.id)

    res.json({
      success: true,
      data: products,
      total: products.length,
    })
  })
)

// GET /api/drops/:id/waitlist - Get waitlist for a drop
router.get(
  '/:id/waitlist',
  asyncHandler(async (req, res) => {
    const { status, tier, limit, offset } = req.query

    const result = await dropService.getWaitlist(req.params.id, {
      status,
      tier,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    })

    res.json({
      success: true,
      ...result,
    })
  })
)

// POST /api/drops/:id/waitlist - Join waitlist for a drop
router.post(
  '/:id/waitlist',
  asyncHandler(async (req, res) => {
    const waitlistEntry = await dropService.joinWaitlist(req.params.id, req.body)

    res.status(201).json({
      success: true,
      data: waitlistEntry,
      message: 'Successfully joined waitlist',
    })
  })
)

// POST /api/drops - Create new drop collection
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const drop = await dropService.create(req.body)

    res.status(201).json({
      success: true,
      data: drop,
      message: 'Drop collection created successfully',
    })
  })
)

// POST /api/drops/:id/products - Add product to drop collection
router.post(
  '/:id/products',
  asyncHandler(async (req, res) => {
    const product = await dropService.addProduct(req.params.id, req.body)

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product added to drop successfully',
    })
  })
)

// PATCH /api/drops/:id - Update drop collection
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const drop = await dropService.update(req.params.id, req.body)

    res.json({
      success: true,
      data: drop,
      message: 'Drop collection updated successfully',
    })
  })
)

// DELETE /api/drops/:id - Delete drop collection
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await dropService.delete(req.params.id)

    res.json({
      success: true,
      message: 'Drop collection deleted successfully',
    })
  })
)

export default router
