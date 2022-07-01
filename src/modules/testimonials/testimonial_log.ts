import { Request, Response, NextFunction } from 'express'
import { customLogger } from '../../helpers/logger'

export namespace TestimonialLog {
  export const findAll = () => (req: Request, res: Response, next: NextFunction) => {
    if (req.query.type) {
      customLogger({
        level: 'info',
        message: 'search by type',
        data: {
          type: req.query.type,
        },
        service: 'testimonials',
        activity: 'search on find all',
      })
    }

    return next()
  }
}
