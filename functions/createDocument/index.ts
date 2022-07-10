import { createDocumentHandler } from './createDocument.handler';
import { lambda } from '../../helpers/lambda';

export const handler = lambda(createDocumentHandler);
