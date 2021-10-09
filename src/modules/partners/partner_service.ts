import { perPage } from '../../helpers/paginate'
import { Partner as Entity } from './partner_entity'
import { Partner as Repository } from './partner_repository'

export namespace Partner {
  export const findAll = async (requestQuery: Entity.RequestQuery) => {
    const query = Repository.Partners()
      .select('id', 'name', 'total_village', 'logo', 'created_at')
      .whereNull('deleted_at')
      .orderBy('name', 'asc')

    if (requestQuery.name) query.where('name', requestQuery.name)

    return query.paginate(perPage(requestQuery))
  }
}
