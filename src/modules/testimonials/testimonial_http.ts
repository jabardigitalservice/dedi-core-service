import { Router } from 'express'
import cache from '../../config/cache'
import { Testimonial as Log } from './testimonial_log'
import { Testimonial as Handler } from './testimonial_handler'
import { Testimonial as Rules } from './testimonial_rules'
import { validate } from '../../helpers/validator'

const router = Router()

router.get('/v1/testimonials', cache(), validate(Rules.findAll, 'query'), Log.findAll(), Handler.findAll)

export default router
