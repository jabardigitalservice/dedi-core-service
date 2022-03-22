import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import express, { Application } from 'express'
import helmet from 'helmet'
import config from './config'
import corsOptions from './config/cors'
import { onError } from './handler/exception'
import home from './handler/home'
import { isNodeEnvTest } from './helpers/constant'
import httpTimeout from './middleware/httpTimeout'
import sentryTransaction from './middleware/sentry'
import auth from './modules/auth/auth_http'
import cities from './modules/cities/city_http'
import districts from './modules/districts/district_http'
import files from './modules/files/file_http'
import pages from './modules/pages/page_http'
import partners from './modules/partners/partner_http'
import testimonials from './modules/testimonials/testimonial_http'
import users from './modules/users/user_http'
import villages from './modules/villages/village_http'

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
    this.app.use(cors(corsOptions))
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(sentryTransaction)
    this.app.use(httpTimeout)
  }

  protected handlers(): void {
    this.app.use(auth)
    this.app.use(cities)
    this.app.use(districts)
    this.app.use(files)
    this.app.use(pages)
    this.app.use(partners)
    this.app.use(testimonials)
    this.app.use(users)
    this.app.use(villages)
  }

  protected extends(): void {
    this.app.use(home)
    this.app.use(onError)
  }
}

const { app } = new App()
if (!isNodeEnvTest()) {
  const PORT = config.get('port', 8000)
  app.listen(PORT, () => {
    console.log(`App listening at http://0.0.0.0:${PORT}`)
  })
}

export default app
