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
    max: Number(config.get('db.pool.max', 100)),
    afterCreate: function (conn: any, done: any) {
      conn.query('select 1+1 as result', function (err: any) {
        if (err) {
          done(err, conn);
        }
      });
    }
  },
  acquireConnectionTimeout: 10000,
  ...locationDatabase
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
      database: config.get('test.db.database')
    },
    ...locationDatabase
  }
}
