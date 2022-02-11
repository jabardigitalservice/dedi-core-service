import { S3 } from 'aws-sdk';
import { Storage } from '@google-cloud/storage';
import config from '.';

export const s3 = new S3({
  accessKeyId: config.get('aws.access.key.id'),
  secretAccessKey: config.get('aws.secret.access.key'),
  region: config.get('aws.default.region'),
});

const IsJsonString = (str: string) => {
  let isJsonString = true
  try {
    JSON.parse(str);
  } catch (e) {
    isJsonString = false
  }
  return isJsonString;
}

export const GCS = new Storage({
  credentials: IsJsonString(config.get('gcloud.key')) ? JSON.parse(config.get('gcloud.key')) : null,
  projectId: config.get('gcloud.project.id'),
});
