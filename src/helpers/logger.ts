import winston from 'winston'
import { MongoDBConnectionOptions } from 'winston-mongodb'
import newrelicFormatter from '@newrelic/winston-enricher'
import config from '../config'

const newrelicWinstonFormatter = newrelicFormatter(winston)

interface Log {
  level: string
  message: string
  data: object
  service: string
  activity: string
}

const logger = winston.createLogger({
  format: winston.format.combine(newrelicWinstonFormatter()),
})

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

const customLogger = (log: Log) => {
  logger[log.level]({
    message: log.message,
    meta: {
      data: log.data,
      service: log.service,
      activity: log.activity,
    },
  })
}

export { customLogger, logger }
