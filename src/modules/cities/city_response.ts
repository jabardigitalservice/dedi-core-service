import { CityEntity } from './city_entity'

export class CityResponse {
  public withLocation = (
    items: CityEntity.Repository['WithLocation']
  ): CityEntity.WithLocation[] => {
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
}
