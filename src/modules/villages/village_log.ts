import { Request, Response, NextFunction } from 'express'
import logger from '../../helpers/logger'
require('polyfill-object.fromentries');

export namespace Village {
  export const findAll = () => {
    return (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
      const nonEmptyRequestQuery = Object.fromEntries(
        Object.entries(req.query).filter(
          ([key, val]) => val !== null && val !== ''
        )
      );

      if (Object.keys(nonEmptyRequestQuery).length > 0) {
        const obj = logger({
          level: 'info',
          message: 'find all with request query',
          data: {
            ...nonEmptyRequestQuery
          },
          service: 'village',
          activity: 'findAll',
        })
        console.log('obj :>> ', obj);
      }

      next()
    }
  }
}
