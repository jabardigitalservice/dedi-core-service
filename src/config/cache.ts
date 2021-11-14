import apicache from 'apicache'
import httpStatus from 'http-status'
import config from '.'
import redis from './redis'

const options = {
  redisClient: redis,
  defaultDuration: config.get('redis.cache.duration', '15 minutes'),
  statusCodes: {
    include: [httpStatus.OK],
  },
}

export default apicache.options(options).middleware
