import { Router } from 'express'
import { verifyAccessToken } from '../../middleware/jwt'
import { File as Handler } from './file_handler'

const router = Router()

router.post('/v1/files/upload', verifyAccessToken, Handler.upload)

export default router
