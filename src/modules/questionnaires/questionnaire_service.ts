import { metaPagination } from '../../helpers/paginate'
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

    const result: QuestionnaireEntity.ResponseFindById = {
      data: this.questionnaireResponse.findById(item),
      meta: {},
    }
    return result
  }
}
