import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { District as Entity } from './district_entity'
import { DistrictService } from './district_service'

export class DistrictHandler {
  private districtService: DistrictService

  constructor(districtService: DistrictService = new DistrictService()) {
    this.districtService = districtService
  }

  public withLocation = async (
    req: Request<never, never, never, Entity.RequestQueryWithLocation>,
    res: Response
  ) => {
    const result: Entity.ResponseWithLocation = await this.districtService.withLocation(req.query)

    res.status(httpStatus.OK).json(result)
  }

  public suggestion = async (
    req: Request<never, never, never, Entity.RequestQuerySuggestion>,
    res: Response
  ) => {
    const result: Entity.ResponseSuggestion = await this.districtService.suggestion(req.query)

    res.status(httpStatus.OK).json(result)
  }
}
