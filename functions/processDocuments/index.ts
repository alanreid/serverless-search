import { processDocumentsHandler } from './processDocuments.handler';
import { getDependencies } from '../../helpers/getDependencies';
import { LambdaHandler } from '../../types';
import { SQSEvent } from 'aws-lambda';

export const handler: LambdaHandler<SQSEvent, void> = (event) => {
  const dependencies = getDependencies();

  return processDocumentsHandler(event, dependencies);
};
