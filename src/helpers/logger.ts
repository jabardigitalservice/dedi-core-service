import winston from 'winston'
import 'winston-mongodb'
import config from '../config';

const mongo = {
  db: config.get('mongo.connection'),
  collection: config.get('log.mongo.collection'),
  capped: true,
  options: {
    useUnifiedTopology: true
  },
  metaKey: 'meta'
}

const logger = winston.createLogger()

if (config.get('node.env') !== 'test') {
  logger.add(new winston.transports.MongoDB(mongo))
}

if (config.get('node.env') !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.prettyPrint({
      colorize: true,
    })
  }));
}

interface log {
  level: string
  message: string
  data: object
  service: string
  activity: string
}

export default (log: log) => {
  logger[log.level]({
    message: log.message,
    meta: {
      data: log.data,
      service: log.service,
      activity: log.activity
    }
  })
}
