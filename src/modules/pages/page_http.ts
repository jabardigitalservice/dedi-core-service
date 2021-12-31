import { Router } from 'express'
import cache from '../../config/cache';
import { validate, validateWithDB } from '../../helpers/validator';
import { verifyAccessToken } from '../../middleware/jwt';
import { Page as Access } from './page_access';
import { Page as Handler } from './page_handler';
import { Page as Rules } from './page_rules';

const router = Router()

router.get('/v1/pages', cache(), validate(Rules.findAll, 'query'), Handler.findAll)
router.get('/v1/pages/:id', verifyAccessToken, Access.findById(), Handler.findById)
router.post('/v1/pages', verifyAccessToken, Access.store(), validate(Rules.store), validateWithDB(Rules.storeWithDB), Handler.store)
router.delete('/v1/pages/:id', verifyAccessToken, Access.destroy(), Handler.destroy)
router.put('/v1/pages/:id', verifyAccessToken, Access.update(), validate(Rules.update), validateWithDB(Rules.updateWithDB), Handler.update)

export default router
