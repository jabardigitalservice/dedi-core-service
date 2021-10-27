import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import cache from '../../config/cache'
import { Village as Entity } from './village_entity'
import { Village as Log } from './village_log';
import { Village as Service } from './village_service';

const router = express.Router()

router.get(
  '/v1/villages/list-with-location',
  Log.findAll(),
  cache(),
  async (req: Request<never, never, never, Entity.RequestQuery>, res: Response, next: NextFunction) => {
    const result: Entity.ResponseFindAllWithLocation = await Service.findAllWithLocation(req.query)

    res.status(httpStatus.OK).json(result)
  })
  router.get(

  '/v1/villages/search',
  async (req: Request<never, never, never, Entity.RequestQuerySearch>, res: Response, next: NextFunction) => {
    const result: Entity.ResponseSearch = await Service.search(req.query)

    res.status(httpStatus.OK).json(result)
  })

router.get(
  '/v1/villages/:id',
  async (req: Request<Entity.RequestParamFindById, never, never, never>, res: Response, next: NextFunction) => {
    try {
      const result: Entity.ResponseFindById = await Service.findById(req.params)

      res.status(httpStatus.OK).json(result)
    } catch (err) {
      next(err)
    }
  }
)

export default router
