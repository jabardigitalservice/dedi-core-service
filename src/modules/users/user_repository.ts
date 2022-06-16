import { v4 as uuidv4 } from 'uuid'
import { convertToBoolean } from '../../helpers/constant'
import { pagination } from '../../helpers/paginate'
import { User as Entity } from './user_entity'

export namespace User {
  const { Users, Files } = Entity

  const Query = () =>
    Users()
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
        'files.id as file_id'
      )
      .leftJoin('files', 'files.source', '=', 'users.avatar')

  export const findAll = (requestQuery: Entity.RequestQuery) => {
    const orderBy: string = requestQuery.order_by || 'updated_at'
    const sortBy: string = requestQuery.sort_by || 'desc'

    const query = Query().orderBy(orderBy, sortBy)

    if (requestQuery.is_active)
      query.where('users.is_active', convertToBoolean(requestQuery.is_active))

    if (requestQuery.is_admin)
      query.where('users.is_admin', convertToBoolean(requestQuery.is_admin))

    if (requestQuery.q) query.where('users.name', 'like', `%${requestQuery.q}%`)

    return query.paginate(pagination(requestQuery))
  }

  export const findById = (id: string) => Query().where('users.id', id).first()

  export const destroy = (id: number) => Users().where('id', id).delete()

  export const store = (requestBody: Entity.Struct) =>
    Users().insert({
      id: uuidv4(),
      ...requestBody,
      verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    })

  export const createFile = (requestBody: Entity.StructFile) =>
    Files().insert({
      ...requestBody,
      created_at: new Date(),
    })

  export const updateFile = (requestBody: Entity.StructFile, id: number) =>
    Files()
      .where('id', id)
      .update({
        ...requestBody,
      })

  export const update = (requestBody: Entity.Struct, id: string) =>
    Users()
      .where('id', id)
      .update({
        ...requestBody,
        updated_at: new Date(),
      })

  export const updateStatus = (requestBody: Entity.RequestBodyUpdateStatus, id: string) =>
    Users()
      .where('id', id)
      .update({
        ...requestBody,
        updated_at: new Date(),
      })
}
