import { Dependencies } from '../types';

export const storeIndex = async (documentType: string, indexData: string, { s3, env }: Dependencies) => {
  return s3
    .putObject({
      Bucket: env.INDEX_BUCKET_NAME,
      Key: `${documentType}.json`,
      Body: indexData,
    })
    .promise();
};
