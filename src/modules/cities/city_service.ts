import { isRequestBounds } from '../../helpers/polygon'
import { CityEntity } from './city_entity'
import { CityRepository } from './city_repository'

export class CityService {
  cityRepository: CityRepository

  constructor(cityRepository: CityRepository = new CityRepository()) {
    this.cityRepository = cityRepository
  }

  private responseWithLocation = (items: any[]): CityEntity.WithLocation[] => {
    const data: CityEntity.WithLocation[] = []
    for (const item of items) {
      data.push({
        id: item.id,
        name: item.name,
        location: {
          lat: item.location.y,
          lng: item.location.x,
        },
      })
    }

    return data
  }

  public withLocation = async (
    request: CityEntity.RequestQueryWithLocation
  ): Promise<CityEntity.ResponseWithLocation> => {
    const items: any = isRequestBounds(request.bounds)
      ? await this.cityRepository.withLocation(request)
      : []
    const total: any = await this.cityRepository.getTotalWithLocation()

    const result: CityEntity.ResponseWithLocation = {
      data: this.responseWithLocation(items),
      meta: {
        total: total.total,
      },
    }

    return result
  }

  public suggestion = async (
    request: CityEntity.RequestQuerySuggestion
  ): Promise<CityEntity.ResponseSuggestion> => {
    const items: any = await this.cityRepository.suggestion(request)

    const result: CityEntity.ResponseSuggestion = {
      data: items,
      meta: {
        total: items.length,
      },
    }

    return result
  }
}
