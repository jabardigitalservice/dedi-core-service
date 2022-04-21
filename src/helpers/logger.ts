import winston from 'winston'
import { MongoDBConnectionOptions } from 'winston-mongodb'
import config from '../config';

interface Log {
  level: string
  message: string
  data: object
  service: string
  activity: string
}

const logger = winston.createLogger()

logger.add(new winston.transports.Console())

if (config.get('mongo.connection')) {
  const configMongo: MongoDBConnectionOptions = {
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
