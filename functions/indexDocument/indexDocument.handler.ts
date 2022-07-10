import { enqueueDocument } from '../../helpers/enqueueDocument';
import { indexDocumentSchema } from './indexDocument.schema';
import { LambdaHandler } from '../../types';
import { ok } from '../../helpers/lambda';

export const indexDocumentHandler: LambdaHandler = async (event, dependencies) => {
  const validatedInput = await indexDocumentSchema.validate(event);
  const { type } = validatedInput.pathParameters;
  const { body } = validatedInput;

  await enqueueDocument(type, body, dependencies);

  return ok(body);
};
