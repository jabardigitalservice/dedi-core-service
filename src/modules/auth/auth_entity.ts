export namespace AuthEntity {
  export interface User {
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
    is_active?: boolean
    last_login_at?: Date
    status_partner?: string
  }

  export interface Partner {
    id: string
    name: string
    deleted_at?: Date
    created_at: Date
  }

  export interface OauthToken {
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
    is_admin?: boolean
    google_id?: string
    verified_at?: Date
    status_partner?: string
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

  export interface RequestBodyForgotPassword {
    email: string
  }

  export interface RequestBodyResetPassword {
    password: string
  }

  export interface FindByEmail {
    email: string
  }

  export interface ResponseForgotPassword {
    message: string
  }

  export interface ResponseForgotPasswordVerify {
    data: {
      access_token: string
      email: string
    }
  }

  export interface ResponseJWT {
    data: {
      type: string
      access_token: string
      refresh_token: string
      expired_in: number
    }
  }

  export interface ResponseMe {
    data: {
      name: string
      email: string
      avatar?: string
      role: string
    }
    meta: {}
  }
}
