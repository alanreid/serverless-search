import test from 'ava';
import { faker } from '@faker-js/faker';
import { stub } from 'sinon';
import { S3, SQS } from 'aws-sdk';
import { Dependencies } from '../types';
import { enqueueDocument } from './enqueueDocument';

test('it sends a message to SQS', async (t) => {
  const dependencies: Dependencies = {
    s3: new S3(),
    sqs: new SQS(),
    env: {
      INDEX_BUCKET_NAME: faker.random.word(),
      QUEUE_URL: faker.random.word(),
    },
  };

  const params = {
    documentType: faker.random.word(),
    document: {
      firstName: faker.name.firstName(),
    },
  };

  const sendMessage = stub(dependencies.sqs, 'sendMessage').returns({
    promise: () => Promise.resolve(),
  } as any);

  await enqueueDocument(params.documentType, params.document, dependencies);

  t.truthy(sendMessage.called);

  const args = sendMessage.getCall(0).args[0] as any;

  t.is(args?.QueueUrl, dependencies.env.QUEUE_URL);
  t.is(args?.MessageBody, JSON.stringify(params.document));
  t.is(args?.MessageGroupId, params.documentType);

  t.is(typeof args?.MessageDeduplicationId, 'string');
});

test('it throws an error if SQS fails', async (t) => {
  const dependencies: Dependencies = {
    s3: new S3(),
    sqs: new SQS(),
    env: {
      INDEX_BUCKET_NAME: faker.random.word(),
      QUEUE_URL: faker.random.word(),
    },
  };

  const params = {
    documentType: faker.random.word(),
    document: {
      firstName: faker.name.firstName(),
    },
  };

  const sendMessage = stub(dependencies.sqs, 'sendMessage').returns({
    promise: () => Promise.reject(new Error('test')),
  } as any);

  await t.throwsAsync(() => enqueueDocument(params.documentType, params.document, dependencies), {
    message: 'test',
  });

  t.truthy(sendMessage.called);

  const args = sendMessage.getCall(0).args[0] as any;

  t.is(args?.QueueUrl, dependencies.env.QUEUE_URL);
  t.is(args?.MessageBody, JSON.stringify(params.document));
  t.is(args?.MessageGroupId, params.documentType);

  t.is(typeof args?.MessageDeduplicationId, 'string');
});
