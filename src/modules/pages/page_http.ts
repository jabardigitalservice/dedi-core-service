import { Router } from 'express'
import cache from '../../config/cache'
import { validate, validateWithDB } from '../../helpers/validator'
import { verifyAccessToken } from '../../middleware/jwt'
import { PageAccess } from './page_access'
import { PageHandler } from './page_handler'
import { PageRules } from './page_rules'

const pageHandler = new PageHandler()

const router = Router()

router.get('/v1/pages', cache(), validate(PageRules.findAll, 'query'), pageHandler.findAll)
router.get('/v1/pages/:id', verifyAccessToken, PageAccess.findById(), pageHandler.findById)
router.post(
  '/v1/pages',
  verifyAccessToken,
  PageAccess.store(),
  validate(PageRules.store),
  validateWithDB(PageRules.storeWithDB),
  pageHandler.store
)
router.delete('/v1/pages/:id', verifyAccessToken, PageAccess.destroy(), pageHandler.destroy)
router.put(
  '/v1/pages/:id',
  verifyAccessToken,
  PageAccess.update(),
  validate(PageRules.update),
  validateWithDB(PageRules.updateWithDB),
  pageHandler.update
)

export default router
