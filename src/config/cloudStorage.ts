import { S3 } from 'aws-sdk';
import { Storage } from '@google-cloud/storage';
import config from '.';

export const s3 = new S3({
  accessKeyId: config.get('aws.access.key.id'),
  secretAccessKey: config.get('aws.secret.access.key'),
  region: config.get('aws.default.region'),
});

export const GCS = new Storage({
  credentials: JSON.parse(Buffer.from(config.get('gcloud.key'), 'base64').toString()),
  projectId: config.get('gcloud.project.id'),
});
