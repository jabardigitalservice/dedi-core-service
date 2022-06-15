import { v4 as uuidv4 } from 'uuid'
import { Auth as Entity } from './auth_entity';

export namespace Auth {
  const { Partners, Users, OauthTokens } = Entity

  export const createPartner = (partner: Entity.PartnerCreate) => Partners().insert({
    ...partner,
    created_at: new Date(),
  })

  const isPartnerIdNotExist = async (requestBody: Entity.RequestBodySignUp) => {
    const partner = Partners()
      .select('id')
      .where('id', requestBody.partner_id)
      .orWhere('name', requestBody.company)
      .whereNull('deleted_at')
      .first()

    return !requestBody.partner_id || !await partner
  }

  export const getPartnerId = async (requestBody: Entity.RequestBodySignUp) => {
    const Partner: Entity.PartnerCreate = {
      id: uuidv4(),
      name: requestBody.company,
    }

    if (requestBody.company && await isPartnerIdNotExist(requestBody)) {
      await createPartner(Partner)
      return Partner.id
    }

    return requestBody.partner_id
  }

  export const signUp = (requestBody: Entity.RequestBodySignUp) => Users().insert({
    id: uuidv4(),
    created_at: new Date(),
    ...requestBody,
  })

  export const findByEmail = (requestBody: Entity.FindByEmail) => Users()
    .where('email', requestBody.email)
    .first()

  export const findByUserId = (id: string) => Users()
    .where('id', id)
    .first()

  export const findByRefreshToken = (requestBody: Entity.RequestBodyRefreshToken) => OauthTokens()
    .select('users.id', 'partner_id', 'is_admin', 'users.is_active')
    .join('users', 'users.id', 'oauth_tokens.user_id')
    .where('refresh_token', requestBody.refresh_token)
    .first()

  export const deleteOauthbyRefreshToken = (requestBody: Entity.RequestBodyRefreshToken) => OauthTokens()
    .where('refresh_token', requestBody.refresh_token)
    .delete()

  export const createOauthToken = (oauthToken: Entity.StructOauthToken) => OauthTokens().insert({
    id: uuidv4(),
    created_at: new Date(),
    ...oauthToken,
  })

  export const updateRefreshToken = (refreshToken: string, oauthToken: Entity.StructOauthToken) => OauthTokens()
    .where('refresh_token', '=', refreshToken)
    .update({
      ...oauthToken,
      updated_at: new Date(),
    })

  export const updatePassword = (id: string, password: string) => Users()
    .where('id', id)
    .update({ password })

  export const updateLastLoginAt = (id: string) => Users()
    .where('id', id)
    .update({ last_login_at: new Date() })
}
