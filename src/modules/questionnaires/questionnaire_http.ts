import { Router } from 'express'
import { QuestionnaireHandler } from './questionnaire_handler'
import { QuestionnaireRules } from './questionnaire_rules'
import { validate, validateWithDB } from '../../helpers/validator'
import { QuestionnaireAccess } from './questionnaire_access'
import { verifyAccessToken } from '../../middleware/jwt'

const questionnaireHandler = new QuestionnaireHandler()

const router = Router()

router.post(
  '/v1/questionnaires',
  validate(QuestionnaireRules.store),
  validateWithDB(QuestionnaireRules.storeWithDB),
  questionnaireHandler.store
)

router.get(
  '/v1/questionnaires',
  verifyAccessToken,
  QuestionnaireAccess.findAll(),
  validate(QuestionnaireRules.findAll, 'query'),
  questionnaireHandler.findAll
)

export default router
