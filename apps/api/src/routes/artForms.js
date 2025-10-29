import { Router } from 'express'
import { artFormService } from '../services/artFormService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

// GET /api/art-forms - Get all art forms
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { is_active, region, limit, offset } = req.query

    const result = await artFormService.getAll({
      is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
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

// GET /api/art-forms/:id - Get art form by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const artForm = await artFormService.getById(req.params.id)

    res.json({
      success: true,
      data: artForm,
    })
  })
)

// GET /api/art-forms/slug/:slug - Get art form by slug
router.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const artForm = await artFormService.getBySlug(req.params.slug)

    res.json({
      success: true,
      data: artForm,
    })
  })
)

// GET /api/art-forms/:id/artists - Get artists for an art form
router.get(
  '/:id/artists',
  asyncHandler(async (req, res) => {
    const artists = await artFormService.getArtists(req.params.id)

    res.json({
      success: true,
      data: artists,
      total: artists.length,
    })
  })
)

// POST /api/art-forms - Create new art form
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const artForm = await artFormService.create(req.body)

    res.status(201).json({
      success: true,
      data: artForm,
      message: 'Art form created successfully',
    })
  })
)

// PATCH /api/art-forms/:id - Update art form
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const artForm = await artFormService.update(req.params.id, req.body)

    res.json({
      success: true,
      data: artForm,
      message: 'Art form updated successfully',
    })
  })
)

// DELETE /api/art-forms/:id - Delete art form
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await artFormService.delete(req.params.id)

    res.json({
      success: true,
      message: 'Art form deleted successfully',
    })
  })
)

export default router
