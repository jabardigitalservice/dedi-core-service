import { Request, Response, NextFunction } from 'express'
import logger from '../../helpers/logger'

export namespace Testimonial {
  export const findAll = () => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.query.type) {
        logger({
          level: 'info',
          message: 'search by type',
          data: {
            type: req.query.type
          },
          service: 'testimonials',
          activity: 'search'
        })
      }

      next()
    }
  }
}
