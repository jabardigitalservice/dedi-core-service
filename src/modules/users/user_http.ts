import { Router } from 'express'
import { User as Handler } from './user_handler'
import { User as Rules } from './user_rules'
import { User as Access } from './user_access'
import { validate } from '../../helpers/validator'
import { verifyAccessToken } from '../../middleware/jwt'

const router = Router()

router.get('/v1/users', verifyAccessToken, validate(Rules.findAll, 'query'), Handler.findAll)
router.get('/v1/users/:id', verifyAccessToken, Access.findById(), Handler.findById)

export default router
