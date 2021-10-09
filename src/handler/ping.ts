import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import database from '../config/database'

const router = express.Router()

router.get('/ping', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await database.raw('select 1+1 as result')
    res.status(httpStatus.OK).json({ message: 'Connection DB is Ready' })
  } catch (error) {
    next(error)
  }
})

export default router
