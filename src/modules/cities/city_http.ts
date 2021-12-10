import { Router } from 'express'
import { City as Handler } from './city_handler'

const router = Router()

router.get('/v1/cities/with-location', Handler.withLocation)

export default router
