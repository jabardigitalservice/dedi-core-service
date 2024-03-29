import { Router } from 'express'
import cache from '../../config/cache'
import { VillageLog } from './village_log'
import { VillageHandler } from './village_handler'
import { VillageRules } from './village_rules'
import { validate, validateWithDB } from '../../helpers/validator'
import { VillageAccess } from './village_access'
import { verifyAccessToken } from '../../middleware/jwt'

const villageHandler = new VillageHandler()

const router = Router()

router.get('/v1/villages/with-location', villageHandler.withLocation)
router.get(
  '/v1/villages/list-with-location',
  cache(),
  validate(VillageRules.listWithLocation, 'query'),
  VillageLog.listWithLocation(),
  villageHandler.listWithLocation
)
router.get('/v1/villages/suggestion', cache(), villageHandler.suggestion)
router.get('/v1/villages/:id', villageHandler.findById)
router.get('/v1/villages/:id/check-registered', villageHandler.checkRegistered)

router.post(
  '/v1/villages',
  verifyAccessToken,
  VillageAccess.store(),
  validate(VillageRules.store),
  validateWithDB(VillageRules.storeWithDB),
  villageHandler.store
)

router.put(
  '/v1/villages/:id',
  verifyAccessToken,
  VillageAccess.update(),
  validate(VillageRules.update),
  validateWithDB(VillageRules.updateWithDB),
  villageHandler.update
)

router.delete(
  '/v1/villages/:id',
  verifyAccessToken,
  VillageAccess.destroy(),
  villageHandler.destroy
)

export default router
