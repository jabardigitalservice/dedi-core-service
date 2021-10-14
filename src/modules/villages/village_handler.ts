import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import { Village as Entity } from './village_entity'
import { Village as Service } from './village_service'

const router = express.Router()

router.get(
  '/v1/villages/list-with-location',
  async (req: Request<never, never, never, Entity.RequestQuery>, res: Response, next: NextFunction) => {
    console.log('masuk')
    res.status(httpStatus.OK).json(await Service.findAllWithLocation(req.query))
  })

router.get(
  '/v1/villages/:id',
  async (req: Request<never, never, never, Entity.RequestQuery>, res: Response, next: NextFunction) => {
    try {
      res
        .status(httpStatus.OK)
        .json(await Service.findById(req.params))
    } catch (err) {
      if (err instanceof HttpError) {
        res
          .status(err.code)
          .json({ error: err.message })
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
)

export default router
