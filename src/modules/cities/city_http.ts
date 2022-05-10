import { Router } from 'express'
import cache from '../../config/cache'
import { City as Handler } from './city_handler'

const router = Router()

router.get('/v1/cities/with-location', Handler.withLocation)
router.get('/v1/cities/suggestion', cache(), Handler.suggestion)

export default router
