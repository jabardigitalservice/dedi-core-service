import { v4 as uuidv4 } from 'uuid'
import config from '../../config'
import database from '../../config/database'
import { convertToBoolean } from '../../helpers/constant'
import { pagination } from '../../helpers/paginate'
import { UserEntity } from './user_entity'

export class UserRepository {
  private Users = () => database<UserEntity.User>('users')

  private Files = () => database<UserEntity.File>('files')

  private Partner = () => database<UserEntity.Partner>('partners')

  private select = [
    'villages.name as village_name',
    'cities.name as city_name',
    'districts.name as district_name',
    'users.id',
    'users.name',
    'users.email',
    'avatar',
    'users.is_admin',
    'users.partner_id',
    'users.is_active',
    'users.is_village_apparatus',
    'users.created_at',
    'users.updated_at',
    'users.last_login_at',
    'users.status',
    'files.name as file_name',
    'files.id as file_id',
    'partners.name as partner_name',
  ]

  private searchText = (query: any, text: string) =>
    query.where((q: any) => {
      q.where('users.name', 'like', `%${text}%`)
      q.orWhere('partners.name', 'like', `%${text}%`)
      q.orWhere('villages.name', 'like', `%${text}%`)
    })

  private filterRoles = (query: any, request: UserEntity.RequestQuery) => {
    if (request.is_admin) {
      query.where('users.is_admin', convertToBoolean(request.is_admin))
    }

    if (request.roles === config.get('role.1')) {
      query.whereNotNull('users.partner_id').whereNull('is_village_apparatus')
    }

    if (request.roles && request.roles === config.get('role.2')) {
      query.whereNull('users.partner_id').where('is_village_apparatus', true)
    }

    return query
  }

  private filter = (query: any, request: UserEntity.RequestQuery) => {
    if (request.is_active) query.where('users.is_active', convertToBoolean(request.is_active))

    query = this.filterRoles(query, request)

    if (request.q) {
      query = this.searchText(query, request.q)
    }

    return query
  }

  private Query = () =>
    this.Users()
      .select(this.select)
      .leftJoin('files', 'files.source', '=', 'users.avatar')
      .leftJoin('partners', 'partners.id', '=', 'users.partner_id')
      .leftJoin('villages', 'villages.id', '=', 'users.village_id')
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')

  public findAll = (request: UserEntity.RequestQuery) => {
    const orderBy: string = request.order_by || 'users.updated_at'
    const sortBy: string = request.sort_by || 'desc'

    let query = this.Query().orderBy(orderBy, sortBy)

    query = this.filter(query, request)

    return query.paginate(pagination(request))
  }

  public findById = (id: string) => this.Query().where('users.id', id).first()

  public destroy = (id: number) =>
    this.Users()
      .where('users.id', id)
      .leftJoin('partners', 'partners.id', '=', 'users.partner_id')
      .delete()

  public store = (request: UserEntity.User) =>
    this.Users().insert({
      ...request,
      id: uuidv4(),
      verified_at: new Date(),
      created_at: new Date(),
    })

  public createFile = (request: UserEntity.File) =>
    this.Files()
      .insert({
        ...request,
        created_at: new Date(),
      })
      .onConflict('source')
      .merge(['name', 'created_at'])

  public updateFile = (request: UserEntity.File, id: number) =>
    this.Files()
      .where('id', id)
      .update({
        ...request,
      })

  public update = (request: UserEntity.User, id: string) =>
    this.Users()
      .where('id', id)
      .update({
        ...request,
        updated_at: new Date(),
      })

  public updateStatus = (request: UserEntity.RequestBodyUpdateStatus, id: string) =>
    this.Users()
      .where('id', id)
      .update({
        ...request,
        updated_at: new Date(),
      })

  public verify = (request: UserEntity.Verify, id: string) => {
    const verified_at = request.is_active ? new Date() : null

    return this.Users()
      .where('id', id)
      .update({
        ...request,
        verified_at,
        updated_at: new Date(),
      })
  }

  public storePartner = async (company: string) => {
    const id = uuidv4()

    await this.Partner().insert({ id, name: company, created_at: new Date() })

    return id
  }
}
