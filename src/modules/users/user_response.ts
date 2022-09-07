import { getOriginalName, getUrl } from '../../helpers/cloudStorage'
import { convertToBoolean } from '../../helpers/constant'
import { getRole } from '../../helpers/rbac'
import { UserEntity } from './user_entity'

export class UserResponse {
  private region = (item: any) => ({
    village: {
      name: item.village_name,
    },
    district: {
      name: item.district_name,
    },
    city: {
      name: item.city_name,
    },
  })

  private role = (item: any) =>
    getRole({
      prtnr: item.partner_id,
      adm: item.is_admin,
      apparatus: item.is_village_apparatus,
    })

  public findById = (item: any): UserEntity.Response => ({
    id: item.id,
    name: item.name,
    email: item.email,
    role: this.role(item),
    partner: {
      name: item.partner_name,
    },
    ...this.region(item),
    avatar: {
      path: getUrl(item.avatar),
      source: item.avatar,
      original_name: getOriginalName(item.file_name),
    },
    is_active: convertToBoolean(item.is_active),
    created_at: item.created_at,
    updated_at: item.updated_at,
    status: item.status,
    last_login_at: item.last_login_at,
  })

  public findAll = (items: any[]): UserEntity.Response[] => {
    const data: UserEntity.Response[] = []
    for (const item of items) {
      data.push(this.findById(item))
    }

    return data
  }
}
