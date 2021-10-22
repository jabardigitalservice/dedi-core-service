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
    afterCreate: function (conn, done) {
      // in this example we use pg driver's connection API
      conn.query('select 1+1 as result', function (err) {
        if (err) {
          // first query failed, return error and don't try to make next query
          done(err, conn);
        } else {
          // do the second query...
          conn.query('select 1+1 as result', function (err) {
            // if err is not falsy, connection is discarded from pool
            // if connection aquire was triggered by a query the error is passed to query promise
            done(err, conn);
          });
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
