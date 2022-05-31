import { Router } from 'express'
import verifyPublic from '../../middleware/verifyPublic'
import { File as Handler } from './file_handler'

const router = Router()

router.post('/v1/files/upload', verifyPublic, Handler.upload)
router.get('/v1/files/download/:filename', verifyPublic, Handler.download)

export default router
