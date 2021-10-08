import bodyParser from 'body-parser'
import express, { Application } from 'express'
import config from './config'
import { onError } from './handler/exception'
import sentryTransaction from './middleware/sentry'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import database from './config/database'

class App {
  public app: Application

  constructor () {
    this.app = express()
    this.plugins()
    this.handlers()
    this.extends()
  }

  protected plugins (): void {
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())
    this.app.use(cors())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(morgan('dev'))
    this.app.use(sentryTransaction)
  }

  protected handlers (): void {
    // this.app.use('/api', example)
  }

  protected extends (): void {
    this.app.use(onError)
  }
}

async function checkDatabaseConnection () {
  return database.raw('select 1+1 as result')
    .catch((err) => {
      console.log(err.message)
      process.exit(1)
    })
}

(async () => {
  await checkDatabaseConnection()
  const app = new App().app
  const PORT = config.get('port')
  app.listen(PORT, () => {
    console.log(`App listening at http://0.0.0.0:${PORT}`)
  })
})()
