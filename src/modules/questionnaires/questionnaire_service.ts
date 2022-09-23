import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import { OTHER } from '../../helpers/constant'
import { metaPagination } from '../../helpers/paginate'
import lang from '../../lang'
import { QuestionnaireEntity } from './questionnaire_entity'
import { QuestionnaireRepository } from './questionnaire_repository'
import { QuestionnaireResponse } from './questionnaire_response'

export class QuestionnaireService {
  private questionnaireRepository: QuestionnaireRepository

  private questionnaireResponse: QuestionnaireResponse

  constructor(questionnaireRepository: QuestionnaireRepository = new QuestionnaireRepository()) {
    this.questionnaireRepository = questionnaireRepository
    this.questionnaireResponse = new QuestionnaireResponse()
  }

  public store = async (request: QuestionnaireEntity.RequestBodyQuestionnaire) => {
    const data: QuestionnaireEntity.Questionnaire = {
      level: request.level,
      village_id: request.id,
      properties: JSON.stringify(request.properties),
    }

    const isLevelFour = request.level === 4

    if (isLevelFour) {
      const potential = request.properties.potential.data
      const isOtherPotential = potential.some((item) => item === OTHER)

      const categories = isOtherPotential
        ? [request.properties.potential.other_potential]
        : potential

      return this.questionnaireRepository.storeLevel4(request, categories)
    }

    return this.questionnaireRepository.store(data)
  }

  public findAll = async (request: QuestionnaireEntity.RequestQueryFindAll) => {
    const items: any = await this.questionnaireRepository.findAll(request)

    const result: QuestionnaireEntity.ResponseFindAll = {
      data: this.questionnaireResponse.findAll(items.data),
      meta: metaPagination(items.pagination),
    }
    return result
  }

  public findById = async (id: string) => {
    const item: any = await this.questionnaireRepository.findById(id)
    if (!item)
      throw new HttpError(
        httpStatus.NOT_FOUND,
        lang.__('error.exists', { entity: 'questionnaire', id })
      )

    const result: QuestionnaireEntity.ResponseFindById = {
      data: this.questionnaireResponse.findById(item),
      meta: {},
    }
    return result
  }
}
