import httpStatus from 'http-status'
import config from '.'
import { HttpError } from '../handler/exception'
import { isNodeEnvTest } from '../helpers/constant'
import lang from '../lang'

const whitelist = () => {
  const appOrigin = config.get('app.origin')

  let origins: string[] = []

  if (appOrigin) {
    origins = appOrigin.trim().split(',')
  }

  return origins
}

export default {
  origin(origin: any, callback: any) {
    if (isNodeEnvTest() || !origin || whitelist().indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new HttpError(httpStatus.FORBIDDEN, lang.__('error.cors')))
    }
  },
}
