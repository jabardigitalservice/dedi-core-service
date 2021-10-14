import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Village as Entity } from './village_entity'
import { Village as Service } from './village_service'

const router = express.Router()

router.get(
  '/v1/villages/list-with-location',
  async (req: Request<never, never, never, Entity.RequestQuery>, res: Response, next: NextFunction) => {
    res.status(httpStatus.OK).json(await Service.findAllWithLocation(req.query))
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
