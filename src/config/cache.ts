import apicache from 'apicache'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import config from '.'
import redis from './redis'

const options = {
  redisClient: redis,
  defaultDuration: config.get('redis.cache.duration', '30 minutes'),
  appendKey: (req: Request, res: Response) => req.headers.origin,
  statusCodes: {
    include: [httpStatus.OK],
  },
  respectCacheControl: true,
}

export default apicache.options(options).middleware
