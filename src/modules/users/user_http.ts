import { Router } from 'express'
import { UserHandler } from './user_handler'
import { UserRules } from './user_rules'
import { UserAccess } from './user_access'
import { validate, validateWithDB } from '../../helpers/validator'
import { verifyAccessToken } from '../../middleware/jwt'

const userHandler = new UserHandler()

const router = Router()

router.get(
  '/v1/users',
  verifyAccessToken,
  UserAccess.findAll(),
  validate(UserRules.findAll, 'query'),
  userHandler.findAll
)
router.get('/v1/users/:id', verifyAccessToken, UserAccess.findById(), userHandler.findById)
router.post(
  '/v1/users',
  verifyAccessToken,
  UserAccess.store(),
  validate(UserRules.store),
  validateWithDB(UserRules.storeWithDB),
  userHandler.store
)
router.put(
  '/v1/users/:id',
  verifyAccessToken,
  UserAccess.update(),
  validate(UserRules.update),
  validateWithDB(UserRules.updateWithDB),
  userHandler.update
)
router.patch(
  '/v1/users/:id/status',
  verifyAccessToken,
  UserAccess.updateStatus(),
  validate(UserRules.updateStatus),
  userHandler.updateStatus
)

router.put(
  '/v1/users/:id/verify',
  verifyAccessToken,
  UserAccess.verify(),
  validate(UserRules.verify),
  userHandler.verify
)
router.delete('/v1/users/:id', verifyAccessToken, UserAccess.destroy(), userHandler.destroy)

export default router
