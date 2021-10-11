import { Partner as Entity } from './partner_entity'
import { Partner as Repository } from './partner_repository'

export namespace Partner {
  export const findAll = async (requestQuery: Entity.RequestQuery) => {
    return Repository.findAll({
      name: requestQuery.name,
      perPage: requestQuery.perPage,
      currentPage: requestQuery.currentPage
    })
  }
}
