import Joi from 'joi';
import { ValidationWithDB } from '../../helpers/validator';

export namespace Village {
  const file = Joi.object({
    path: Joi.string().uri().allow(null),
    original_name: Joi.string().allow(null),
    source: Joi.string().allow(null),
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
        operator: Joi.string().allow(null),
      }).required(),
      jaringan_internet: Joi.object({
        data: Joi.string().required(),
        photo: file,
        website: Joi.string().allow(null),
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
        pelatihan: Joi.string().allow(null),
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
        bumdes: Joi.string().allow(null),
      }).required(),
      komoditas: Joi.object({
        data: Joi.string().allow(null),
        photo: file,
        productivity: Joi.string().required(),
      }).required(),
      ecommerce: Joi.object({
        data: ruleArrayString,
        ecommerce: Joi.string().allow(null),
        distribution: Joi.string().allow(null),
      }),
      logistic: Joi.string().required(),
    }).required(),
    otherwise: Joi.optional(),
  })

  const potensi_desa = Joi.alternatives().conditional('...level', {
    is: Joi.number().valid(4),
    then: Joi.object({
      data: ruleArrayString.max(3),
      photo: file,
      potensi_lainnya: Joi.string().allow(null),
      potensi_dapat_dikembangkan: Joi.string().allow(null),
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
