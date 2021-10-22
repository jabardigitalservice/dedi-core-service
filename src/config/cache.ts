import apicache from 'apicache'
import httpStatus from 'http-status'
import redis from './redis'

const options = {
  redisClient: redis.default,
  defaultDuration: '1 hour',
  statusCodes: {
    include: [httpStatus.OK]
  },
}

export default apicache.options(options).middleware
