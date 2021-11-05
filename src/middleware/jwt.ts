import Jwt from 'express-jwt'
import config from '../config'
import { Request } from 'express'

export default Jwt({
  secret: config.get('jwt.public'),
  algorithms: [config.get('jwt.algorithm')],
  credentialsRequired: true,
  getToken: function fromHeaderOrQuerystring (req: Request) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      return req.query.token
    } else if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token
    }
    return null
  }
})
