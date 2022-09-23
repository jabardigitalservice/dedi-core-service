import { Knex } from 'knex'
import database from '../../config/database'
import { isLevelFour } from '../../helpers/constant'
import { pagination } from '../../helpers/paginate'
import { QuestionnaireEntity } from './questionnaire_entity'

export class QuestionnaireRepository {
  private Questionnaires = () => database<QuestionnaireEntity.Questionnaire>('questionnaires')

  private Categories = () => database<QuestionnaireEntity.Category>('categories')

  private VillageCategories = () =>
    database<QuestionnaireEntity.VillageCategory>('village_categories')

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

  private getCategoryIds = async (trx: Knex.Transaction, categories: string[]) => {
    const ids: number[] = []

    for (const category of categories) {
      const id = await this.getCategory(trx, category)
      if (id) ids.push(id)
    }

    return ids
  }

  private storeCategory = async (trx: Knex.Transaction, name: string) => {
    const [id] = await this.Categories()
      .insert({
        name,
        level: 4,
        is_active: true,
      })
      .transacting(trx)

    return id
  }

  private getCategory = async (trx: Knex.Transaction, category: string) => {
    if (!category) return

    const item = await this.Categories()
      .select('id')
      .where('name', 'like', `%${category}%`)
      .where('level', 4)
      .transacting(trx)
      .first()

    if (item) return item.id

    return this.storeCategory(trx, category)
  }

  private storeVillageCategories = (
    trx: Knex.Transaction,
    categories: number[],
    villageId: string
  ) => {
    const datas = categories.map((item) => ({
      category_id: item,
      village_id: villageId,
      is_verify: false,
    }))

    return this.VillageCategories().insert(datas).transacting(trx)
  }

  public storeLevel4 = async (
    data: QuestionnaireEntity.RequestBodyQuestionnaire,
    categories: string[],
    questionnaire: QuestionnaireEntity.Questionnaire
  ) =>
    database.transaction(async (trx) => {
      const ids = await this.getCategoryIds(trx, categories)

      await this.storeVillageCategories(trx, ids, data.id)

      return this.Questionnaires()
        .insert({
          village_id: questionnaire.village_id,
          level: questionnaire.level,
          properties: questionnaire.properties,
          created_at: new Date(),
        })
        .transacting(trx)
    })

  private Query = () =>
    this.Questionnaires()
      .leftJoin('villages', 'villages.id', '=', 'questionnaires.village_id')
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('categories', 'categories.id', '=', 'villages.category_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')

  private QueryVillageCategories = () =>
    this.VillageCategories()
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

    let query = isLevelFour(level)
      ? this.Query().where('questionnaires.level', level)
      : this.QueryVillageCategories()

    query.orderBy(orderBy, sortBy).select(this.select)

    if (request.q) {
      query = this.searchText(query, request.q)
    }

    return query.paginate(pagination(request))
  }

  public findById = (id: string) => {
    const select = [...this.select, 'questionnaires.properties']
    return this.Query().select(select).where('questionnaires.id', id).first()
  }
}
