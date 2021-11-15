import database from '../../config/database';
import { Village as Entity } from './village_entity';

export namespace Village {
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

  const getWherePolygon = (requestQuery: Entity.RequestQuery) => `ST_CONTAINS(ST_GEOMFROMTEXT('${getPolygon(requestQuery)}'), villages.location)`

  const pointRegexRule = (point: string) => {
    const pointRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/
    return pointRegex.test(point)
  }

  const isRequestBounds = (requestQuery: Entity.RequestQuery) => requestQuery?.bounds?.ne
    && requestQuery?.bounds?.sw
    && pointRegexRule(requestQuery.bounds.ne)
    && pointRegexRule(requestQuery.bounds.sw)

  export const Villages = () => database<Entity.Struct>('villages')

  export const findAllWithLocation = (requestQuery: Entity.RequestQuery) => {
    const query = Villages()
      .select(
        'villages.id as id',
        'villages.name as villages_name',
        'villages.level',
        'cities.id as cities_id',
        'cities.name as cities_name',
        'categories.id as categories_id',
        'categories.name as categories_name',
        'villages.location',
        'images',
      )
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('categories', 'categories.id', '=', 'villages.category_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')
      .where('villages.is_active', true)
      .orderBy('villages.name', 'asc')

    if (requestQuery.name) query.where('villages.name', 'LIKE', `%${requestQuery.name}%`)
    if (requestQuery.level) query.where('villages.level', requestQuery.level)
    if (isRequestBounds(requestQuery)) query.whereRaw(getWherePolygon(requestQuery))

    return query
  }

  export const findById = (id: string) => {
    const query = Villages()
      .select(
        'villages.id as id',
        'villages.name as villages_name',
        'villages.level as level',
        'cities.id as cities_id',
        'cities.name as cities_name',
        'categories.id as categories_id',
        'categories.name as categories_name',
      )
      .leftJoin('categories', 'categories.id', '=', 'villages.category_id')
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')
      .where('villages.id', '=', id)
      .first()

    return query
  }
}
