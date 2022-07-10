import { object, string } from 'yup';

export const searchRequestSchema = object({
  pathParameters: object({
    type: string().required(),
  }),
  queryStringParameters: object({
    query: string().required(),
  }).required(),
});
