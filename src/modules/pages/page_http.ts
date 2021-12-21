import { Router } from 'express'
import { validate } from '../../helpers/validator';
import { Page as Handler } from './page_handler';
import { Page as Rules } from './page_rules';

const router = Router()

router.get('/v1/pages', validate(Rules.findAll, 'query'), Handler.findAll)

export default router
