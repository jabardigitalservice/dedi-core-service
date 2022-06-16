import { pagination } from '../../helpers/paginate'
import { Partner as Entity } from './partner_entity'

export namespace Partner {
  const { Partners } = Entity

  export const findAll = (requestQuery: Entity.RequestQuery) => {
    const query = Partners()
      .select(
        'partners.id',
        'partners.name',
        'total_village',
        'logo',
        'partners.created_at',
        'website',
        'join_year'
      )
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc')
      .leftJoin('files', 'files.source', '=', 'logo')

    if (requestQuery.name) query.where('partners.name', 'LIKE', `%${requestQuery.name}%`)

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

  export const suggestion = (requestQuery: Entity.RequestQuerySuggestion) => {
    const query = Partners().select('id', 'name').whereNull('deleted_at').orderBy('name', 'asc')

    if (requestQuery.name) query.where('name', 'LIKE', `%${requestQuery.name}%`)

    return query
  }
}
