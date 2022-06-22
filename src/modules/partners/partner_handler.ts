import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { PartnerEntity } from './partner_entity'
import { PartnerService } from './partner_service'

export class PartnerHandler {
  private partnerService: PartnerService

  constructor(partnerService: PartnerService = new PartnerService()) {
    this.partnerService = partnerService
  }

  public findAll = async (
    req: Request<never, never, never, PartnerEntity.RequestQuery>,
    res: Response
  ) => {
    const result: PartnerEntity.ResponseFindAll = await this.partnerService.findAll(req.query)

    res.status(httpStatus.OK).json(result)
  }

  public suggestion = async (
    req: Request<never, never, never, PartnerEntity.RequestQuerySuggestion>,
    res: Response
  ) => {
    const result: PartnerEntity.ResponseSuggestion = await this.partnerService.suggestion(req.query)

    res.status(httpStatus.OK).json(result)
  }
}
