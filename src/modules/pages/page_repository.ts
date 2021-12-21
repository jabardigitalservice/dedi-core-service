import database from '../../config/database';
import { pagination } from '../../helpers/paginate';
import { Page as Entity } from './page_entity';

export namespace Page {
  export const Pages = () => database<Entity.Struct>('pages')

  export const findAll = (requestQuery: Entity.RequestQueryPage) => {
    const orderBy: string = requestQuery.order_by || 'title'
    const sortBy: string = requestQuery.sort_by || 'asc'

    const query = Pages()
      .select(
        'pages.id',
        'title',
        'description',
        'is_active',
        'files.name as files_name',
      )
      .leftJoin('files', 'files.id', '=', 'pages.file_id')
      .orderBy(orderBy, sortBy)

    if (requestQuery.q) {
      query.where('title', 'like', `%${requestQuery.q}%`)
    }

    return query.paginate(pagination(requestQuery))
  }
}
