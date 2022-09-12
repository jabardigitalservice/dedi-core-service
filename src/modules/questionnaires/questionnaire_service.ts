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

  public questionnaire = async (request: QuestionnaireEntity.RequestBodyQuestionnaire) => {
    const { id } = request

    const data: QuestionnaireEntity.Questionnaire = {
      level: request.level,
      village_id: id,
      properties: JSON.stringify(request.properties),
    }

    return this.questionnaireRepository.store(data)
  }
}
