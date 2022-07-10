import { createDocumentSchema } from './createDocument.schema';
import { LambdaHandler, SearchDocument } from '../../types';
import { createIndex } from '../../helpers/createIndex';
import { storeIndex } from '../../helpers/storeIndex';
import { fetchIndex } from '../../helpers/fetchIndex';
import { SerialisedIndexData } from 'elasticlunr';
import { Conflict } from 'http-errors';
import { ok } from '../../helpers/lambda';

export const createDocumentHandler: LambdaHandler = async (event, dependencies) => {
  const validatedDocumentDefinition = await createDocumentSchema.validate(event);
  const { type } = validatedDocumentDefinition.body;

  let existingIndex: SerialisedIndexData<SearchDocument> | undefined;

  try {
    existingIndex = await fetchIndex(type, dependencies);
  } catch (_) {
    // Ignore
  }

  if (existingIndex) {
    throw new Conflict(`Document of type "${type}" already exists`);
  }

  const index = await createIndex(validatedDocumentDefinition.body);
  await storeIndex(type, JSON.stringify(index), dependencies);

  return ok(validatedDocumentDefinition.body);
};
