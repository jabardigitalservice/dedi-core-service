import logger from '../../helpers/logger'
import { Auth as Entity } from './auth_entity'

export namespace Auth {
  export const signIn = (requestBody: Entity.RequestBodySignIn) => {
    logger({
      level: 'info',
      message: 'user sign in',
      data: {
        email: requestBody.email,
      },
      service: 'auth',
      activity: 'user_sign_in',
    })
  }
}
