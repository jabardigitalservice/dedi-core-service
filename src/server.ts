import bodyParser from 'body-parser'
import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import sentryTransaction from './middleware/sentry'
import { onError } from './handler/exception'
import config from './config'
import home from './handler/home'
import partners from './modules/partners/partner_handler'
import villages from './modules/villages/village_http'
import districts from './modules/districts/district_http'
import cities from './modules/cities/city_http'
import testimonials from './modules/testimonials/testimonial_http'
import auth from './modules/auth/auth_http'
import httpTimeout from './middleware/httpTimeout'

class App {
  public app: Application

  constructor() {
    this.app = express()
    this.plugins()
    this.handlers()
    this.extends()
  }

  protected plugins(): void {
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())
    this.app.use(cors())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(sentryTransaction)
    this.app.use(httpTimeout)
  }

  protected handlers(): void {
    this.app.use(home)
    this.app.use(partners)
    this.app.use(villages)
    this.app.use(cities)
    this.app.use(districts)
    this.app.use(testimonials)
    this.app.use(auth)
  }

  protected extends(): void {
    this.app.use(onError)
  }
}

const { app } = new App()
if (config.get('node.env') !== 'test') {
  const PORT = config.get('port')
  app.listen(PORT, () => {
    console.log(`App listening at http://0.0.0.0:${PORT}`)
  })
}

export default app
