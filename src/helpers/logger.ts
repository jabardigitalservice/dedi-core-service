import winston from 'winston'
import 'winston-mongodb'
import config from '../config';
import { isNodeEnvTest } from './constant';

interface Log {
  level: string
  message: string
  data: object
  service: string
  activity: string
}

const logger = winston.createLogger()

if (config.get('mongo.connection') && !isNodeEnvTest()) {
  const configMongo = {
    db: config.get('mongo.connection'),
    collection: config.get('log.mongo.collection'),
    capped: true,
    options: {
      useUnifiedTopology: true,
    },
    metaKey: 'meta',
  }
  logger.add(new winston.transports.MongoDB(configMongo))
}

if (isNodeEnvTest()) {
  logger.add(new winston.transports.Console())
}

export default (log: Log) => {
  logger[log.level]({
    message: log.message,
    meta: {
      data: log.data,
      service: log.service,
      activity: log.activity,
    },
  })
}
