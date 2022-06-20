import { v4 as uuidv4 } from 'uuid'
import database from '../../config/database'
import { AuthEntity } from './auth_entity'

export class AuthRepository {
  private Users = () => database<AuthEntity.StructUser>('users')

  private Partners = () => database<AuthEntity.StructPartner>('partners')

  private OauthTokens = () => database<AuthEntity.StructOauthToken>('oauth_tokens')

  public createPartner = (partner: AuthEntity.PartnerCreate) =>
    this.Partners().insert({
      ...partner,
      created_at: new Date(),
    })

  private isPartnerIdNotExist = async (request: AuthEntity.RequestBodySignUp) => {
    const partner = this.Partners()
      .select('id')
      .where('id', request.partner_id)
      .orWhere('name', request.company)
      .whereNull('deleted_at')
      .first()

    return !request.partner_id || !(await partner)
  }

  public getPartnerId = async (request: AuthEntity.RequestBodySignUp) => {
    const Partner: AuthEntity.PartnerCreate = {
      id: uuidv4(),
      name: request.company,
    }

    if (request.company && (await this.isPartnerIdNotExist(request))) {
      await this.createPartner(Partner)
      return Partner.id
    }

    return request.partner_id
  }

  public signUp = (requestBody: AuthEntity.RequestBodySignUp) =>
    this.Users().insert({
      id: uuidv4(),
      created_at: new Date(),
      ...requestBody,
    })

  public findByEmail = (requestBody: AuthEntity.FindByEmail) =>
    this.Users().where('email', requestBody.email).first()

  public findByUserId = (id: string) => this.Users().where('id', id).first()

  public findByRefreshToken = (requestBody: AuthEntity.RequestBodyRefreshToken) =>
    this.OauthTokens()
      .select('users.id', 'partner_id', 'is_admin', 'users.is_active')
      .join('users', 'users.id', 'oauth_tokens.user_id')
      .where('refresh_token', requestBody.refresh_token)
      .first()

  public deleteOauthbyRefreshToken = (requestBody: AuthEntity.RequestBodyRefreshToken) =>
    this.OauthTokens().where('refresh_token', requestBody.refresh_token).delete()

  public createOauthToken = (oauthToken: AuthEntity.StructOauthToken) =>
    this.OauthTokens().insert({
      id: uuidv4(),
      created_at: new Date(),
      ...oauthToken,
    })

  public updateRefreshToken = (refreshToken: string, oauthToken: AuthEntity.StructOauthToken) =>
    this.OauthTokens()
      .where('refresh_token', '=', refreshToken)
      .update({
        ...oauthToken,
        updated_at: new Date(),
      })

  public updatePassword = (id: string, password: string) =>
    this.Users().where('id', id).update({ password })

  public updateLastLoginAt = (id: string) =>
    this.Users().where('id', id).update({ last_login_at: new Date() })
}
