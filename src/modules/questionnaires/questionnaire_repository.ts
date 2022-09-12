import database from '../../config/database'
import { QuestionnaireEntity } from './questionnaire_entity'

export class QuestionnaireRepository {
  private Questionnaires = () => database<QuestionnaireEntity.Questionnaire>('questionnaires')

  public store = (data: QuestionnaireEntity.Questionnaire) => {
    const timestamp = new Date()

    return this.Questionnaires().insert({
      village_id: data.village_id,
      level: data.level,
      properties: data.properties,
      created_at: timestamp,
    })
  }
}
