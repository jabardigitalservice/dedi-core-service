import { AccessControl } from 'accesscontrol'
import config from '../config';

const accessControl = new AccessControl();

accessControl.grant('basic')
  .readOwn('profile')
  .updateOwn('profile')

accessControl.grant(config.get('role.0'))
  .extend('basic')
  .readAny('profile')

accessControl.grant(config.get('role.1'))
  .extend('basic')

accessControl.grant(config.get('role.2'))
  .extend('basic')

export const roles = accessControl;

export const getRole = (user: any) => {
  const partner = user.prtnr ? config.get('role.1') : config.get('role.2')
  const role = user.adm ? config.get('role.0') : partner

  return role;
}
