import { getUrl } from '../../helpers/storage'
import { VillageEntity } from './village_entity'

export class VillageResponse {
  private getImages = (image: string): string[] => {
    const images: string[] = []
    const items = JSON.parse(image) || []
    for (const item of items) {
      images.push(getUrl(item))
    }

    return images
  }

  private getWithLocation = (item: any) => ({
    id: item.id,
    name: item.name,
    level: item.level,
    city: {
      id: item.city_id,
      name: item.city_name,
    },
    district: {
      id: item.district_id,
      name: item.district_name,
    },
    category: {
      id: item.category_id,
      name: item.category_name,
    },
    location: {
      lat: item.location.y,
      lng: item.location.x,
    },
    images: this.getImages(item.images),
  })

  public withLocation = (items: any[]): VillageEntity.WithLocation[] => {
    const data: VillageEntity.WithLocation[] = []
    for (const item of items) {
      data.push(this.getWithLocation(item))
    }

    return data
  }

  public findById = (item: any): VillageEntity.ResponseFindById => ({
    data: {
      id: item.id,
      name: item.name,
      level: item.level,
      city: {
        id: item.city_id,
        name: item.city_name,
      },
      district: {
        id: item.district_id,
        name: item.district_name,
      },
      category: {
        id: item.category_id,
        name: item.category_name,
      },
      location: {
        lat: item.location.y,
        lng: item.location.x,
      },
      images: this.getImages(item.images),
    },
    meta: {},
  })

  public suggestion = (items: any[]): VillageEntity.Suggestion[] => {
    const data: VillageEntity.Suggestion[] = []
    for (const item of items) {
      data.push({
        id: item.id,
        name: item.name,
        city: {
          id: item.city_id,
          name: item.city_name,
        },
      })
    }

    return data
  }
}
