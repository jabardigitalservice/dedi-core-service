import { getOriginalName, getUrl } from '../../helpers/storage'
import { convertToBoolean } from '../../helpers/constant'
import { PageEntity } from './page_entity'

export class PageResponse {
  public findById = (item: any): PageEntity.Response => ({
    id: item.id,
    title: item.title,
    link: item.link,
    is_active: convertToBoolean(item.is_active),
    order: item.order,
    image: {
      path: getUrl(item.image),
      source: item.image,
      original_name: getOriginalName(item.file_name),
    },
  })

  public findAll = (items: any[]): PageEntity.Response[] => {
    const data: PageEntity.Response[] = []
    for (const item of items) {
      data.push(this.findById(item))
    }

    return data
  }
}
