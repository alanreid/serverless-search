import test from 'ava';
import { createIndex } from './createIndex';
import { faker } from '@faker-js/faker';

test('it creates an index', async (t) => {
  const params = {
    searchableFields: [faker.random.word(), faker.random.word(), faker.random.word()],
  };

  const index = await createIndex(params);

  t.deepEqual(index.getFields(), params.searchableFields);
});

test('it throws an error when the list of fields is empty', async (t) => {
  const params = {
    searchableFields: [],
  };

  await t.throwsAsync(() => createIndex(params), {
    message: 'searchableFields field must have at least 1 items',
  });
});
