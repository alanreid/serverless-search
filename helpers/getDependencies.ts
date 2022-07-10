import { S3, SQS } from 'aws-sdk';
import env from './env';

export const getDependencies = () => ({
  s3: new S3(),
  sqs: new SQS(),
  env,
});
