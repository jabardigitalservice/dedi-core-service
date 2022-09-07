import { v4 as uuidv4 } from 'uuid'
import database from '../../config/database'
import { StatusUser } from '../../helpers/constant'
import { AuthEntity } from './auth_entity'

export class AuthRepository {
  private Users = () => database<AuthEntity.User>('users')

  private Partners = () => database<AuthEntity.Partner>('partners')

  private OauthTokens = () => database<AuthEntity.OauthToken>('oauth_tokens')

  public createPartner = (partner: AuthEntity.PartnerCreate) =>
    this.Partners().insert({
      ...partner,
      created_at: new Date(),
    })

  private isPartnerIdNotExist = async (request: AuthEntity.RequestBodySignUp) => {
    const query = this.Partners().select('id')

    if (request.partner_id) query.where('id', request.partner_id)

    query.where('name', request.company)

    const partner = await query.first()

    return !partner
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

  public signUp = (request: AuthEntity.RequestBodySignUp) =>
    this.Users().insert({
      ...request,
      id: uuidv4(),
      created_at: new Date(),
    })

  public findByEmail = (request: AuthEntity.FindByEmail) =>
    this.Users().where('email', request.email).first()

  public findByUserId = (id: string) => this.Users().where('id', id).first()

  public findByRefreshToken = (request: AuthEntity.RequestBodyRefreshToken) =>
    this.OauthTokens()
      .select('users.id', 'partner_id', 'is_admin', 'users.is_active')
      .join('users', 'users.id', 'oauth_tokens.user_id')
      .where('refresh_token', request.refresh_token)
      .first()

  public deleteOauthbyRefreshToken = (request: AuthEntity.RequestBodyRefreshToken) =>
    this.OauthTokens().where('refresh_token', request.refresh_token).delete()

  public createOauthToken = (oauthToken: AuthEntity.OauthToken) =>
    this.OauthTokens().insert({
      ...oauthToken,
      id: uuidv4(),
      created_at: new Date(),
    })

  public updateRefreshToken = (refreshToken: string, oauthToken: AuthEntity.OauthToken) =>
    this.OauthTokens()
      .where('refresh_token', refreshToken)
      .update({
        ...oauthToken,
        updated_at: new Date(),
      })

  public updatePassword = (id: string, password: string) =>
    this.Users().where('id', id).update({ password })

  public updateStatus = (user: AuthEntity.User) => {
    const payload = <AuthEntity.UpdateStatus>{}

    payload.last_login_at = new Date()
    if (user.status === StatusUser.VERIFIED) {
      payload.status = StatusUser.ACTIVE
    }

    return this.Users().where('id', user.id).update(payload)
  }
}
