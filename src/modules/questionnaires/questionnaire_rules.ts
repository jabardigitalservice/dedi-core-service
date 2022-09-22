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
    'Waste Management',
    'Multimedia',
    'Lainnya',
  ]

  const ruleArrayString = Joi.array().items(Joi.string().regex(regexAlphanumeric).trim()).required()

  const ruleApplicant = Joi.object({
    name: Joi.string().regex(regexAlphanumeric).trim().required(),
    position: Joi.string().regex(regexAlphanumeric).trim().required(),
    phone_number: Joi.string().regex(regexAlphanumeric).trim().required(),
    email: Joi.string().email().required(),
  }).required()

  const ruleLevel1 = Joi.object({
    vehicle_access: Joi.object({
      data: Joi.array()
        .items(Joi.string().valid(...optionsVehicles))
        .required()
        .min(1),
      photo: file,
    }).required(),
    power_supply: Joi.object({
      data: Joi.string().regex(regexAlphanumeric).trim().required(),
      photo: file,
    }).required(),
    cellular_network: Joi.object({
      data: Joi.string().regex(regexAlphanumeric).trim().required(),
      photo: file,
      operator: Joi.string().regex(regexAlphanumeric).trim().allow(null),
    }).required(),
    internet_network: Joi.object({
      data: Joi.string().regex(regexAlphanumeric).trim().required(),
      photo: file,
      website: Joi.string().regex(regexAlphanumeric).trim().allow(null),
    }).required(),
  }).required()

  const ruleLevel2 = Joi.object({
    community: Joi.object({
      data: ruleArrayString.min(1),
      photo: file,
    }).required(),
    training: Joi.object({
      data: Joi.string()
        .valid(...optionsTraining)
        .trim()
        .required(),
      photo: file,
      training: Joi.string().regex(regexAlphanumeric).trim().allow(null),
    }).required(),
  }).required()

  const ruleLevel3 = Joi.object({
    social_media: Joi.object({
      data: ruleArrayString.min(1),
      photo: file,
    }).required(),
    bumdes: Joi.object({
      data: Joi.string().regex(regexAlphanumeric).trim().required(),
      photo: file,
      bumdes: Joi.string().regex(regexAlphanumeric).trim().allow(null),
    }).required(),
    commodity: Joi.object({
      data: Joi.string().regex(regexAlphanumeric).trim().allow(null),
      photo: file,
      productivity: Joi.string().regex(regexAlphanumeric).trim().allow(null),
    }).required(),
    ecommerce: Joi.object({
      data: ruleArrayString,
      other_ecommerce: Joi.string().regex(regexAlphanumeric).trim().allow(null),
      distribution: Joi.string()
        .valid(...optionsDistribusi)
        .trim()
        .allow(null),
    }),
    logistics: Joi.string().regex(regexAlphanumeric).trim().allow(null),
  }).required()

  const ruleLevel4 = Joi.object({
    data: Joi.array()
      .items(Joi.string().valid(...optionsPotency))
      .required()
      .min(1)
      .max(3),
    photo: file,
    other_potential: Joi.alternatives().conditional('data', {
      is: Joi.array().items(Joi.string().valid('Lainnya')),
      then: Joi.string().regex(regexAlphanumeric).required(),
      otherwise: Joi.string().regex(regexAlphanumeric).allow(null),
    }),
    growth_potential: Joi.string().regex(regexAlphanumeric).trim().allow(null),
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
    sk: file,
    properties: Joi.object({
      applicant: ruleApplicant,
      facility: getRuleLevel(ruleLevel1, [1, 2, 3, 4]),
      literacy: getRuleLevel(ruleLevel2, [2, 3, 4]),
      bumdes: getRuleLevel(ruleLevel3, [3, 4]),
      potential: getRuleLevel(ruleLevel4, [4]),
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

  export const findById = Joi.object({
    id: Joi.number().integer(),
  })

  export const storeWithDB: ValidationWithDB = {
    id: [
      {
        type: 'exists',
        attr: 'id',
        table: 'villages',
        column: 'id',
      },
      {
        type: 'unique',
        attr: 'id',
        table: 'questionnaires',
        column: 'village_id',
      },
    ],
  }
}
