import { Router } from 'express'
import cache from '../../config/cache'
import { Testimonial as Log } from './testimonial_log'
import { Testimonial as Handler } from './testimonial_handler'
import { Testimonial as Rules } from './testimonial_rules'
import { Testimonial as Access } from './testimonial_access'
import { validate, validateWithDB } from '../../helpers/validator'
import { verifyAccessToken } from '../../middleware/jwt'

const router = Router()

router.get('/v1/testimonials', cache(), validate(Rules.findAll, 'query'), Log.findAll(), Handler.findAll)
router.get('/v1/testimonials/:id', verifyAccessToken, Access.findById(), Handler.findById)
router.post('/v1/testimonials', verifyAccessToken, Access.store(), validate(Rules.store, 'body'), validateWithDB(Rules.storeWithDB), Handler.store)
router.delete('/v1/testimonials/:id', verifyAccessToken, Access.destroy(), Handler.destroy)

export default router
