import { Router } from 'express'
import cache from '../../config/cache'
import { CityHandler } from './city_handler'

const cityHandler = new CityHandler()

const router = Router()

router.get('/v1/cities/with-location', cityHandler.withLocation)
router.get('/v1/cities/suggestion', cache(), cityHandler.suggestion)

export default router
