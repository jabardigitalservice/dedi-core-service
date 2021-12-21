import { Router } from 'express'
import { verifyAccessToken } from '../../middleware/jwt';
import { Page as Handler } from './page_handler';
import { Page as Access } from './page_access';

const router = Router()

router.get('/v1/pages', verifyAccessToken, Access.findAll(), Handler.findAll)

export default router
