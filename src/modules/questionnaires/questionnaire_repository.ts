import database from '../../config/database'
import { QuestionnaireEntity } from './questionnaire_entity'

export class QuestionnaireRepository {
  private Villages = () => database<QuestionnaireEntity.Village>('villages')

  public questionnaire = (id: string, properties: string) =>
    this.Villages().where('id', id).update({
      properties,
      updated_at: new Date(),
    })
}
