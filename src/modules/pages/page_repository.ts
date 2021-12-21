import database from '../../config/database';
import { pagination } from '../../helpers/paginate';
import { Page as Entity } from './page_entity';

export namespace Page {
  export const Pages = () => database<Entity.Struct>('pages')
  const Query = Pages()
    .select(
      'pages.id',
      'title',
      'description',
      'is_active',
      'files.name as files_name',
      'files.path as files_path',
    )
    .leftJoin('files', 'files.id', '=', 'pages.file_id')

  export const findAll = (requestQuery: Entity.RequestQueryPage) => {
    const orderBy: string = requestQuery.order_by || 'title'
    const sortBy: string = requestQuery.sort_by || 'asc'

    const query = Query.orderBy(orderBy, sortBy)

    if (requestQuery.q) {
      query.where('title', 'like', `%${requestQuery.q}%`)
    }

    if (requestQuery.is_active) {
      const isActive = requestQuery.is_active.toLowerCase() === 'true'
      query.where('is_active', isActive)
    }

    return query.paginate(pagination(requestQuery))
  }
}
