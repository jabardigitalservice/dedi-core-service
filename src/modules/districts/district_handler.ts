import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { DistrictEntity } from './district_entity'
import { DistrictService } from './district_service'

export class DistrictHandler {
  private districtService: DistrictService

  constructor(districtService: DistrictService = new DistrictService()) {
    this.districtService = districtService
  }

  public withLocation = async (
    req: Request<never, never, never, DistrictEntity.RequestQueryWithLocation>,
    res: Response
  ) => {
    const result: DistrictEntity.ResponseWithLocation = await this.districtService.withLocation(
      req.query
    )

    return res.status(httpStatus.OK).json(result)
  }

  public suggestion = async (
    req: Request<never, never, never, DistrictEntity.RequestQuerySuggestion>,
    res: Response
  ) => {
    const result: DistrictEntity.ResponseSuggestion = await this.districtService.suggestion(
      req.query
    )

    return res.status(httpStatus.OK).json(result)
  }
}
