import { metaPagination } from '../../helpers/paginate'
import { PartnerEntity } from './partner_entity'
import { PartnerRepository } from './partner_repository'
import { PartnerResponse } from './partner_response'

export class PartnerService {
  private partnerRepository: PartnerRepository

  private partnerResponse: PartnerResponse

  constructor(partnerRepository: PartnerRepository = new PartnerRepository()) {
    this.partnerRepository = partnerRepository
    this.partnerResponse = new PartnerResponse()
  }

  public findAll = async (
    request: PartnerEntity.RequestQuery
  ): Promise<PartnerEntity.ResponseFindAll> => {
    const items: any = await this.partnerRepository.findAll(request)

    const lastUpdate = await this.partnerRepository.getLastUpdate(request)

    const result: PartnerEntity.ResponseFindAll = {
      data: this.partnerResponse.findAll(items.data),
      meta: {
        ...metaPagination(items.pagination),
        last_update: lastUpdate.created_at,
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
