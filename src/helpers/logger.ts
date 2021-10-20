import winston from 'winston'
import 'winston-mongodb'
import config from '../config';

const mongo = {
  db: config.get('log.mongo.connection'),
  collection: config.get('log.mongo.collection'),
  capped: true,
  options: {
    useUnifiedTopology: true
  },
  metaKey: 'meta'
}

const logger = winston.createLogger()

if (config.get('node.env') !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.prettyPrint({
      colorize: true,
    })
  }));
}

if (config.get('node.env') !== 'test') {
  logger.add(new winston.transports.MongoDB(mongo))
}

export default logger
