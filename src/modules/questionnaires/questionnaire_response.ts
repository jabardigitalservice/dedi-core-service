import { QuestionnaireEntity } from './questionnaire_entity'

export class QuestionnaireResponse {
  private responseFindAll = (item: any): QuestionnaireEntity.FindAll => ({
    id: item.id,
    village: {
      name: item.village_name,
    },
    district: {
      name: item.district_name,
    },
    city: {
      name: item.city_name,
    },
    category: {
      name: item.category_name,
    },
    status: item.status,
    level: item.level,
    created_at: item.created_at,
  })

  public findById = (item: any): QuestionnaireEntity.FindById => ({
    ...this.responseFindAll(item),
    properties: JSON.parse(item.properties),
  })

  public findAll = (items: any[]): QuestionnaireEntity.FindAll[] => {
    const data: QuestionnaireEntity.FindAll[] = []
    for (const item of items) {
      data.push(this.responseFindAll(item))
    }

    return data
  }
}
