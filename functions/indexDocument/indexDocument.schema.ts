import { object, string } from 'yup';

export const indexDocumentSchema = object({
  pathParameters: object({
    type: string().required(),
  }),
  body: object({
    id: string().required(),
  }).required(),
});
