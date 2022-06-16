import { convertToBoolean } from '../../helpers/constant'
import { pagination } from '../../helpers/paginate'
import { Page as Entity } from './page_entity'

export namespace Page {
  const { Pages, Files } = Entity

  const Query = () =>
    Pages()
      .select(
        'pages.id',
        'title',
        'link',
        'is_active',
        'order',
        'image',
        'files.name as file_name',
        'files.source as file_source',
        'files.id as file_id',
        'pages.created_at'
      )
      .leftJoin('files', 'files.source', '=', 'pages.image')

  export const findAll = (requestQuery: Entity.RequestQuery) => {
    const orderBy: string = requestQuery.order_by || 'created_at'
    const sortBy: string = requestQuery.sort_by || 'desc'

    const query = Query().orderBy(orderBy, sortBy)

    if (requestQuery.q) query.where('title', 'like', `%${requestQuery.q}%`)

    if (requestQuery.is_active) query.where('is_active', convertToBoolean(requestQuery.is_active))

    return query.paginate(pagination(requestQuery))
  }

  export const findById = (id: string) => Query().where('pages.id', Number(id)).first()

  export const store = (requestBody: Entity.Struct) =>
    Pages().insert({
      ...requestBody,
      created_at: new Date(),
    })

  export const destroy = (id: number) => Pages().where('id', id).delete()

  export const update = (requestBody: Entity.Struct, id: number) =>
    Pages()
      .where('id', id)
      .update({
        ...requestBody,
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
}
