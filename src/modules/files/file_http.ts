import { Router } from 'express'
import { verifyAccessToken } from '../../middleware/jwt'
import { File as Handler } from './file_handler'
import { File as Rules } from './file_rules'
import { validate } from '../../helpers/validator';

const router = Router()

router.post('/v1/files/upload', verifyAccessToken, Handler.upload)
router.delete('/v1/files/upload', verifyAccessToken, validate(Rules.destroy), Handler.destroy)

export default router
