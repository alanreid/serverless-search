import { object, string } from 'yup';

const envSchema = object({
  INDEX_BUCKET_NAME: string().required(),
  QUEUE_URL: string().required(),
});

const env = envSchema.validateSync(process.env);

export default env;
