import { Router } from 'express'
import cache from '../../config/cache'
import { Testimonial as Log } from './testimonial_log'
import { Testimonial as Handler } from './testimonial_handler'

const router = Router()

router.get('/v1/testimonials', Handler.testimonials)

export default router
