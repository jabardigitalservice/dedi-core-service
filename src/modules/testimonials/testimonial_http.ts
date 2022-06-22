import { Router } from 'express'
import cache from '../../config/cache'
import { TestimonialLog } from './testimonial_log'
import { TestimonialHandler } from './testimonial_handler'
import { TestimonialRules } from './testimonial_rules'
import { TestimonialAccess } from './testimonial_access'
import { validate, validateWithDB } from '../../helpers/validator'
import { verifyAccessToken } from '../../middleware/jwt'

const testimonialHandler = new TestimonialHandler()

const router = Router()

router.get(
  '/v1/testimonials',
  cache(),
  validate(TestimonialRules.findAll, 'query'),
  TestimonialLog.findAll(),
  testimonialHandler.findAll
)
router.get(
  '/v1/testimonials/:id',
  verifyAccessToken,
  TestimonialAccess.findById(),
  testimonialHandler.findById
)
router.post(
  '/v1/testimonials',
  verifyAccessToken,
  TestimonialAccess.store(),
  validate(TestimonialRules.store),
  validateWithDB(TestimonialRules.storeWithDB),
  testimonialHandler.store
)
router.put(
  '/v1/testimonials/:id',
  verifyAccessToken,
  TestimonialAccess.update(),
  validate(TestimonialRules.update),
  validateWithDB(TestimonialRules.updateWithDB),
  testimonialHandler.update
)
router.delete(
  '/v1/testimonials/:id',
  verifyAccessToken,
  TestimonialAccess.destroy(),
  testimonialHandler.destroy
)

export default router
