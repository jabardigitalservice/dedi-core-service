import { v4 as uuidv4 } from 'uuid'
import config from '../../config'
import database from '../../config/database'
import { convertToBoolean } from '../../helpers/constant'
import { pagination } from '../../helpers/paginate'
import { UserEntity } from './user_entity'

export class UserRepository {
  private Users = () => database<UserEntity.User>('users')

  private Files = () => database<UserEntity.File>('files')

  private Query = () =>
    this.Users()
      .select(
        'users.id',
        'users.name',
        'users.email',
        'avatar',
        'users.is_admin',
        'users.partner_id',
        'users.is_active',
        'users.created_at',
        'users.updated_at',
        'users.last_login_at',
        'files.name as file_name',
        'files.id as file_id',
        'partners.name as partner_name'
      )
      .leftJoin('files', 'files.source', '=', 'users.avatar')
      .leftJoin('partners', 'partners.id', '=', 'users.partner_id')

  public findAll = (request: UserEntity.RequestQuery) => {
    const orderBy: string = request.order_by || 'users.updated_at'
    const sortBy: string = request.sort_by || 'desc'

    const query = this.Query().orderBy(orderBy, sortBy)

    if (convertToBoolean(request.is_active))
      query.where('users.is_active', convertToBoolean(request.is_active))

    if (request.is_admin) {
      query.where('users.is_admin', convertToBoolean(request.is_admin))
    }

    // Condition for filter roles value is partner
    if (request.roles && request.roles === config.get('role.1')) {
      query.whereNotNull('users.partner_id')
    }

    if (request.q) query.where('users.name', 'like', `%${request.q}%`)

    return query.paginate(pagination(request))
  }

  public findById = (id: string) => this.Query().where('users.id', id).first()

  public destroy = (id: number) => this.Users().where('id', id).delete()

  public store = (request: UserEntity.User) =>
    this.Users().insert({
      ...request,
      id: uuidv4(),
      verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
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
}
