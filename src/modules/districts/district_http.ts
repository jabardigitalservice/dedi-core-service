import { Router } from 'express'
import cache from '../../config/cache'
import { DistrictHandler } from './district_handler'

const districtHandler = new DistrictHandler()

const router = Router()

router.get('/v1/districts/with-location', districtHandler.withLocation)
router.get('/v1/districts/suggestion', cache(), districtHandler.suggestion)

export default router
