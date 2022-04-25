import Joi from 'joi';
import { ValidationWithDB } from '../../helpers/validator';

export namespace Village {
  const emptyAllow = ['', null]

  const file = Joi.object({
    path: Joi.string().uri().allow(...emptyAllow),
    original_name: Joi.string().allow(...emptyAllow),
    source: Joi.string().allow(...emptyAllow),
  }).required()

  const ruleArrayString = Joi.array().items(Joi.string()).required().min(1)

  const fasilitas_desa = Joi.alternatives().conditional('...level', {
    is: Joi.number().valid(1, 2, 3, 4),
    then: Joi.object({
      akses_kendaraan: Joi.object({
        data: ruleArrayString,
        photo: file,
      }).required(),
      suplai_listrik: Joi.object({
        data: Joi.string().required(),
        photo: file,
      }).required(),
      jaringan_telepon: Joi.object({
        data: Joi.string().required(),
        photo: file,
        operator: Joi.string().required(),
      }).required(),
      jaringan_internet: Joi.object({
        data: Joi.string().required(),
        photo: file,
        website: Joi.string().required(),
      }).required(),
    }).required(),
    otherwise: Joi.optional(),
  })

  const literasi_digital = Joi.alternatives().conditional('...level', {
    is: Joi.number().valid(2, 3, 4),
    then: Joi.object({
      komunitas: Joi.object({
        data: ruleArrayString,
        photo: file,
      }).required(),
      pelatihan: Joi.object({
        data: Joi.string().required(),
        photo: file,
        pelatihan: Joi.string().required(),
      }).required(),
    }).required(),
    otherwise: Joi.optional(),
  })

  const tentang_bumdes = Joi.alternatives().conditional('...level', {
    is: Joi.number().valid(3, 4),
    then: Joi.object({
      sosial_media: Joi.object({
        data: ruleArrayString,
        photo: file,
      }).required(),
      bumdes: Joi.object({
        data: Joi.string().required(),
        photo: file,
        bumdes: Joi.string().required(),
      }).required(),
      komoditas: Joi.object({
        data: Joi.string().required(),
        photo: file,
      }).required(),
    }).required(),
    otherwise: Joi.optional(),
  })

  const potensi_desa = Joi.alternatives().conditional('...level', {
    is: Joi.number().valid(4),
    then: Joi.object({
      data: ruleArrayString,
      potensi_dapat_dikembangkan: Joi.string().required(),
      photo: file,
    }).required(),
    otherwise: Joi.optional(),
  })

  export const questionnaire = Joi.object({
    id: Joi.string().max(14).required(),
    level: Joi.number().valid(1, 2, 3, 4).required(),
    properties: Joi.object({
      fasilitas_desa,
      literasi_digital,
      tentang_bumdes,
      potensi_desa,
    }).required(),
  })

  export const questionnaireWithDB: ValidationWithDB = {
    id: [
      {
        type: 'exists', attr: 'id', table: 'villages', column: 'id',
      },
    ],
  }
}
