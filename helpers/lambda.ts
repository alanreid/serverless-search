import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { getDependencies } from './getDependencies';
import { isHttpError, UnprocessableEntity } from 'http-errors';
import { LambdaHandler } from '../types';
import ValidationError from 'yup/lib/ValidationError';
import middy from '@middy/core';

export const response = (statusCode: number, response: any) => ({
  statusCode,
  body: JSON.stringify(response),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ok = (data: any) => {
  return response(200, data);
};

export const lambda = (handler: LambdaHandler) => {
  const dependencies = getDependencies();

  return middy()
    .use(jsonBodyParser())
    .use(httpErrorHandler())
    .handler(async (event) => {
      let result;

      try {
        result = await handler(event, dependencies);
      } catch (err) {
        if (ValidationError.isError(err)) {
          return response(422, new UnprocessableEntity(err.message));
        }

        if (isHttpError(err)) {
          return response(err.statusCode, err);
        }

        return response(500, err);
      }

      return result;
    });
};
