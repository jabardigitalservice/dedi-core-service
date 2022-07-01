import { Request, Response, NextFunction } from 'express'
import { customLogger } from '../../helpers/logger'

export namespace PartnerLog {
  export const findAll = () => (req: Request, res: Response, next: NextFunction) => {
    if (req.query.name) {
      customLogger({
        level: 'info',
        message: 'search by name',
        data: {
          name: req.query.name,
        },
        service: 'partners',
        activity: 'search on find all',
      })
    }

    return next()
  }
}
