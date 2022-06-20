import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { VillageEntity } from './village_entity'
import { VillageService } from './village_service'

export class VillageHandler {
  private villageService: VillageService

  constructor(villageService: VillageService = new VillageService()) {
    this.villageService = villageService
  }

  public withLocation = async (
    req: Request<never, never, never, VillageEntity.RequestQueryWithLocation>,
    res: Response
  ) => {
    const result: VillageEntity.ResponseWithLocation = await this.villageService.withLocation(
      req.query
    )

    res.status(httpStatus.OK).json(result)
  }

  public listWithLocation = async (
    req: Request<never, never, never, VillageEntity.RequestQueryListWithLocation>,
    res: Response
  ) => {
    const result: VillageEntity.ResponseListWithLocation =
      await this.villageService.listWithLocation(req.query)

    res.status(httpStatus.OK).json(result)
  }

  public findById = async (
    req: Request<VillageEntity.RequestParamFindById, never, never, never>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result: VillageEntity.ResponseFindById = await this.villageService.findById(req.params)

      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  public questionnaire = async (req: Request, res: Response) => {
    this.villageService.questionnaire(req.body)
    res.status(httpStatus.CREATED).json({ message: 'CREATED' })
  }

  public suggestion = async (
    req: Request<VillageEntity.RequestParamFindById, never, never, never>,
    res: Response
  ) => {
    const result: VillageEntity.ResponseSuggestion = await this.villageService.suggestion(req.query)
    res.status(httpStatus.OK).json(result)
  }

  public checkRegistered = async (
    req: Request<VillageEntity.RequestParamFindById, never, never, never>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.villageService.checkRegistered(req.params)
      res.status(httpStatus.OK).json({ message: 'Available' })
    } catch (error) {
      next(error)
    }
  }
}
