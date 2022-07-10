import test from 'ava';
import { faker } from '@faker-js/faker';
import { storeIndex } from './storeIndex';
import { stub } from 'sinon';
import { S3, SQS } from 'aws-sdk';
import { Dependencies } from '../types';

test('it stores an index in S3', async (t) => {
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
    indexData: JSON.stringify({}),
  };

  const putObject = stub(dependencies.s3, 'putObject').returns({
    promise: () => Promise.resolve(),
  } as any);

  await storeIndex(params.documentType, params.indexData, dependencies);

  t.truthy(putObject.called);

  t.deepEqual(putObject.getCall(0).args[0], {
    Bucket: dependencies.env.INDEX_BUCKET_NAME,
    Key: `${params.documentType}.json`,
    Body: '{}',
  });
});

test('it throws an error S3 fails', async (t) => {
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
    indexData: JSON.stringify({}),
  };

  const putObject = stub(dependencies.s3, 'putObject').returns({
    promise: () => Promise.reject(new Error('test')),
  } as any);

  await t.throwsAsync(() => storeIndex(params.documentType, params.indexData, dependencies), {
    message: `test`,
  });

  t.truthy(putObject.called);

  t.deepEqual(putObject.getCall(0).args[0], {
    Bucket: dependencies.env.INDEX_BUCKET_NAME,
    Key: `${params.documentType}.json`,
    Body: '{}',
  });
});
