export namespace QuestionnaireEntity {
  export interface Village {
    id: string
    name: string
    district_id: string
    area_id?: string
    category_id?: number
    level?: number
    status?: string
    location: any
    images: string
    is_active: boolean
    updated_at: Date
    created_at: Date
    properties: string
  }

  export interface RequestBodyQuestionnaire {
    id?: string
    level: number
    properties: string
  }
}
