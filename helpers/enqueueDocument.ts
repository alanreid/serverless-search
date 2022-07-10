import { Dependencies, SearchDocument } from '../types';
import { v4 as uuid } from 'uuid';

export const enqueueDocument = async (documentType: string, document: SearchDocument, { sqs, env }: Dependencies) => {
  return sqs
    .sendMessage({
      QueueUrl: env.QUEUE_URL,
      MessageBody: JSON.stringify(document),
      MessageDeduplicationId: uuid(),
      MessageGroupId: documentType,
    })
    .promise();
};
