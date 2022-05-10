import Joi from 'joi';
import { ValidationWithDB } from '../../helpers/validator';

export namespace Village {
  const file = Joi.object({
    path: Joi.string().uri().allow(null),
    original_name: Joi.string().allow(null),
    source: Joi.string().allow(null),
  }).required()

  const ruleArrayString = Joi.array().items(Joi.string()).required().min(1)

  const ruleLevel1 = Joi.object({
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
  }).required()

  const ruleLevel2 = Joi.object({
    komunitas: Joi.object({
      data: ruleArrayString,
      photo: file,
    }).required(),
    pelatihan: Joi.object({
      data: Joi.string().required(),
      photo: file,
      pelatihan: Joi.string().allow(null),
    }).required(),
  }).required()

  const ruleLevel3 = Joi.object({
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
      produktivitas: Joi.string().required(),
    }).required(),
    ecommerce: Joi.object({
      data: ruleArrayString,
      ecommerce_lainnya: Joi.string().allow(null),
      distribusi: Joi.string().allow(null),
    }),
    logistik: Joi.string().required(),
  }).required()

  const ruleLevel4 = Joi.object({
    data: ruleArrayString.max(3),
    photo: file,
    potensi_lainnya: Joi.string().allow(null),
    potensi_dapat_dikembangkan: Joi.string().allow(null),
  }).required()

  const getRuleLevel = (ruleLevelSchema: Joi.Schema, ruleLevelValid: number[]) => Joi.alternatives()
    .conditional('...level', {
      is: Joi.number().valid(...ruleLevelValid),
      then: ruleLevelSchema,
      otherwise: Joi.optional(),
    })

  export const questionnaire = Joi.object({
    id: Joi.string().max(14).required(),
    level: Joi.number().valid(1, 2, 3, 4).required(),
    properties: Joi.object({
      fasilitas_desa: getRuleLevel(ruleLevel1, [1, 2, 3, 4]),
      literasi_digital: getRuleLevel(ruleLevel2, [2, 3, 4]),
      tentang_bumdes: getRuleLevel(ruleLevel3, [3, 4]),
      potensi_desa: getRuleLevel(ruleLevel4, [4]),
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
