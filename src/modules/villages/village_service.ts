import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import { getUrl } from '../../helpers/cloudStorage'
import { metaPagination } from '../../helpers/paginate'
import { isRequestBounds } from '../../helpers/polygon'
import lang from '../../lang'
import { VillageEntity } from './village_entity'
import { VillageRepository } from './village_repository'

export class VillageService {
  private villageRepository: VillageRepository

  constructor(villageRepository: VillageRepository = new VillageRepository()) {
    this.villageRepository = villageRepository
  }

  private getImages = (image: string): string[] => {
    const images: string[] = []
    const items = JSON.parse(image) || []
    for (const item of items) {
      images.push(getUrl(item))
    }

    return images
  }

  private responseWithLocation = (items: any[]): VillageEntity.WithLocation[] => {
    const data: VillageEntity.WithLocation[] = []
    for (const item of items) {
      data.push({
        id: item.id,
        name: item.name,
        level: item.level,
        city: {
          id: item.city_id,
          name: item.city_name,
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
    }

    return data
  }

  private responseFindById = (item: any): VillageEntity.ResponseFindById => ({
    data: {
      id: item.id,
      name: item.name,
      level: item.level,
      city: {
        id: item.city_id,
        name: item.city_name,
      },
      category: {
        id: item.category_id,
        name: item.category_name,
      },
    },
    meta: {},
  })

  public withLocation = async (
    request: VillageEntity.RequestQueryWithLocation
  ): Promise<VillageEntity.ResponseWithLocation> => {
    const items: any = isRequestBounds(request.bounds)
      ? await this.villageRepository.withLocation(request)
      : []

    const meta: any = this.villageRepository.metaWithLocation(request)
    const total: any = await meta.total
    const lastUpdate: any = await meta.lastUpdate

    const result: VillageEntity.ResponseWithLocation = {
      data: this.responseWithLocation(items),
      meta: {
        total: total.total,
        last_update: lastUpdate?.updated_at || null,
      },
    }

    return result
  }

  public listWithLocation = async (
    request: VillageEntity.RequestQueryListWithLocation
  ): Promise<VillageEntity.ResponseListWithLocation> => {
    const items: any = await this.villageRepository.listWithLocation(request)

    const result: VillageEntity.ResponseListWithLocation = {
      data: this.responseWithLocation(items.data),
      meta: metaPagination(items.pagination),
    }

    return result
  }

  public findById = async (
    request: VillageEntity.RequestParamFindById
  ): Promise<VillageEntity.ResponseFindById> => {
    const item: any = await this.villageRepository.findById(request.id)

    if (!item)
      throw new HttpError(
        httpStatus.NOT_FOUND,
        lang.__('error.exists', { entity: 'Village', id: request.id })
      )

    const result: VillageEntity.ResponseFindById = this.responseFindById(item)

    return result
  }

  private responseSuggestion = (items: any[]): VillageEntity.Suggestion[] => {
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

  public suggestion = async (
    request: VillageEntity.RequestQuerySuggestion
  ): Promise<VillageEntity.ResponseSuggestion> => {
    const items: any = await this.villageRepository.suggestion(request)

    const result: VillageEntity.ResponseSuggestion = {
      data: this.responseSuggestion(items),
      meta: {
        total: items.length,
      },
    }

    return result
  }

  public questionnaire = async (
    request: VillageEntity.RequestBodyQuestionnaire
  ): Promise<number> => {
    const { id } = request

    return this.villageRepository.questionnaire(id, {
      level: request.level,
      properties: JSON.stringify(request.properties),
    })
  }

  public checkRegistered = async ({ id }: VillageEntity.RequestParamFindById): Promise<void> => {
    const item: any = await this.villageRepository.findById(id)

    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Village', id }))

    if (item.level === 4)
      throw new HttpError(
        httpStatus.BAD_REQUEST,
        lang.__('error.village.registered', { level: item.level })
      )
  }
}
