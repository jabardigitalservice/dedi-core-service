import database from '../../config/database'
import { convertToBoolean } from '../../helpers/constant'
import { pagination } from '../../helpers/paginate'
import { User as Entity } from './user_entity'

export namespace User {
  export const Users = () => database<Entity.Struct>('users')
  export const Files = () => database<Entity.StructFile>('files')

  const Query = () => Users()
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
    )
    .leftJoin('files', 'files.source', '=', 'users.avatar')

  export const findAll = (requestQuery: Entity.RequestQuery) => {
    const orderBy: string = requestQuery.order_by || 'name'
    const sortBy: string = requestQuery.sort_by || 'desc'

    const query = Query().orderBy(orderBy, sortBy)

    if (requestQuery.is_active) query.where('users.is_active', convertToBoolean(requestQuery.is_active))

    if (requestQuery.is_admin) query.where('users.is_admin', convertToBoolean(requestQuery.is_admin))

    if (requestQuery.q) query.where('users.name', 'like', `%${requestQuery.q}%`)

    return query.paginate(pagination(requestQuery))
  }

  export const findById = async (id: string) => Query().where('users.id', id).first()
}
