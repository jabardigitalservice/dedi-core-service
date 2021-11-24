import { Request, Response, NextFunction } from 'express'
import logger from '../../helpers/logger'

export namespace City {
  const searchBy = (req: Request): string => {
    const result = []

    if (req.query.name) result.push('name')

    return result.join(', ')
  }

  export const findAll = () => (req: Request, res: Response, next: NextFunction) => {
    if (req.query.name) {
      logger({
        level: 'info',
        message: `search by ${searchBy(req)}`,
        data: {
          name: req.query.name,
        },
        service: 'cities',
        activity: 'search',
      })
    }

    next()
  }
}
