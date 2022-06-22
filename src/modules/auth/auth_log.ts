import logger from '../../helpers/logger'
import { AuthEntity } from './auth_entity'

export namespace AuthLog {
  export const signIn = (request: AuthEntity.RequestBodySignIn) => {
    logger({
      level: 'info',
      message: 'user sign in',
      data: {
        email: request.email,
      },
      service: 'auth',
      activity: 'user_sign_in',
    })
  }
}
