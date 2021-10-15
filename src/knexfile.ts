import config from './config'
import path from 'path'

const locationDatabase = {
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, 'database/migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'database/seeds')
  }
}

const databaseConfig = {
  client: config.get('db.connection'),
  connection: {
    host: config.get('db.host'),
    port: config.get('db.port'),
    user: config.get('db.user'),
    password: config.get('db.password'),
    database: config.get('db.database')
  },
  pool: {
    min: Number(config.get('db.pool.min', 10)),
    max: Number(config.get('db.pool.max', 100))
  },
  ...locationDatabase
}

export default {
  development: databaseConfig,
  production: databaseConfig,
  test: {
    client: config.get('db.connection.test'),
    connection: {
      host: config.get('db.host.test'),
      port: config.get('db.port.test'),
      user: config.get('db.user.test'),
      password: config.get('db.password.test'),
      database: config.get('db.database.test')
    },
    ...locationDatabase
  }
}
