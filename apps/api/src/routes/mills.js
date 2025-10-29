import { Router } from 'express'
import { millService } from '../services/millService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

// GET /api/mills - Get all mills
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { is_active, mill_type, region, limit, offset } = req.query

    const result = await millService.getAll({
      is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
      mill_type,
      region,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    })

    res.json({
      success: true,
      ...result,
    })
  })
)

// GET /api/mills/:id - Get mill by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const mill = await millService.getById(req.params.id)

    res.json({
      success: true,
      data: mill,
    })
  })
)

// GET /api/mills/slug/:slug - Get mill by slug
router.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const mill = await millService.getBySlug(req.params.slug)

    res.json({
      success: true,
      data: mill,
    })
  })
)

// GET /api/mills/:id/lineages - Get fabric lineages for a mill
router.get(
  '/:id/lineages',
  asyncHandler(async (req, res) => {
    const lineages = await millService.getFabricLineages(req.params.id)

    res.json({
      success: true,
      data: lineages,
      total: lineages.length,
    })
  })
)

// POST /api/mills - Create new mill
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const mill = await millService.create(req.body)

    res.status(201).json({
      success: true,
      data: mill,
      message: 'Mill created successfully',
    })
  })
)

// PATCH /api/mills/:id - Update mill
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const mill = await millService.update(req.params.id, req.body)

    res.json({
      success: true,
      data: mill,
      message: 'Mill updated successfully',
    })
  })
)

// DELETE /api/mills/:id - Delete mill
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await millService.delete(req.params.id)

    res.json({
      success: true,
      message: 'Mill deleted successfully',
    })
  })
)

export default router
