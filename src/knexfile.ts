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
    client: config.get('db.connection.test', 'mysql'),
    connection: {
      host: config.get('db.host.test', '127.0.0.1'),
      port: config.get('db.port.test', '3306'),
      user: config.get('db.user.test', 'root'),
      password: config.get('db.password.test', 'root'),
      database: config.get('db.database.test', 'dedi_test')
    },
    ...locationDatabase
  }
}
