import { Router } from 'express'
import cache from '../../config/cache'
import { validate } from '../../helpers/validator'
import { PartnerHandler } from './partner_handler'
import { PartnerLog } from './partner_log'
import { PartnerRules } from './partner_rules'

const partnerHandler = new PartnerHandler()

const router = Router()

router.get(
  '/v1/partners',
  cache(),
  validate(PartnerRules.findAll, 'query'),
  PartnerLog.findAll(),
  partnerHandler.findAll
)
router.get('/v1/partners/suggestion', cache(), partnerHandler.suggestion)

export default router
