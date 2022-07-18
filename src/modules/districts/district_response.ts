import { DistrictEntity } from './district_entity'

export class DistrictResponse {
  public withLocation = (items: any[]): DistrictEntity.WithLocation[] => {
    const data: DistrictEntity.WithLocation[] = []
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
}
