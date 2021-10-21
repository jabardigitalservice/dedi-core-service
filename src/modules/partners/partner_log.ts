import { Request, Response, NextFunction } from 'express'
import logger from '../../helpers/logger'

export namespace Partner{
  export const findAll = () => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (Object.keys(req.query).length) {
        logger({
          level: 'info',
          message: 'find all with request query',
          data: {
            ...req.query
          },
          service: 'partner',
          activity: 'findAll'
        })
      }

      next()
    }
  }
}
