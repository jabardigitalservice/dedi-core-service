import database from '../../config/database'
import { pagination } from '../../helpers/paginate'
import { Partner as Entity } from './partner_entity'

export namespace Partner {
  export const Partners = () => database<Entity.Struct>('partners')

  export const findAll = (requestQuery: Entity.RequestQuery) => {
    const query = Partners()
      .select('id', 'name', 'total_village', 'logo', 'created_at', 'website')
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc')

    if (requestQuery.name) query.where('name', 'LIKE', `%${requestQuery.name}%`)

    return query.paginate(pagination(requestQuery))
  }

  export const getLastUpdate = () => {
    const query = Partners()
      .select('created_at')
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc')
      .first()

    return query
  }

  export const search = (requestQuery: Entity.RequestQuerySuggestion) => {
    const query = Partners()
      .select('id', 'name')
      .whereNull('deleted_at')
      .where('name', 'LIKE', `%${requestQuery.name}%`)
      .orderBy('name', 'asc')

    return query
  }
}
