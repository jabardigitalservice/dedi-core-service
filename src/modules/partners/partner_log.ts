import { Request, Response, NextFunction } from 'express'
import logger from '../../helpers/logger'

export namespace Partner{
  export const findAll = () => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.query.name) {
        logger({
          level: 'info',
          message: 'search with name',
          data: {
            name: req.query.name
          },
          service: 'partners',
          activity: 'search'
        })
      }

      next()
    }
  }
}
