import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import config from '../config'
import database from '../config/database'
import lang from '../lang'
import { HttpError } from './exception'

const router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await database.raw('select 1+1 as result')
    return res.status(httpStatus.OK).json({
      appName: config.get('app.name'),
      hostName: req.headers.host,
    })
  } catch (error) {
    return next(error)
  }
})

router.all('*', async (req: Request, res: Response, next: NextFunction) =>
  next(new HttpError(httpStatus.NOT_FOUND, lang.__('route.not.found')))
)

export default router
