import { Router } from 'express'
import { District as Handler } from './district_handler'

const router = Router()

router.get('/v1/districts/with-location', Handler.withLocation)

export default router
