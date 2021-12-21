import { metaPagination } from '../../helpers/paginate'
import { Page as Entity } from './page_entity'
import { Page as Repository } from './page_repository'

export namespace Page {
  const responseFindAll = (items: any[]): Entity.Response[] => {
    const data: Entity.Response[] = []
    for (const item of items) {
      data.push({
        id: item.id,
        title: item.title,
        description: item.description,
        is_active: !!item.is_active,
        file: {
          name: item.files_name,
        },
      })
    }

    return data
  }

  export const findAll = async (requestQuery: Entity.RequestQueryPage) => {
    const items: any = await Repository.findAll(requestQuery)

    const result: Entity.ResponseFindAll = {
      data: responseFindAll(items.data),
      meta: metaPagination(items.pagination),
    }

    return result
  }
}
