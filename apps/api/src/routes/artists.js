import { Router } from 'express'
import { artistService } from '../services/artistService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

// GET /api/artists - Get all artists
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { is_active, is_verified, art_form_id, limit, offset } = req.query

    const result = await artistService.getAll({
      is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
      is_verified: is_verified === 'true' ? true : is_verified === 'false' ? false : undefined,
      art_form_id,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    })

    res.json({
      success: true,
      ...result,
    })
  })
)

// GET /api/artists/:id - Get artist by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const artist = await artistService.getById(req.params.id)

    res.json({
      success: true,
      data: artist,
    })
  })
)

// GET /api/artists/slug/:slug - Get artist by slug
router.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const artist = await artistService.getBySlug(req.params.slug)

    res.json({
      success: true,
      data: artist,
    })
  })
)

// GET /api/artists/:id/credits - Get artist's product credits
router.get(
  '/:id/credits',
  asyncHandler(async (req, res) => {
    const credits = await artistService.getProductCredits(req.params.id)

    res.json({
      success: true,
      data: credits,
      total: credits.length,
    })
  })
)

// POST /api/artists - Create new artist
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const artist = await artistService.create(req.body)

    res.status(201).json({
      success: true,
      data: artist,
      message: 'Artist created successfully',
    })
  })
)

// PATCH /api/artists/:id - Update artist
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const artist = await artistService.update(req.params.id, req.body)

    res.json({
      success: true,
      data: artist,
      message: 'Artist updated successfully',
    })
  })
)

// DELETE /api/artists/:id - Delete artist
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await artistService.delete(req.params.id)

    res.json({
      success: true,
      message: 'Artist deleted successfully',
    })
  })
)

// POST /api/artists/:id/follow - Follow an artist
router.post(
  '/:id/follow',
  asyncHandler(async (req, res) => {
    const artist = await artistService.updateFollowerCount(req.params.id, 1)

    res.json({
      success: true,
      data: artist,
      message: 'Artist followed successfully',
    })
  })
)

// POST /api/artists/:id/unfollow - Unfollow an artist
router.post(
  '/:id/unfollow',
  asyncHandler(async (req, res) => {
    const artist = await artistService.updateFollowerCount(req.params.id, -1)

    res.json({
      success: true,
      data: artist,
      message: 'Artist unfollowed successfully',
    })
  })
)

export default router
