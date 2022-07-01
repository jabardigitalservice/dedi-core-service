import { Request, Response, NextFunction } from 'express'
import { customLogger } from '../../helpers/logger'

export namespace VillageLog {
  const searchBy = (req: Request): string => {
    const result = []

    if (req.query.name) result.push('name')
    if (req.query.level) result.push('level')

    return result.join(', ')
  }

  export const listWithLocation = () => (req: Request, res: Response, next: NextFunction) => {
    if (req.query.name || req.query.level) {
      customLogger({
        level: 'info',
        message: `search by ${searchBy(req)}`,
        data: {
          name: req.query.name,
          level: req.query.level,
        },
        service: 'villages',
        activity: 'search on list with location',
      })
    }

    return next()
  }
}
