import { AccessControl } from 'accesscontrol'
import config from '../config';

const ac = new AccessControl();

const roles = () => {
  ac.grant('basic')
    .readOwn('profile')
    .updateOwn('profile')

  ac.grant(config.get('role.0'))
    .extend('basic')
    .readAny('profile')

  ac.grant(config.get('role.1'))
    .extend('basic')

  ac.grant(config.get('role.2'))
    .extend('basic')

  return ac;
}

export default roles()
