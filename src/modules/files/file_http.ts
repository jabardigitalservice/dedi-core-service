import { Router } from 'express'
import verifyPublic from '../../middleware/verifyPublic'
import { File as Handler } from './file_handler'

const router = Router()

router.post('/v1/files/upload', verifyPublic, Handler.upload)

export default router
