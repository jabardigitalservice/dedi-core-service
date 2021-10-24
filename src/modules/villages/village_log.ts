import { Request, Response, NextFunction } from 'express'
import { Village as Entity } from './village_entity'
import logger from '../../helpers/logger'

export namespace Village {
  const searchBy = (req: Request<any, any, any, Entity.RequestQuery>): string => {
    const result = []

    if (req.query.name) result.push('name')
    if (req.query.level) result.push('level')

    return result.join(', ')
  }

  export const findAll = () => {
    return (req: Request<any, any, any, Entity.RequestQuery>, res: Response, next: NextFunction) => {
      if (req.query.name || req.query.level) {
        logger({
          level: 'info',
          message: `search by ${searchBy(req)}`,
          data: {
            name: req.query.name,
            level: req.query.level,
          },
          service: 'village',
          activity: 'search',
        })
      }

      next()
    }
  }
}
