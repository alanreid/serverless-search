import { storeIndex } from '../../helpers/storeIndex';
import { fetchIndex } from '../../helpers/fetchIndex';
import { LambdaHandler } from '../../types';
import { SQSEvent } from 'aws-lambda';
import elasticlunr from 'elasticlunr';
import { NotFound } from 'http-errors';

export const processDocumentsHandler: LambdaHandler<SQSEvent, void> = async (event, dependencies) => {
  if (!event.Records[0]) {
    throw new NotFound('No records to process');
  }

  const documentType = event.Records[0].attributes.MessageGroupId;

  if (!documentType) {
    throw new NotFound('No document type available');
  }

  const documents = event.Records.map((record) => ({
    type: record.attributes.MessageGroupId,
    ...JSON.parse(record.body),
  }));

  const indexData = await fetchIndex(documentType, dependencies);

  const index = elasticlunr.Index.load(indexData);

  documents.forEach((document) => {
    index.addDoc(document);
  });

  await storeIndex(documentType, JSON.stringify(index), dependencies);
};
