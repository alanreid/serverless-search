import { searchDocumentsHandler } from './searchDocuments.handler';
import { lambda } from '../../helpers/lambda';

export const handler = lambda(searchDocumentsHandler);
