import config from '../config';

export const getRole = (user: any) => {
  const partner = user.prtnr ? config.get('role.1') : config.get('role.2')
  const role = user.adm ? config.get('role.0') : partner

  return role;
}
