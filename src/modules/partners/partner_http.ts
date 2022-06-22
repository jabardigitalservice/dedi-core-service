import { Router } from 'express'
import cache from '../../config/cache'
import { PartnerHandler } from './partner_handler'
import { PartnerLog } from './partner_log'

const partnerHandler = new PartnerHandler()

const router = Router()

router.get('/v1/partners', cache(), PartnerLog.findAll(), partnerHandler.findAll)
router.get('/v1/partners/suggestion', cache(), partnerHandler.suggestion)

export default router
