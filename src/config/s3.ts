import AWS from 'aws-sdk';
import config from '.';

export default new AWS.S3({
  accessKeyId: config.get('aws.access.key.id'),
  secretAccessKey: config.get('aws.secret.access.key'),
  region: config.get('aws.default.region')
});