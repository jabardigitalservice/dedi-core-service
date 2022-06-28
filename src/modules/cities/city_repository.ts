import database from '../../config/database'
import { convertToBoolean } from '../../helpers/constant'
import { getPolygon } from '../../helpers/polygon'
import { CityEntity } from './city_entity'

export class CityRepository {
  private Cities = () => database<CityEntity.Struct>('cities')

  private getWherePolygon = (request: CityEntity.RequestQueryWithLocation) => {
    const wherePolygon = `ST_CONTAINS(ST_GEOMFROMTEXT('${getPolygon(request.bounds)}'), location)`

    return wherePolygon
  }

  public withLocation = (request: CityEntity.RequestQueryWithLocation) => {
    const query = this.Cities()
      .select('id', 'name', 'location')
      .where('is_active', true)
      .orderBy('name', 'asc')

    query.whereRaw(this.getWherePolygon(request))

    return query
  }

  public suggestion = (request: CityEntity.RequestQuerySuggestion) => {
    const query = this.Cities().select('id', 'name').orderBy('name', 'asc')

    if (request.name) query.where('name', 'LIKE', `%${request.name}%`)
    if (convertToBoolean(request.is_active))
      query.where('is_active', convertToBoolean(request.is_active))

    return query
  }

  public getTotalWithLocation = () => {
    const query = this.Cities().count('id', { as: 'total' }).where('is_active', true).first()

    return query
  }
}
