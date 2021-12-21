import { Router } from 'express'
import { Page as Handler } from './page_handler';

const router = Router()

router.get('/v1/pages', Handler.findAll)

export default router
