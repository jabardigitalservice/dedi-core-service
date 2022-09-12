import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { QuestionnaireService } from './questionnaire_service'

export class QuestionnaireHandler {
  private questionnaireService: QuestionnaireService

  constructor(questionnaireService: QuestionnaireService = new QuestionnaireService()) {
    this.questionnaireService = questionnaireService
  }

  public store = async (req: Request, res: Response) => {
    this.questionnaireService.store(req.body)
    return res.status(httpStatus.CREATED).json({ message: 'CREATED' })
  }
}
