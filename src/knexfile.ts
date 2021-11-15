import path from 'path'
import config from './config'

const locationDatabase = {
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, 'database/migrations'),
  },
  seeds: {
    directory: path.join(__dirname, 'database/seeds'),
  },
}

const databaseConfig = {
  client: config.get('db.connection'),
  connection: {
    host: config.get('db.host'),
    port: config.get('db.port'),
    user: config.get('db.user'),
    password: config.get('db.password'),
    database: config.get('db.database'),
  },
  pool: {
    min: Number(config.get('db.pool.min', 0)),
    max: Number(config.get('db.pool.max', 100)),
  },
  ...locationDatabase,
}

export default {
  development: databaseConfig,
  production: databaseConfig,
  test: {
    client: config.get('test.db.connection', 'mysql'),
    connection: {
      host: config.get('test.db.host'),
      port: config.get('test.db.port'),
      user: config.get('test.db.user'),
      password: config.get('test.db.password'),
      database: config.get('test.db.database'),
    },
    ...locationDatabase,
  },
}
