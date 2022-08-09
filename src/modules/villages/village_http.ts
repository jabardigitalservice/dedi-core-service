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
  VillageLog.listWithLocation(),
  villageHandler.listWithLocation
)
router.get('/v1/villages/suggestion', cache(), villageHandler.suggestion)
router.post(
  '/v1/villages/questionnaire',
  validate(VillageRules.questionnaire),
  validateWithDB(VillageRules.questionnaireWithDB),
  villageHandler.questionnaire
)
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

export default router
