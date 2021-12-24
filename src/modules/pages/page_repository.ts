import database from '../../config/database';
import { pagination } from '../../helpers/paginate';
import { Page as Entity } from './page_entity';

export namespace Page {
  export const Pages = () => database<Entity.Struct>('pages')
  export const Files = () => database<Entity.StructFile>('files')

  const Query = () => Pages()
    .select(
      'pages.id',
      'title',
      'description',
      'is_active',
      'files.name as files_name',
      'files.path as files_path',
      'files.id as files_id',
    )
    .leftJoin('files', 'files.id', '=', 'pages.file_id')

  export const findAll = async (requestQuery: Entity.RequestQuery) => {
    const orderBy: string = requestQuery.order_by || 'title'
    const sortBy: string = requestQuery.sort_by || 'asc'

    const query = Query().orderBy(orderBy, sortBy)

    if (requestQuery.q) {
      query.where('title', 'like', `%${requestQuery.q}%`)
    }

    if (requestQuery.is_active) {
      const isActive = requestQuery.is_active.toLowerCase() === 'true'
      query.where('is_active', isActive)
    }

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
