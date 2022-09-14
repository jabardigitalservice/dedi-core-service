import database from '../../config/database'
import { pagination } from '../../helpers/paginate'
import { QuestionnaireEntity } from './questionnaire_entity'

export class QuestionnaireRepository {
  private Questionnaires = () => database<QuestionnaireEntity.Questionnaire>('questionnaires')

  private VillageCategories = () =>
    database<QuestionnaireEntity.VillageCategory>('village_categories')

  private Categories = () => database<QuestionnaireEntity.Category>('categories')

  private select = [
    'questionnaires.id',
    'questionnaires.level',
    'villages.name as village_name',
    'cities.name as city_name',
    'districts.name as district_name',
    'questionnaires.status',
    'questionnaires.created_at',
    'categories.name as category_name',
  ]

  public store = (data: QuestionnaireEntity.Questionnaire) => {
    const timestamp = new Date()

    return this.Questionnaires().insert({
      village_id: data.village_id,
      level: data.level,
      properties: data.properties,
      created_at: timestamp,
    })
  }

  private findIdByNameCategory = async (name: string) => {
    const item = await this.Categories()
      .where('name', 'like', `%${name}%`)
      .where('level', 4)
      .first()

    return item ? item.id : null
  }

  public storeVillageCategory = async (categories: string[], village_id: string) => {
    const datas = []

    for (const name of categories) {
      const id = this.findIdByNameCategory(name)
      if (!id) continue

      datas.push({
        category_id: id,
        village_id,
      })
    }

    return this.QueryVillageCategories().insert(datas)
  }

  private Query = (level: number) =>
    this.Questionnaires()
      .select(this.select)
      .where('questionnaires.level', level)
      .leftJoin('villages', 'villages.id', '=', 'questionnaires.village_id')
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('categories', 'categories.id', '=', 'villages.category_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')

  private QueryVillageCategories = () =>
    this.VillageCategories()
      .select(this.select)
      .where('village_categories.is_verify', false)
      .leftJoin('questionnaires', 'questionnaires.village_id', '=', 'village_categories.village_id')
      .leftJoin('categories', 'categories.id', '=', 'village_categories.category_id')
      .leftJoin('villages', 'villages.id', '=', 'questionnaires.village_id')
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')

  private searchText = (query: any, text: string) =>
    query.where((q: any) => {
      q.orWhere('villages.name', 'like', `%${text}%`)
    })

  public findAll = (request: QuestionnaireEntity.RequestQueryFindAll) => {
    const orderBy: string = request.order_by || 'villages.name'
    const sortBy: string = request.sort_by || 'asc'
    const level = Number(request.level)

    const isLevelFour = level === 4

    let query = !isLevelFour ? this.Query(level) : this.QueryVillageCategories()

    query.orderBy(orderBy, sortBy)

    if (request.q) {
      query = this.searchText(query, request.q)
    }

    return query.paginate(pagination(request))
  }
}
