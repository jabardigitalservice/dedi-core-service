import { isRequestBounds } from '../../helpers/polygon'
import { CityEntity } from './city_entity'
import { CityRepository } from './city_repository'
import { CityResponse } from './city_response'

export class CityService {
  private cityRepository: CityRepository

  private cityResponse: CityResponse

  constructor(cityRepository: CityRepository = new CityRepository()) {
    this.cityRepository = cityRepository
    this.cityResponse = new CityResponse()
  }

  public withLocation = async (
    request: CityEntity.RequestQueryWithLocation
  ): Promise<CityEntity.ResponseWithLocation> => {
    const items = isRequestBounds(request.bounds)
      ? ((await this.cityRepository.withLocation(request)) as CityEntity.Repository['WithLocation'])
      : []
    const total =
      (await this.cityRepository.getTotalWithLocation()) as CityEntity.Repository['GetTotalWithLocation']

    const result: CityEntity.ResponseWithLocation = {
      data: this.cityResponse.withLocation(items),
      meta: {
        total: total.total,
      },
    }

    return result
  }

  public suggestion = async (
    request: CityEntity.RequestQuerySuggestion
  ): Promise<CityEntity.ResponseSuggestion> => {
    const items = (await this.cityRepository.suggestion(
      request
    )) as CityEntity.Repository['Suggestion']

    const result: CityEntity.ResponseSuggestion = {
      data: items,
      meta: {
        total: items.length,
      },
    }

    return result
  }
}
