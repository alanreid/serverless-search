import type { S3, SQS } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import env from './helpers/env';

export type SearchDocument = {
  [index: string]: any;
};

export type DocumentDefinition = {
  searchableFields: string[];
};

export type Dependencies = {
  s3: S3;
  sqs: SQS;
  env: typeof env;
};

export type LambdaHandler<TEvent = APIGatewayProxyEvent, TResponse = APIGatewayProxyResult> = (
  event: TEvent,
  dependencies: Dependencies,
) => Promise<TResponse>;
