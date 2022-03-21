import { Router } from 'express'
import { User as Handler } from './user_handler'
import { User as Rules } from './user_rules'
import { User as Access } from './user_access'
import { validate, validateWithDB } from '../../helpers/validator'
import { verifyAccessToken } from '../../middleware/jwt'

const router = Router()

router.get('/v1/users', verifyAccessToken, Access.findAll(), validate(Rules.findAll, 'query'), Handler.findAll)
router.get('/v1/users/:id', verifyAccessToken, Access.findById(), Handler.findById)
router.post('/v1/users', verifyAccessToken, Access.store(), validate(Rules.store), validateWithDB(Rules.storeWithDB), Handler.store)
router.put('/v1/users/:id', verifyAccessToken, Access.update(), validate(Rules.update), validateWithDB(Rules.updateWithDB), Handler.update)
router.patch('/v1/users/status/:id', verifyAccessToken, Access.status(), validate(Rules.status), Handler.status)
router.delete('/v1/users/:id', verifyAccessToken, Access.destroy(), Handler.destroy)

export default router
