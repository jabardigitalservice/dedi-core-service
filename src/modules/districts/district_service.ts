import { isRequestBounds } from '../../helpers/polygon'
import { District as Entity } from './district_entity'
import { DistrictRepository } from './district_repository'

export class DistrictService {
  private districtRepository: DistrictRepository

  constructor(districtRepository: DistrictRepository = new DistrictRepository()) {
    this.districtRepository = districtRepository
  }

  private responseWithLocation = (items: any[]): Entity.WithLocation[] => {
    const data: Entity.WithLocation[] = []
    for (const item of items) {
      data.push({
        id: item.id,
        name: item.name,
        city: {
          id: item.city_id,
          name: item.city_name,
        },
        location: {
          lat: item.location.y,
          lng: item.location.x,
        },
      })
    }

    return data
  }

  public withLocation = async (
    request: Entity.RequestQueryWithLocation
  ): Promise<Entity.ResponseWithLocation> => {
    const items: any = isRequestBounds(request.bounds)
      ? await this.districtRepository.withLocation(request)
      : []
    const total: any = await this.districtRepository.getTotalWithLocation()

    const result: Entity.ResponseWithLocation = {
      data: this.responseWithLocation(items),
      meta: {
        total: total.total,
      },
    }

    return result
  }

  public suggestion = async (
    request: Entity.RequestQuerySuggestion
  ): Promise<Entity.ResponseSuggestion> => {
    const items: any = await this.districtRepository.suggestion(request)

    const result: Entity.ResponseSuggestion = {
      data: items,
      meta: {
        total: items.length,
      },
    }

    return result
  }
}
