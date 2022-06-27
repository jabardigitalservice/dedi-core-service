import apicache, { Options } from 'apicache'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import config from '.'
import redis from './redis'

interface OptionsApiCache extends Options {
  respectCacheControl: boolean
}

const options: OptionsApiCache = {
  redisClient: redis,
  defaultDuration: config.get('redis.cache.duration', '5 minutes'),
  appendKey: (req: Request, res: Response) => req.headers.origin,
  statusCodes: {
    include: [httpStatus.OK],
  },
  respectCacheControl: true,
}

export default apicache.options(options).middleware
