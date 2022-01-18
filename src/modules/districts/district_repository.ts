import database from '../../config/database';
import { District as Entity } from './district_entity';

export namespace District {
  const getPolygon = (requestQuery: Entity.RequestQueryWithLocation) => {
    const { ne, sw } = requestQuery.bounds

    const boundsNE = ne.trimStart().trimEnd().split(/[, ]+/)
    const boundsSW = sw.trimStart().trimEnd().split(/[, ]+/)

    return `POLYGON((
      ${boundsNE[0]} ${boundsNE[1]},
      ${boundsNE[0]} ${boundsSW[1]},
      ${boundsSW[0]} ${boundsSW[1]},
      ${boundsSW[0]} ${boundsNE[1]},
      ${boundsNE[0]} ${boundsNE[1]}
    ))`
  }

  const getWherePolygon = (requestQuery: Entity.RequestQueryWithLocation) => {
    const wherePolygon = `ST_CONTAINS(ST_GEOMFROMTEXT('${getPolygon(requestQuery)}'), districts.location)`

    return wherePolygon
  }

  export const Districts = () => database<Entity.Struct>('districts')

  export const withLocation = (requestQuery: Entity.RequestQueryWithLocation) => {
    const query = Districts()
      .select(
        'districts.id',
        'districts.name',
        'districts.location',
        'cities.id as city_id',
        'cities.name as citiy_name',
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
