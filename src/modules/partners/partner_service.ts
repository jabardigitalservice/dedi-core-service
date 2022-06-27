import { getOriginalName, getUrl } from '../../helpers/cloudStorage'
import { metaPagination } from '../../helpers/paginate'
import { PartnerEntity } from './partner_entity'
import { PartnerRepository } from './partner_repository'

export class PartnerService {
  private partnerRepository: PartnerRepository

  constructor(partnerRepository: PartnerRepository = new PartnerRepository()) {
    this.partnerRepository = partnerRepository
  }

  private response = (item: any): PartnerEntity.Response => ({
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

  private responseFindAll = (items: any[]): PartnerEntity.Response[] => {
    const data: PartnerEntity.Response[] = []
    for (const item of items) {
      data.push(this.response(item))
    }

    return data
  }

  public findAll = async (
    request: PartnerEntity.RequestQuery
  ): Promise<PartnerEntity.ResponseFindAll> => {
    const items: any = await this.partnerRepository.findAll(request)

    const lastUpdate = await this.partnerRepository.getLastUpdate(request)

    const result: PartnerEntity.ResponseFindAll = {
      data: this.responseFindAll(items.data),
      meta: {
        ...metaPagination(items.pagination),
        last_update: lastUpdate?.created_at || null,
      },
    }

    return result
  }

  public suggestion = async (
    request: PartnerEntity.RequestQuerySuggestion
  ): Promise<PartnerEntity.ResponseSuggestion> => {
    const partners: PartnerEntity.PartnerSuggestion[] = await this.partnerRepository.suggestion(
      request
    )

    const result: PartnerEntity.ResponseSuggestion = {
      data: partners,
      meta: {
        total: partners.length,
      },
    }

    return result
  }
}
