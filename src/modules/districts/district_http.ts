import { Router } from 'express'
import cache from '../../config/cache'
import { District as Handler } from './district_handler'

const router = Router()

router.get('/v1/districts/with-location', Handler.withLocation)
router.get('/v1/districts/suggestion', cache(), Handler.suggestion)

export default router
