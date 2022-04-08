import database from '../../config/database';
import { convertToBoolean } from '../../helpers/constant';
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

  const Query = () => {
    const query = Villages()
      .select(
        'villages.id as id',
        'villages.name as name',
        'villages.level',
        'cities.id as city_id',
        'cities.name as city_name',
        'categories.id as category_id',
        'categories.name as category_name',
        'villages.location',
        'images',
      )
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('categories', 'categories.id', '=', 'villages.category_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')
      .orderBy('villages.name', 'asc')

    return query
  }

  export const withLocation = (requestQuery: Entity.RequestQueryWithLocation) => {
    const query = Query()

    if (requestQuery.is_active) query.where('villages.is_active', convertToBoolean(requestQuery.is_active))

    query.whereRaw(getWherePolygon(requestQuery))

    return query
  }

  export const suggestion = (requestQuery: Entity.RequestQuerySuggestion) => {
    const query = Query()

    if (requestQuery.name) query.where('villages.name', 'LIKE', `%${requestQuery.name}%`)
    if (requestQuery.is_active) query.where('villages.is_active', convertToBoolean(requestQuery.is_active))

    return query
  }

  export const listWithLocation = (requestQuery: Entity.RequestQueryListWithLocation) => {
    const query = Query()

    if (requestQuery.name) query.where('villages.name', 'LIKE', `%${requestQuery.name}%`)
    if (requestQuery.level) query.where('villages.level', requestQuery.level)
    if (requestQuery.is_active) query.where('villages.is_active', convertToBoolean(requestQuery.is_active))

    return query.paginate(pagination(requestQuery))
  }

  export const findById = (id: string) => {
    const query = Villages()
      .select(
        'villages.id as id',
        'villages.name as name',
        'villages.level as level',
        'villages.is_active as is_active',
        'cities.id as city_id',
        'cities.name as city_name',
        'categories.id as category_id',
        'categories.name as category_name',
      )
      .leftJoin('categories', 'categories.id', '=', 'villages.category_id')
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')
      .where('villages.id', '=', id)
      .first()

    return query
  }

  export const metaWithLocation = (requestQuery: Entity.RequestQueryWithLocation) => {
    const total = Villages()
      .count('id', { as: 'total' })

    const lastUpdate = Villages()
      .select('updated_at')
      .whereNotNull('updated_at')
      .orderBy('updated_at', 'desc')

    if (requestQuery.is_active) {
      total.where('villages.is_active', convertToBoolean(requestQuery.is_active))
      lastUpdate.where('villages.is_active', convertToBoolean(requestQuery.is_active))
    }

    return { total: total.first(), lastUpdate: lastUpdate.first() }
  }

  export const questionnaire = (id: string, requestBody: Entity.RequestBodyQuestionnaire) => Villages().where('id', id).update({
    ...requestBody,
    is_active: true,
  })
}
