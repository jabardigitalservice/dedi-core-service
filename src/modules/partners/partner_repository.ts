import database from '../../config/database';
import { perPage } from '../../helpers/paginate'
import { Partner as Entity } from './partner_entity';

export namespace Partner {
  export const Partners = () => database<Entity.Struct>('partners')

  export const findAll = (requestQuery: Entity.RequestQuery) => {
    const query = Partners()
      .select('id', 'name', 'total_village', 'logo', 'created_at', 'website')
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc')

    if (requestQuery.name) query.where('name', requestQuery.name)

    return query.paginate(perPage(requestQuery))
  }
}
