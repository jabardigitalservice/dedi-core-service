import { Request, Response, NextFunction } from 'express'
import logger from '../../helpers/logger'

export namespace PartnerLog {
  export const findAll = () => (req: Request, res: Response, next: NextFunction) => {
    if (req.query.name) {
      logger({
        level: 'info',
        message: 'search by name',
        data: {
          name: req.query.name,
        },
        service: 'partners',
        activity: 'search',
      })
    }

    return next()
  }
}
