import bodyParser from 'body-parser'
import express, { Application } from 'express'
import config from './config'
import { onError } from './handler/exception'
import sentryTransaction from './middleware/sentry'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import home from './handler/home'
import partners from './modules/partners/partner_handler'
import villages from './modules/villages/village_handler'

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
    this.app.use(sentryTransaction)
  }

  protected handlers (): void {
    this.app.use(home)
    this.app.use(partners)
    this.app.use(villages)
  }

  protected extends (): void {
    this.app.use(onError)
  }
}

const app = new App().app
if (config.get('node.env') !== 'test') {
  const PORT = config.get('port')
  app.listen(PORT, () => {
    console.log(`App listening at http://0.0.0.0:${PORT}`)
  })
}

export default app
