import config from '../config';

export const isNodeEnvProduction = () => config.get('node.env') === 'production'
export const isNodeEnvDevelopment = () => config.get('node.env') === 'development'
export const isNodeEnvTest = () => config.get('node.env') === 'test'
