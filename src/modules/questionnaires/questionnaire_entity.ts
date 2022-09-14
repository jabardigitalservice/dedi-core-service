import { metaPaginate } from '../../helpers/paginate'
import { Query } from '../../helpers/types'

export namespace QuestionnaireEntity {
  export interface Questionnaire {
    id?: number
    village_id: string
    level: number
    status?: string
    updated_at?: Date
    created_at?: Date
    properties: string
  }

  export interface VillageCategory {
    id?: number
    category_id?: number
    village_id?: string
  }

  export interface RequestBodyQuestionnaire {
    id?: string
    level: number
    properties: Properties
  }

  export interface FindAll {
    id: number
    village: {
      name: string
    }
    district: {
      name: string
    }
    city: {
      name: string
    }
    category: {
      name?: string
    }
    level: number
    status: string
    created_at: Date
  }

  type Meta = metaPaginate

  export interface ResponseFindAll {
    data: FindAll[]
    meta: Meta
  }

  export interface RequestQueryFindAll extends Query {
    order_by: string
    sort_by: string
    level: string
    per_page: string
    current_page: string
    q: string
  }

  export interface Properties {
    pemohon: Pemohon
    fasilitas_desa: FasilitasDesa
    literasi_digital: LiterasiDigital
    tentang_bumdes: TentangBumdes
    potensi_desa: PotensiDesa
  }

  export interface FasilitasDesa {
    akses_kendaraan: AksesKendaraan
    suplai_listrik: SuplaiListrik
    jaringan_telepon: JaringanTelepon
    jaringan_internet: JaringanInternet
  }

  export interface AksesKendaraan {
    data: string[]
    photo: File
  }

  export interface File {
    path: null | string
    original_name: null | string
    source: null | string
  }

  export interface JaringanInternet {
    data: string
    photo: File
    website: null
  }

  export interface JaringanTelepon {
    data: string
    photo: File
    operator: null
  }

  export interface SuplaiListrik {
    data: string
    photo: File
  }

  export interface LiterasiDigital {
    komunitas: AksesKendaraan
    pelatihan: Pelatihan
  }

  export interface Pelatihan {
    data: null
    photo: File
    pelatihan: null
  }

  export interface Pemohon {
    nama: string
    posisi: string
    file: File
    nomor_telepon: string
    email: string
  }

  export interface PotensiDesa {
    data: string[]
    potensi_dapat_dikembangkan: null
    photo: File
  }

  export interface TentangBumdes {
    sosial_media: AksesKendaraan
    bumdes: Bumdes
    komoditas: Komoditas
    ecommerce: Ecommerce
    logistik: null
  }

  export interface Bumdes {
    data: null
    photo: File
    bumdes: null
  }

  export interface Ecommerce {
    data: string[]
    ecommerce_lainnya: null
    distribusi: null
  }

  export interface Komoditas {
    data: null
    photo: File
    produktivitas: null
  }
}
