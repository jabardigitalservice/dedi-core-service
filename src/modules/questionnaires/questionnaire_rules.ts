import Joi from 'joi'
import { regexAlphanumeric, regexCodeRegion, regexExtFile } from '../../helpers/regex'
import { ValidationWithDB } from '../../helpers/validator'

export namespace QuestionnaireRules {
  const file = Joi.object({
    path: Joi.string().regex(regexExtFile).uri().allow(null),
    original_name: Joi.string().regex(regexExtFile).allow(null),
    source: Joi.string().regex(regexExtFile).allow(null),
  }).required()

  export const optionsVehicles = [
    'Motor',
    'Mobil',
    'Kendaraan Umum (Bus/Elf)',
    'Belum ada akses kendaraan',
  ]

  export const optionsTraining = ['Belum pernah', 'Pernah, 1-2 kali', 'Pernah, lebih dari 2 kali']

  export const optionsDistribusi = [
    'Ya, sudah tergabung dengan e-commerce',
    'Tidak, saat ini belum tergabung dengan e-commerce',
  ]

  export const optionsPotency = [
    'Pertanian',
    'Perikanan',
    'Kesehatan',
    'Pendidikan',
    'Pengelolaan Sampah (Waste Management)',
    'Multimedia',
    'Lainnya',
  ]

  const ruleArrayString = Joi.array().items(Joi.string().regex(regexAlphanumeric).trim()).required()

  const ruleApplicant = Joi.object({
    nama: Joi.string().regex(regexAlphanumeric).trim().required(),
    posisi: Joi.string().regex(regexAlphanumeric).trim().required(),
    file,
    nomor_telepon: Joi.string().regex(regexAlphanumeric).trim().required(),
    email: Joi.string().email().required(),
  }).required()

  const ruleLevel1 = Joi.object({
    akses_kendaraan: Joi.object({
      data: Joi.array()
        .items(Joi.string().valid(...optionsVehicles))
        .required()
        .min(1),
      photo: file,
    }).required(),
    suplai_listrik: Joi.object({
      data: Joi.string().regex(regexAlphanumeric).trim().required(),
      photo: file,
    }).required(),
    jaringan_telepon: Joi.object({
      data: Joi.string().regex(regexAlphanumeric).trim().required(),
      photo: file,
      operator: Joi.string().regex(regexAlphanumeric).trim().allow(null),
    }).required(),
    jaringan_internet: Joi.object({
      data: Joi.string().regex(regexAlphanumeric).trim().required(),
      photo: file,
      website: Joi.string().regex(regexAlphanumeric).trim().allow(null),
    }).required(),
  }).required()

  const ruleLevel2 = Joi.object({
    komunitas: Joi.object({
      data: ruleArrayString.min(1),
      photo: file,
    }).required(),
    pelatihan: Joi.object({
      data: Joi.string()
        .valid(...optionsTraining)
        .trim()
        .required(),
      photo: file,
      pelatihan: Joi.string().regex(regexAlphanumeric).trim().allow(null),
    }).required(),
  }).required()

  const ruleLevel3 = Joi.object({
    sosial_media: Joi.object({
      data: ruleArrayString.min(1),
      photo: file,
    }).required(),
    bumdes: Joi.object({
      data: Joi.string().regex(regexAlphanumeric).trim().required(),
      photo: file,
      bumdes: Joi.string().regex(regexAlphanumeric).trim().allow(null),
    }).required(),
    komoditas: Joi.object({
      data: Joi.string().regex(regexAlphanumeric).trim().allow(null),
      photo: file,
      produktivitas: Joi.string().regex(regexAlphanumeric).trim().allow(null),
    }).required(),
    ecommerce: Joi.object({
      data: ruleArrayString,
      ecommerce_lainnya: Joi.string().regex(regexAlphanumeric).trim().allow(null),
      distribusi: Joi.string()
        .valid(...optionsDistribusi)
        .trim()
        .allow(null),
    }),
    logistik: Joi.string().regex(regexAlphanumeric).trim().allow(null),
  }).required()

  const ruleLevel4 = Joi.object({
    data: Joi.array()
      .items(Joi.string().valid(...optionsPotency))
      .required()
      .min(1)
      .max(3),
    photo: file,
    potensi_lainnya: Joi.string().regex(regexAlphanumeric).allow(null),
    potensi_dapat_dikembangkan: Joi.string().regex(regexAlphanumeric).trim().allow(null),
  }).required()

  const getRuleLevel = (ruleLevelSchema: Joi.Schema, ruleLevelValid: number[]) =>
    Joi.alternatives().conditional('...level', {
      is: Joi.number().valid(...ruleLevelValid),
      then: ruleLevelSchema,
      otherwise: Joi.optional(),
    })

  export const store = Joi.object({
    id: Joi.string().regex(regexCodeRegion).max(14).required(),
    level: Joi.number().valid(1, 2, 3, 4).required(),
    properties: Joi.object({
      pemohon: ruleApplicant,
      fasilitas_desa: getRuleLevel(ruleLevel1, [1, 2, 3, 4]),
      literasi_digital: getRuleLevel(ruleLevel2, [2, 3, 4]),
      tentang_bumdes: getRuleLevel(ruleLevel3, [3, 4]),
      potensi_desa: getRuleLevel(ruleLevel4, [4]),
    }).required(),
  })

  const orderByValid = ['villages.name']
  const emptyAllow = ['', null]

  export const findAll = Joi.object({
    order_by: Joi.string()
      .valid(...orderByValid)
      .allow(...emptyAllow),
    level: Joi.number().valid(1, 2, 3, 4).required(),
    q: Joi.string()
      .allow(...emptyAllow)
      .regex(regexAlphanumeric),
  })
}
