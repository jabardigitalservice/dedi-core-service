import database from '../../config/database';
import { pagination } from '../../helpers/paginate';
import { Village as Entity } from './village_entity';

export namespace Village {
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
    const wherePolygon = `ST_CONTAINS(ST_GEOMFROMTEXT('${getPolygon(requestQuery)}'), villages.location)`

    return wherePolygon
  }

  export const Villages = () => database<Entity.Struct>('villages')

  const getWithLocation = () => {
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

    return query
  }

  export const withLocation = (requestQuery: Entity.RequestQueryWithLocation) => {
    const query = getWithLocation()

    query.whereRaw(getWherePolygon(requestQuery))

    return query
  }

  export const listWithLocation = (requestQuery: Entity.RequestQueryListWithLocation) => {
    const query = getWithLocation()

    if (requestQuery.name) query.where('villages.name', 'LIKE', `%${requestQuery.name}%`)
    if (requestQuery.level) query.where('villages.level', requestQuery.level)

    return query.paginate(pagination(requestQuery))
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

  export const metaWithLocation = () => {
    const total = Villages()
      .count('id', { as: 'total' })
      .where('is_active', true)
      .first()

    const lastUpdate = Villages()
      .select('updated_at')
      .whereNotNull('updated_at')
      .orderBy('updated_at', 'desc')
      .where('is_active', true)
      .first()

    return { total, lastUpdate }
  }
}
