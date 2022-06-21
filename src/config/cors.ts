import { CorsOptions } from 'cors'
import httpStatus from 'http-status'
import config from '.'
import { HttpError } from '../handler/exception'
import { isNodeEnvTest } from '../helpers/constant'
import lang from '../lang'

const whitelist = () => {
  const appOrigin: string = config.get('app.origin')

  let origins: string[] = []

  if (appOrigin) {
    origins = appOrigin.split(',')
  }

  return origins
}

const originOptions: CorsOptions = {
  origin(origin, callback) {
    if (isNodeEnvTest() || whitelist().find((value) => origin.includes(value))) {
      callback(null, true)
    } else {
      callback(new HttpError(httpStatus.FORBIDDEN, lang.__('error.cors')))
    }
  },
}

export default originOptions
