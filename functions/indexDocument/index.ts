import { indexDocumentHandler } from './indexDocument.handler';
import { lambda } from '../../helpers/lambda';

export const handler = lambda(indexDocumentHandler);
