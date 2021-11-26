import database from '../../config/database';
import { City as Entity } from './city_entity';

export namespace City {
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
    const wherePolygon = `ST_CONTAINS(ST_GEOMFROMTEXT('${getPolygon(requestQuery)}'), location)`

    return wherePolygon
  }

  export const Cities = () => database<Entity.Struct>('cities')

  export const withLocation = (requestQuery: Entity.RequestQueryWithLocation) => {
    const query = Cities()
      .select(
        'id',
        'name',
        'location',
      )
      .where('is_active', true)
      .orderBy('name', 'asc')

    query.whereRaw(getWherePolygon(requestQuery))

    return query
  }

  export const getTotalWithLocation = () => {
    const query = Cities()
      .count('id', { as: 'total' })
      .where('is_active', true)
      .first()

    return query
  }
}
