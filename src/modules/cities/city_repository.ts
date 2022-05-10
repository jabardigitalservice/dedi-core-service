import { getPolygon } from '../../helpers/polygon';
import { City as Entity } from './city_entity';

export namespace City {
  const { Cities } = Entity

  const getWherePolygon = (requestQuery: Entity.RequestQueryWithLocation) => {
    const wherePolygon = `ST_CONTAINS(ST_GEOMFROMTEXT('${getPolygon(requestQuery.bounds)}'), location)`

    return wherePolygon
  }

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

  export const suggestion = (requestQuery: Entity.RequestQuerySuggestion) => {
    const query = Cities()
      .select(
        'id',
        'name',
      )
      .where('is_active', true)
      .orderBy('name', 'asc')

    if (requestQuery.name) query.where('name', 'LIKE', `%${requestQuery.name}%`)

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
