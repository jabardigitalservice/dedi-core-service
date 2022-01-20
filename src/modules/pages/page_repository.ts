import database from '../../config/database';
import { convertToBoolean } from '../../helpers/constant';
import { pagination } from '../../helpers/paginate';
import { Page as Entity } from './page_entity';

export namespace Page {
  export const Pages = () => database<Entity.Struct>('pages')
  export const Files = () => database<Entity.StructFile>('files')

  const Query = () => Pages()
    .select(
      'pages.id',
      'title',
      'link',
      'is_active',
      'image',
      'files.name as file_name',
      'files.source as file_source',
      'files.id as file_id',
    )
    .leftJoin('files', 'files.source', '=', 'pages.image')

  export const findAll = async (requestQuery: Entity.RequestQuery) => {
    const orderBy: string = requestQuery.order_by || 'title'
    const sortBy: string = requestQuery.sort_by || 'asc'

    const query = Query().orderBy(orderBy, sortBy)

    if (requestQuery.q) query.where('title', 'like', `%${requestQuery.q}%`)

    if (requestQuery.is_active) query.where('is_active', convertToBoolean(requestQuery.is_active))

    return query.paginate(pagination(requestQuery))
  }

  export const findById = async (id: string) => Query().where('pages.id', Number(id)).first()

  export const store = async (requestBody: Entity.Struct) => Pages().insert({
    ...requestBody,
    created_at: new Date(),
  })

  export const destroy = async (id: number) => Pages().where('id', id).delete()

  export const update = async (requestBody: Entity.Struct, id: number) => Pages().where('id', id).update({
    ...requestBody,
    updated_at: new Date(),
  })

  export const createFile = async (requestBody: Entity.StructFile) => Files().insert({
    ...requestBody,
    created_at: new Date(),
  })

  export const updateFile = async (requestBody: Entity.StructFile, id: number) => Files().where('id', id).update({
    ...requestBody,
  })

  export const destroyFile = async (id: number) => Files().where('id', id).delete()
}
