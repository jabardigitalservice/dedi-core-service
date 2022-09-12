import { Router } from 'express'
import cache from '../../config/cache'
import { QuestionnaireHandler } from './questionnaire_handler'
import { QuestionnaireRules } from './questionnaire_rules'
import { validate, validateWithDB } from '../../helpers/validator'
import { QuestionnaireAccess } from './questionnaire_access'
import { verifyAccessToken } from '../../middleware/jwt'

const questionnaireHandler = new QuestionnaireHandler()

const router = Router()

router.post(
  '/v1/villages/questionnaire',
  validate(QuestionnaireRules.questionnaire),
  validateWithDB(QuestionnaireRules.questionnaireWithDB),
  questionnaireHandler.questionnaire
)

export default router
