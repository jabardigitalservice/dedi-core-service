import database from '../../config/database'
import { convertToBoolean } from '../../helpers/constant'
import { pagination } from '../../helpers/paginate'
import { getPolygon } from '../../helpers/polygon'
import { VillageEntity } from './village_entity'

export class VillageRepository {
  private Villages = () => database<VillageEntity.Struct>('villages')

  private getWherePolygon = (requestQuery: VillageEntity.RequestQueryWithLocation) => {
    const wherePolygon = `ST_CONTAINS(ST_GEOMFROMTEXT('${getPolygon(
      requestQuery.bounds
    )}'), villages.location)`

    return wherePolygon
  }

  private Query = () => {
    const query = this.Villages()
      .select(
        'villages.id as id',
        'villages.name as name',
        'villages.level',
        'cities.id as city_id',
        'cities.name as city_name',
        'categories.id as category_id',
        'categories.name as category_name',
        'villages.location',
        'images'
      )
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('categories', 'categories.id', '=', 'villages.category_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')
      .orderBy('villages.name', 'asc')

    return query
  }

  public withLocation = (requestQuery: VillageEntity.RequestQueryWithLocation) => {
    const query = this.Query()

    if (requestQuery.is_active)
      query.where('villages.is_active', convertToBoolean(requestQuery.is_active))

    query.whereRaw(this.getWherePolygon(requestQuery))

    return query
  }

  public suggestion = (requestQuery: VillageEntity.RequestQuerySuggestion) => {
    const query = this.Query()

    if (requestQuery.name) query.where('villages.name', 'LIKE', `%${requestQuery.name}%`)
    if (requestQuery.is_active)
      query.where('villages.is_active', convertToBoolean(requestQuery.is_active))
    if (requestQuery.district_id) query.where('villages.district_id', requestQuery.district_id)

    return query
  }

  public listWithLocation = (requestQuery: VillageEntity.RequestQueryListWithLocation) => {
    const query = this.Query()

    if (requestQuery.name) query.where('villages.name', 'LIKE', `%${requestQuery.name}%`)
    if (requestQuery.level) query.where('villages.level', requestQuery.level)
    if (requestQuery.is_active)
      query.where('villages.is_active', convertToBoolean(requestQuery.is_active))

    return query.paginate(pagination(requestQuery))
  }

  public findById = (id: string) => {
    const query = this.Villages()
      .select(
        'villages.id as id',
        'villages.name as name',
        'villages.level as level',
        'villages.is_active as is_active',
        'cities.id as city_id',
        'cities.name as city_name',
        'categories.id as category_id',
        'categories.name as category_name'
      )
      .leftJoin('categories', 'categories.id', '=', 'villages.category_id')
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')
      .where('villages.id', '=', id)
      .first()

    return query
  }

  public metaWithLocation = (requestQuery: VillageEntity.RequestQueryWithLocation) => {
    const total = this.Villages().count('id', { as: 'total' })

    const lastUpdate = this.Villages()
      .select('updated_at')
      .whereNotNull('updated_at')
      .orderBy('updated_at', 'desc')

    if (requestQuery.is_active) {
      total.where('villages.is_active', convertToBoolean(requestQuery.is_active))
      lastUpdate.where('villages.is_active', convertToBoolean(requestQuery.is_active))
    }

    return { total: total.first(), lastUpdate: lastUpdate.first() }
  }

  public questionnaire = (id: string, requestBody: VillageEntity.RequestBodyQuestionnaire) =>
    this.Villages()
      .where('id', id)
      .update({
        ...requestBody,
        is_active: true,
        updated_at: new Date(),
      })
}
