import { customLogger } from '../../helpers/logger'
import { AuthEntity } from './auth_entity'

export namespace AuthLog {
  export const signIn = (request: AuthEntity.RequestBodySignIn) => {
    customLogger({
      level: 'info',
      message: 'sign in service auth',
      data: {
        email: request.email,
      },
      service: 'auth',
      activity: 'user_sign_in',
    })
  }
}
