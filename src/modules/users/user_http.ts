import { Router } from 'express'
import { User as Handler } from './user_handler'
import { User as Rules } from './user_rules'
import { User as Access } from './user_access'
import { validate, validateWithDB } from '../../helpers/validator'
import { verifyAccessToken } from '../../middleware/jwt'

const router = Router()

router.get('/v1/users', verifyAccessToken, validate(Rules.findAll, 'query'), Handler.findAll)
router.get('/v1/users/:id', verifyAccessToken, Access.findById(), Handler.findById)
router.post('/v1/users', verifyAccessToken, Access.store(), validate(Rules.store), validateWithDB(Rules.storeWithDB), Handler.store)
router.delete('/v1/users/:id', verifyAccessToken, Access.destroy(), Handler.destroy)

export default router
