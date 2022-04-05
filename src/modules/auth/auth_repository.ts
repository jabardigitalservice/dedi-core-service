import { v4 as uuidv4 } from 'uuid'
import database from '../../config/database';
import { Auth as Entity } from './auth_entity';
import bcryptRounds from '../../config/bcryptRounds';

export namespace Auth {
  export const Users = () => database<Entity.StructUser>('users')
  export const Partners = () => database<Entity.StructPartner>('partners')
  export const OauthTokens = () => database<Entity.StructOauthToken>('oauth_tokens')

  export const createPartner = async (partner: Entity.PartnerCreate) => Partners().insert({
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
      createPartner(Partner)
      return Partner.id
    }

    return requestBody.partner_id
  }

  export const signUp = async (requestBody: Entity.RequestBodySignUp) => Users().insert({
    id: uuidv4(),
    created_at: new Date(),
    ...requestBody,
  })

  export const findByEmail = async (requestBody: Entity.FindByEmail) => Users()
    .where('email', requestBody.email)
    .first()

  export const findByUserId = async (id: string) => Users()
    .where('id', id)
    .first()

  export const findByRefreshToken = async (requestBody: Entity.RequestBodyRefreshToken) => OauthTokens()
    .select('users.id', 'partner_id', 'is_admin', 'users.is_active')
    .join('users', 'users.id', 'oauth_tokens.user_id')
    .where('refresh_token', requestBody.refresh_token)
    .first()

  export const deleteOauthbyRefreshToken = async (requestBody: Entity.RequestBodyRefreshToken) => OauthTokens()
    .where('refresh_token', requestBody.refresh_token)
    .delete()

  export const createOauthToken = async (oauthToken: Entity.StructOauthToken) => OauthTokens().insert({
    id: uuidv4(),
    created_at: new Date(),
    ...oauthToken,
  })

  export const updateRefreshToken = async (refreshToken: string, oauthToken: Entity.StructOauthToken) => OauthTokens()
    .where('refresh_token', '=', refreshToken)
    .update({
      ...oauthToken,
      updated_at: new Date(),
    })

  export const updatePassword = async (id: string, password: string) => Users()
    .where('id', id)
    .update({ password })

  export const updateLastLoginAt = async (id: string) => Users()
    .where('id', id)
    .update({ last_login_at: new Date() })
}
