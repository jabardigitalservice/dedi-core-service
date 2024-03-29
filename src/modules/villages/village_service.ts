import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import { metaPagination } from '../../helpers/paginate'
import { isRequestBounds } from '../../helpers/polygon'
import lang from '../../lang'
import { VillageEntity } from './village_entity'
import { VillageRepository } from './village_repository'
import { VillageResponse } from './village_response'

export class VillageService {
  private villageRepository: VillageRepository

  private villageResponse: VillageResponse

  constructor(villageRepository: VillageRepository = new VillageRepository()) {
    this.villageRepository = villageRepository
    this.villageResponse = new VillageResponse()
  }

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
      data: this.villageResponse.withLocation(items),
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
      data: this.villageResponse.withLocation(items.data),
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

    const result: VillageEntity.ResponseFindById = this.villageResponse.findById(item)

    return result
  }

  public suggestion = async (
    request: VillageEntity.RequestQuerySuggestion
  ): Promise<VillageEntity.ResponseSuggestion> => {
    const items: any = await this.villageRepository.suggestion(request)

    const result: VillageEntity.ResponseSuggestion = {
      data: this.villageResponse.suggestion(items),
      meta: {
        total: items.length,
      },
    }

    return result
  }

  public checkRegistered = async ({ id }: VillageEntity.RequestParamFindById): Promise<void> => {
    const item: any = await this.villageRepository.findById(id)

    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Village', id }))
  }

  public store = (request: VillageEntity.RequestBody) => this.villageRepository.store(request)

  public update = async (request: VillageEntity.RequestBody, id: string) => {
    const item: any = await this.villageRepository.findById(id)

    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Village', id }))

    return this.villageRepository.update(request, id)
  }

  public destroy = async (id: string) => {
    const item: any = await this.villageRepository.findById(id)

    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Village', id }))

    return this.villageRepository.destroy(id)
  }
}
