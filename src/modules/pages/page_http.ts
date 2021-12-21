import { Router } from 'express'
import cache from '../../config/cache';
import { validate } from '../../helpers/validator';
import { Page as Handler } from './page_handler';
import { Page as Rules } from './page_rules';

const router = Router()

router.get('/v1/pages', cache(), validate(Rules.findAll, 'query'), Handler.findAll)

export default router
