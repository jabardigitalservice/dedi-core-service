import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { QuestionnaireService } from './questionnaire_service'

export class QuestionnaireHandler {
  private questionnaireService: QuestionnaireService

  constructor(questionnaireService: QuestionnaireService = new QuestionnaireService()) {
    this.questionnaireService = questionnaireService
  }

  public questionnaire = async (req: Request, res: Response) => {
    this.questionnaireService.questionnaire(req.body)
    return res.status(httpStatus.CREATED).json({ message: 'CREATED' })
  }
}
