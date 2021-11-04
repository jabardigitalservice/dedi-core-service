import { checkError, uniqueRule } from '../../helpers/rules'
import { Auth as Entity } from './auth_entity'
import { Auth as Repository } from './auth_repository'

export namespace Auth {
  export const signUp = async (requestBody: Entity.RequestBodySignUp) => {
    checkError(await uniqueRule({
      table: 'users',
      key: 'email',
      value: requestBody.email
    }))

    const user: Entity.RequestBodySignUp = {
      name: requestBody.name,
      email: requestBody.email,
      password: Repository.passwordHash(requestBody.password),
      google_id: requestBody.google_id
    }

    user.partner_id = requestBody.partner_id ? await Repository.getPartnerId(requestBody) : null

    return Repository.signUp(user)
  }
}
