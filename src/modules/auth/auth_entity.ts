export namespace Auth {
  export interface StructUser {
    id: string
    name: string
    avatar?: string
    email: string
    password?: string
    google_id?: string
    created_at: Date
    verified_at?: Date
  }

  export interface StructPartner {
    id: string
    name: string
    deleted_at?: Date
    created_at: Date
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
  }

  export interface ResponseJWT {
    type: string
    token: string
    user: StructUser
  }
}
