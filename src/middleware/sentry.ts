import { Request, Response, NextFunction } from 'express'
import sentry from '../config/sentry'

export default (req: Request, res: Response, next: NextFunction) => {
  const transaction = sentry.startTransaction({
    op: 'transaction',
    name: req.url,
  })

  sentry.configureScope((scope) => {
    scope.setSpan(transaction)
  })

  res.on('finish', () => {
    transaction.finish()
  })

  next()
}
