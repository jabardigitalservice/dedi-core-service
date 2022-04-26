import { getPolygon } from '../../helpers/polygon';
import { District as Entity } from './district_entity';

export namespace District {
  const { Districts } = Entity

  const getWherePolygon = (requestQuery: Entity.RequestQueryWithLocation) => {
    const wherePolygon = `ST_CONTAINS(ST_GEOMFROMTEXT('${getPolygon(requestQuery.bounds)}'), districts.location)`

    return wherePolygon
  }

  export const withLocation = (requestQuery: Entity.RequestQueryWithLocation) => {
    const query = Districts()
      .select(
        'districts.id',
        'districts.name',
        'districts.location',
        'cities.id as city_id',
        'cities.name as city_name',
      )
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')
      .where('districts.is_active', true)
      .orderBy('districts.name', 'asc')

    query.whereRaw(getWherePolygon(requestQuery))

    return query
  }

  export const getTotalWithLocation = () => {
    const query = Districts()
      .count('id', { as: 'total' })
      .where('is_active', true)
      .first()

    return query
  }
}
