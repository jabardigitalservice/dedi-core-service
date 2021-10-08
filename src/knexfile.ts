import config from './config'
import path from 'path'

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
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, 'database/migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'database/seeds')
  }
}

export default {
  development: databaseConfig,
  production: databaseConfig,
  test: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, 'database/local.sqlite')
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'migrations',
      directory: path.join(__dirname, 'database/migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'database/seeds')
    }
  }
}
