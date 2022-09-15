import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { QuestionnaireEntity } from './questionnaire_entity'
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

  public findAll = async (
    req: Request<never, never, never, QuestionnaireEntity.RequestQueryFindAll>,
    res: Response
  ) => {
    const result: QuestionnaireEntity.ResponseFindAll = await this.questionnaireService.findAll(
      req.query
    )
    return res.status(httpStatus.OK).json(result)
  }

  public findById = async (req: Request, res: Response) => {
    const { id } = req.params
    const result: QuestionnaireEntity.ResponseFindById = await this.questionnaireService.findById(
      id
    )
    return res.status(httpStatus.OK).json(result)
  }
}
