import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import config from '../config'
import database from '../config/database'
import { uploadLocalSingle } from '../helpers/upload'

const router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await database.raw('select 1+1 as result')
    res.status(httpStatus.OK).json({
      appName: config.get('app.name'),
      hostName: req.headers.host
    })
  } catch (error) {
    next(error)
  }
})

router.post('/upload-s3', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await uploadLocalSingle({
      req,
      res,
      fieldName: 'images'
    })
    res.status(httpStatus.OK).json(file)
  } catch (error) {
    next(error)
  }
})

export default router
