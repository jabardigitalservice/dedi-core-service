import { Village as Repository } from './village_repository'

export namespace Village {
  export const findAllWithLocation = async () => {
    return Repository.findAllWithLocation()
  }
}
