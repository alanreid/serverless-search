import { array, object, string } from 'yup';

export const createDocumentSchema = object({
  body: object({
    type: string().required(),
    searchableFields: array().of(string().required()).required(),
  }),
});
