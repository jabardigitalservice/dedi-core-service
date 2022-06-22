import database from '../../config/database'
import { pagination } from '../../helpers/paginate'
import { PartnerEntity } from './partner_entity'

export class PartnerRepository {
  private Partners = () => database<PartnerEntity.Struct>('partners')

  public findAll = (request: PartnerEntity.RequestQuery) => {
    const query = this.Partners()
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

    if (request.name) query.where('partners.name', 'LIKE', `%${request.name}%`)

    return query.paginate(pagination(request))
  }

  public getLastUpdate = () => {
    const query = this.Partners()
      .select('created_at')
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc')
      .first()

    return query
  }

  public suggestion = (request: PartnerEntity.RequestQuerySuggestion) => {
    const query = this.Partners()
      .select('id', 'name')
      .whereNull('deleted_at')
      .orderBy('name', 'asc')

    if (request.name) query.where('name', 'LIKE', `%${request.name}%`)

    return query
  }
}
