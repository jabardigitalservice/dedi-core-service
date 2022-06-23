import database from '../../config/database'
import { convertToBoolean } from '../../helpers/constant'
import { getPolygon } from '../../helpers/polygon'
import { District as Entity } from './district_entity'

export class DistrictRepository {
  private Districts = () => database<Entity.Struct>('districts')

  private getWherePolygon = (request: Entity.RequestQueryWithLocation) => {
    const wherePolygon = `ST_CONTAINS(ST_GEOMFROMTEXT('${getPolygon(
      request.bounds
    )}'), districts.location)`

    return wherePolygon
  }

  public withLocation = (request: Entity.RequestQueryWithLocation) => {
    const query = this.Districts()
      .select(
        'districts.id',
        'districts.name',
        'districts.location',
        'cities.id as city_id',
        'cities.name as city_name'
      )
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')
      .where('districts.is_active', true)
      .orderBy('districts.name', 'asc')

    query.whereRaw(this.getWherePolygon(request))

    return query
  }

  public suggestion = (request: Entity.RequestQuerySuggestion) => {
    const query = this.Districts().select('id', 'name').orderBy('name', 'asc')

    if (request.name) query.where('name', 'LIKE', `%${request.name}%`)
    if (request.is_active) query.where('is_active', convertToBoolean(request.is_active))
    if (request.city_id) query.where('city_id', request.city_id)

    return query
  }

  public getTotalWithLocation = () => {
    const query = this.Districts().count('id', { as: 'total' }).where('is_active', true).first()

    return query
  }
}
