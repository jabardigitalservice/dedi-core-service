import { Router } from 'express'
import cache from '../../config/cache'
import { Village as Log } from './village_log';
import { Village as Handler } from './village_handler';
import { Village as Rules } from './village_rules';
import { validate, validateWithDB } from '../../helpers/validator';

const router = Router()

router.get('/v1/villages/with-location', Handler.withLocation)
router.get('/v1/villages/list-with-location', cache(), Log.listWithLocation(), Handler.listWithLocation)
router.get('/v1/villages/suggestion', cache(), Handler.suggestion)
router.post('/v1/villages/questionnaire', validate(Rules.questionnaire), validateWithDB(Rules.questionnaireWithDB), Handler.questionnaire)
router.get('/v1/villages/:id', Handler.findById)

export default router
