import sentry from '../config/sentry'
import { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
  const transaction = sentry.startTransaction({
    op: 'transaction',
    name: req.url
  })

  sentry.configureScope(scope => {
    scope.setSpan(transaction)
  })

  res.on('finish', function () {
    transaction.finish()
  })

  next()
}
