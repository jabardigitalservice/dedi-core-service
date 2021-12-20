import { Router } from 'express'
import { File as Handler } from './file_handler'

const router = Router()

router.post('/v1/files/upload', Handler.upload)

export default router
