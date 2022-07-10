import { SearchDocument, Dependencies } from '../types';
import elasticlunr from 'elasticlunr';

export const fetchIndex = async (documentType: string, { s3, env }: Dependencies) => {
  let indexData: elasticlunr.SerialisedIndexData<SearchDocument> | undefined;

  try {
    const object = await s3
      .getObject({
        Bucket: env.INDEX_BUCKET_NAME,
        Key: `${documentType}.json`,
      })
      .promise();

    if (object.Body) {
      indexData = JSON.parse(object.Body.toString());
    }
  } catch (err) {
    if (err instanceof Error && err.message !== 'Access Denied') {
      throw err;
    }
  }

  if (!indexData) {
    throw new Error(`There is no index for document type ${documentType}`);
  }

  return indexData;
};
