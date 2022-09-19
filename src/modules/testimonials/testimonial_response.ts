import { getOriginalName, getUrl } from '../../helpers/storage'
import { convertToBoolean } from '../../helpers/constant'
import { TestimonialEntity } from './testimonial_entity'

export class TestimonialResponse {
  public findById = (item: any): TestimonialEntity.Response => ({
    id: item.id,
    name: item.name,
    description: item.description,
    is_active: convertToBoolean(item.is_active),
    avatar: {
      path: getUrl(item.avatar),
      source: item.avatar,
      original_name: getOriginalName(item.file_name),
    },
    type: item.type,
    partner: {
      id: item.partner_id,
      name: item.partner_name,
    },
    village: {
      id: item.village_id,
      name: item.village_name,
    },
  })

  public findAll = (items: any[]): TestimonialEntity.Response[] => {
    const data: TestimonialEntity.Response[] = []
    for (const item of items) {
      data.push(this.findById(item))
    }

    return data
  }
}
