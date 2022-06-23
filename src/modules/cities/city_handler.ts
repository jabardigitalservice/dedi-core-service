import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { CityEntity } from './city_entity'
import { CityService } from './city_service'

export class CityHandler {
  private cityService: CityService

  constructor(cityService: CityService = new CityService()) {
    this.cityService = cityService
  }

  public withLocation = async (
    req: Request<never, never, never, CityEntity.RequestQueryWithLocation>,
    res: Response
  ) => {
    const result: CityEntity.ResponseWithLocation = await this.cityService.withLocation(req.query)

    return res.status(httpStatus.OK).json(result)
  }

  public suggestion = async (
    req: Request<never, never, never, CityEntity.RequestQuerySuggestion>,
    res: Response
  ) => {
    const result: CityEntity.ResponseSuggestion = await this.cityService.suggestion(req.query)

    return res.status(httpStatus.OK).json(result)
  }
}
