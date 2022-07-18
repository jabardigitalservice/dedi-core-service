import { isRequestBounds } from '../../helpers/polygon'
import { DistrictEntity } from './district_entity'
import { DistrictRepository } from './district_repository'
import { DistrictResponse } from './district_response'

export class DistrictService {
  private districtRepository: DistrictRepository

  private districtResponse: DistrictResponse

  constructor(districtRepository: DistrictRepository = new DistrictRepository()) {
    this.districtRepository = districtRepository
    this.districtResponse = new DistrictResponse()
  }

  public withLocation = async (
    request: DistrictEntity.RequestQueryWithLocation
  ): Promise<DistrictEntity.ResponseWithLocation> => {
    const items: any = isRequestBounds(request.bounds)
      ? await this.districtRepository.withLocation(request)
      : []
    const total: any = await this.districtRepository.getTotalWithLocation()

    const result: DistrictEntity.ResponseWithLocation = {
      data: this.districtResponse.withLocation(items),
      meta: {
        total: total.total,
      },
    }

    return result
  }

  public suggestion = async (
    request: DistrictEntity.RequestQuerySuggestion
  ): Promise<DistrictEntity.ResponseSuggestion> => {
    const items: any = await this.districtRepository.suggestion(request)

    const result: DistrictEntity.ResponseSuggestion = {
      data: items,
      meta: {
        total: items.length,
      },
    }

    return result
  }
}
