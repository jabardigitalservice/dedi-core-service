import database from '../../config/database'
import { convertToBoolean } from '../../helpers/constant'
import { pagination } from '../../helpers/paginate'
import { getPolygon } from '../../helpers/polygon'
import { VillageEntity } from './village_entity'

export class VillageRepository {
  private Villages = () => database<VillageEntity.Village>('villages')

  private getWherePolygon = (request: VillageEntity.RequestQueryWithLocation) => {
    const wherePolygon = `ST_CONTAINS(ST_GEOMFROMTEXT('${getPolygon(
      request.bounds
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
        'districts.id as district_id',
        'districts.name as district_name',
        'categories.id as category_id',
        'categories.name as category_name',
        'villages.location',
        'images'
      )
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('categories', 'categories.id', '=', 'villages.category_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')

    return query
  }

  public withLocation = (request: VillageEntity.RequestQueryWithLocation) => {
    const query = this.Query().orderBy('villages.name', 'asc')

    if (convertToBoolean(request.is_active))
      query.where('villages.is_active', convertToBoolean(request.is_active))

    query.whereRaw(this.getWherePolygon(request))

    return query
  }

  public suggestion = (request: VillageEntity.RequestQuerySuggestion) => {
    const query = this.Query().orderBy('villages.name', 'asc')

    if (request.name) query.where('villages.name', 'LIKE', `%${request.name}%`)
    if (convertToBoolean(request.is_active))
      query.where('villages.is_active', convertToBoolean(request.is_active))
    if (request.district_id) query.where('villages.district_id', request.district_id)

    return query
  }

  public listWithLocation = (request: VillageEntity.RequestQueryListWithLocation) => {
    const orderBy: string = request.order_by || 'villages.name'
    const sortBy: string = request.sort_by || 'asc'

    const query = this.Query().orderBy(orderBy, sortBy)

    if (request.name) query.where('villages.name', 'LIKE', `%${request.name}%`)
    if (request.level) query.where('villages.level', request.level)
    if (convertToBoolean(request.is_active))
      query.where('villages.is_active', convertToBoolean(request.is_active))

    return query.paginate(pagination(request))
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
        'districts.id as district_id',
        'districts.name as district_name',
        'categories.id as category_id',
        'categories.name as category_name',
        'villages.location',
        'images'
      )
      .leftJoin('categories', 'categories.id', '=', 'villages.category_id')
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')
      .where('villages.id', '=', id)
      .first()

    return query
  }

  public metaWithLocation = (request: VillageEntity.RequestQueryWithLocation) => {
    const total = this.Villages().count('id', { as: 'total' })

    const lastUpdate = this.Villages()
      .select('updated_at')
      .whereNotNull('updated_at')
      .orderBy('updated_at', 'desc')

    if (convertToBoolean(request.is_active)) {
      total.where('villages.is_active', convertToBoolean(request.is_active))
      lastUpdate.where('villages.is_active', convertToBoolean(request.is_active))
    }

    return { total: total.first(), lastUpdate: lastUpdate.first() }
  }

  private getReqBody = (request: VillageEntity.RequestBody) => ({
    id: request.id,
    name: request.name,
    district_id: request.district_id,
    level: request.level,
    location: database.raw(`ST_GeomFromText('POINT(${request.longitude} ${request.latitude})')`),
  })

  public store = (request: VillageEntity.RequestBody) =>
    this.Villages().insert({
      ...this.getReqBody(request),
      created_at: new Date(),
      status: 'desa',
      is_active: false,
    })

  public update = (request: VillageEntity.RequestBody, id: string) =>
    this.Villages()
      .where('id', id)
      .update({
        ...this.getReqBody(request),
        updated_at: new Date(),
      })

  public destroy = (id: string) => this.Villages().where('id', id).delete()
}
