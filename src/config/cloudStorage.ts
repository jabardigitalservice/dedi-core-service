import { Storage } from '@google-cloud/storage';
import config from '.';

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
