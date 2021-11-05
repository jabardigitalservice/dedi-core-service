export namespace Auth {
  export interface StructUser {
    id: string
    name: string
    avatar?: string
    email: string
    partner_id?: string
    password?: string
    google_id?: string
    created_at: Date
    verified_at?: Date
    is_admin?: boolean
  }

  export interface StructPartner {
    id: string
    name: string
    deleted_at?: Date
    created_at: Date
  }

  export interface StructOauthToken {
    id?: string
    user_id: string
    access_token: string
    refresh_token: string
    expired_in: number
    is_active?: boolean
    created_at?: Date
    updated_at?: Date
  }

  export interface RequestBodySignUp {
    name: string
    company?: string
    partner_id?: string
    email: string
    password: string
    google_id?: string
  }

  export interface PartnerCreate {
    id: string
    name: string
  }

  export interface RequestBodySignIn {
    email: string
    password: string
    remember?: boolean
  }

  export interface RequestBodyRefreshToken {
    refresh_token: string
  }

  export interface ResponseJWT {
    data: {
      type: string
      access_token: string
      refresh_token: string
      expired_in: number
    }
  }
}
