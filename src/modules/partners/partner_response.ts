import { getOriginalName, getUrl } from '../../helpers/cloudStorage'
import { PartnerEntity } from './partner_entity'

export class PartnerResponse {
  public findById = (item: any): PartnerEntity.Response => ({
    id: item.id,
    name: item.name,
    total_village: item.total_village,
    logo: {
      path: getUrl(item.logo),
      source: item.logo,
      original_name: getOriginalName(item.file_name),
    },
    created_at: item.created_at,
    website: item.website,
    join_year: item.join_year,
  })

  public findAll = (items: any[]): PartnerEntity.Response[] => {
    const data: PartnerEntity.Response[] = []
    for (const item of items) {
      data.push(this.findById(item))
    }

    return data
  }
}
