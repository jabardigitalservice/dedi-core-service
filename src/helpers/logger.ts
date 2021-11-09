import winston from 'winston'
import 'winston-mongodb'
import config from '../config';
import { ElasticsearchTransport } from 'winston-elasticsearch'
import moment from 'moment';

const mongo = {
  db: config.get('mongo.connection'),
  collection: config.get('log.mongo.collection'),
  capped: true,
  options: {
    useUnifiedTopology: true
  },
  metaKey: 'meta'
}

const elastic = {
  clientOpts: {
    cloud: {
      id: config.get('elastic.cloud.id')
    },
    auth: {
      apiKey: config.get('elastic.api.key')
    },
    node: config.get('elastic.url'),
    nodes: config.get('elastic.url')
  },
  index: `${config.get('log.elastic.index')}-${moment().format('YYYY.MM.DD')}`
}

const logger = winston.createLogger()

if (
  config.get('mongo.connection') &&
  config.get('node.env') !== 'test'
) {
  logger.add(new winston.transports.MongoDB(mongo))
}

if (config.get('node.env') === 'test') {
  logger.add(new winston.transports.Console())
}

if (config.get('elastic.cloud.id')) {
  logger.add(new ElasticsearchTransport(elastic))
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
