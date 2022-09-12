import database from '../../config/database'
import { pagination } from '../../helpers/paginate'
import { QuestionnaireEntity } from './questionnaire_entity'

export class QuestionnaireRepository {
  private Questionnaires = () => database<QuestionnaireEntity.Questionnaire>('questionnaires')

  public store = (data: QuestionnaireEntity.Questionnaire) => {
    const timestamp = new Date()

    return this.Questionnaires().insert({
      village_id: data.village_id,
      level: data.level,
      properties: data.properties,
      created_at: timestamp,
    })
  }

  private Query = () =>
    this.Questionnaires()
      .select(
        'questionnaires.id',
        'questionnaires.level',
        'villages.name as village_name',
        'cities.name as city_name',
        'districts.name as district_name',
        'questionnaires.status',
        'questionnaires.created_at'
      )
      .leftJoin('villages', 'villages.id', '=', 'questionnaires.village_id')
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('categories', 'categories.id', '=', 'villages.category_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')

  public findAll = (request: QuestionnaireEntity.RequestQueryFindAll) => {
    const orderBy: string = request.order_by || 'villages.name'
    const sortBy: string = request.sort_by || 'asc'

    const query = this.Query().orderBy(orderBy, sortBy).where('questionnaires.level', request.level)

    if (request.q) {
      query.where((q) => {
        q.where('villages.name', 'like', `%${request.q}%`)
      })
    }

    return query.paginate(pagination(request))
  }
}
