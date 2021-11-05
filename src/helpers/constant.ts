import config from '../config';

export const isNodeEnvProduction = () => config.get('node.env') === 'production'
