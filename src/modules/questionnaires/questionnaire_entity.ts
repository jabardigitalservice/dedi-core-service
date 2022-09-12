export namespace QuestionnaireEntity {
  export interface Questionnaire {
    id?: number
    village_id: string
    level: number
    status?: string
    updated_at?: Date
    created_at?: Date
    properties: string
  }

  export interface RequestBodyQuestionnaire {
    id?: string
    level: number
    properties: string
  }
}
