import { searchRequestSchema } from './searchDocument.schema';
import { LambdaHandler, SearchDocument } from '../../types';
import { fetchIndex } from '../../helpers/fetchIndex';
import { ok } from '../../helpers/lambda';
import elasticlunr from 'elasticlunr';

let cachedIndex: elasticlunr.Index<SearchDocument> | undefined;

export const searchDocumentsHandler: LambdaHandler = async (event, dependencies) => {
  const validatedRequest = await searchRequestSchema.validate(event);
  const { type } = validatedRequest.pathParameters;
  const { query } = validatedRequest.queryStringParameters;

  if (!cachedIndex) {
    const indexData = await fetchIndex(type, dependencies);
    cachedIndex = elasticlunr.Index.load(indexData);
  }

  const results = cachedIndex.search(query, {});

  return ok({ results });
};
