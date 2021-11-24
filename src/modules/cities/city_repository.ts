import database from '../../config/database';
import { City as Entity } from './city_entity';

export namespace City {
  const getPolygon = (requestQuery: Entity.RequestQuery) => {
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

  const getWherePolygon = (requestQuery: Entity.RequestQuery) => `ST_CONTAINS(ST_GEOMFROMTEXT('${getPolygon(requestQuery)}'), location)`

  const pointRegexRule = (point: string) => {
    const pointRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/
    return pointRegex.test(point)
  }

  const isRequestBounds = (requestQuery: Entity.RequestQuery) => requestQuery?.bounds?.ne
    && requestQuery?.bounds?.sw
    && pointRegexRule(requestQuery.bounds.ne)
    && pointRegexRule(requestQuery.bounds.sw)

  export const Cities = () => database<Entity.Struct>('cities')

  export const findAllWithLocation = (requestQuery: Entity.RequestQuery) => {
    const query = Cities()
      .select(
        'id',
        'name',
        'location',
      )
      .where('is_active', true)
      .orderBy('name', 'asc')

    if (requestQuery.name) query.where('name', 'LIKE', `%${requestQuery.name}%`)
    if (isRequestBounds(requestQuery)) query.whereRaw(getWherePolygon(requestQuery))

    return query
  }

  export const getTotalFindAllWithLocation = () => Cities()
    .count('id', { as: 'total' })
    .where('is_active', true)
    .first()
}
