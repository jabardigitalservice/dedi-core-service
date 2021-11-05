import database from '../../config/database';
import { Auth as Entity } from './auth_entity';
import { v4 as uuidv4 } from 'uuid'
import bcryptRounds from '../../config/bcryptRounds';
import bcrypt from 'bcrypt'

export namespace Auth {
  export const Users = () => database<Entity.StructUser>('users')
  export const Partners = () => database<Entity.StructPartner>('partners')
  export const OauthTokens = () => database<Entity.StructOauthToken>('oauth_tokens')

  export const createPartner = (partner: Entity.PartnerCreate) => {
    return Partners().insert({
      ...partner,
      created_at: new Date()
    })
  }

  const isPartnerIdNotExist = async (requestBody: Entity.RequestBodySignUp) => {
    const partner = Partners()
      .select('id')
      .where('id', requestBody.partner_id)
      .orWhere('name', requestBody.company.toLowerCase())
      .whereNull('deleted_at')
      .first()

    return !requestBody.partner_id || !await partner
  }

  export const getPartnerId = async (requestBody: Entity.RequestBodySignUp) => {
    const Partner: Entity.PartnerCreate = {
      id: uuidv4(),
      name: requestBody.company
    }

    if (requestBody.company && await isPartnerIdNotExist(requestBody)) {
      createPartner(Partner)
      return Partner.id
    }

    return requestBody.partner_id
  }

  export const passwordHash = (password: string): string => {
    const salt = bcrypt.genSaltSync(bcryptRounds)
    return bcrypt.hashSync(password, salt)
  }

  export const signUp = async (requestBody: Entity.RequestBodySignUp) => {
    return Users().insert({
      id: uuidv4(),
      created_at: new Date(),
      ...requestBody
    })
  }

  export const findByEmail = async (requestBody: Entity.RequestBodySignIn) => {
    return Users().where('email', requestBody.email).first()
  }

  export const createOauthToken = async (oauthToken: Entity.StructOauthToken) => {
    const timestamp = new Date()
    return OauthTokens().insert({
      id: uuidv4(),
      created_at: timestamp,
      ...oauthToken
    })
  }
}
