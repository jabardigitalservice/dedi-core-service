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

  public questionnaire = async (
    request: QuestionnaireEntity.RequestBodyQuestionnaire
  ): Promise<number> => {
    const { id } = request

    const properties = {
      level: request.level,
      properties: request.properties,
    }

    return this.questionnaireRepository.questionnaire(id, JSON.stringify(properties))
  }
}
