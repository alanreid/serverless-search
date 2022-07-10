import test from 'ava';
import { faker } from '@faker-js/faker';
import { stub } from 'sinon';
import { S3, SQS } from 'aws-sdk';
import { Dependencies } from '../types';
import { fetchIndex } from './fetchIndex';

test('it fetches an index from S3', async (t) => {
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

  const getObject = stub(dependencies.s3, 'getObject').returns({
    promise: () => Promise.resolve({ Body: params.indexData }),
  } as any);

  await fetchIndex(params.documentType, dependencies);

  t.truthy(getObject.called);

  t.deepEqual(getObject.getCall(0).args[0], {
    Bucket: dependencies.env.INDEX_BUCKET_NAME,
    Key: `${params.documentType}.json`,
  });
});

test('it throws an error if the index data is empty', async (t) => {
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
    indexData: '',
  };

  const getObject = stub(dependencies.s3, 'getObject').returns({
    promise: () => Promise.resolve({ Body: params.indexData }),
  } as any);

  await t.throwsAsync(() => fetchIndex(params.documentType, dependencies), {
    message: `There is no index for document type ${params.documentType}`,
  });

  t.truthy(getObject.called);

  t.deepEqual(getObject.getCall(0).args[0], {
    Bucket: dependencies.env.INDEX_BUCKET_NAME,
    Key: `${params.documentType}.json`,
  });
});

test('it throws an error if key does not exist', async (t) => {
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
    indexData: '',
  };

  const getObject = stub(dependencies.s3, 'getObject').returns({
    promise: () => Promise.reject(new Error('Access Denied')),
  } as any);

  await t.throwsAsync(() => fetchIndex(params.documentType, dependencies), {
    message: `There is no index for document type ${params.documentType}`,
  });

  t.truthy(getObject.called);

  t.deepEqual(getObject.getCall(0).args[0], {
    Bucket: dependencies.env.INDEX_BUCKET_NAME,
    Key: `${params.documentType}.json`,
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
    indexData: '',
  };

  const getObject = stub(dependencies.s3, 'getObject').returns({
    promise: () => Promise.reject(new Error('test')),
  } as any);

  await t.throwsAsync(() => fetchIndex(params.documentType, dependencies), {
    message: `test`,
  });

  t.truthy(getObject.called);

  t.deepEqual(getObject.getCall(0).args[0], {
    Bucket: dependencies.env.INDEX_BUCKET_NAME,
    Key: `${params.documentType}.json`,
  });
});
