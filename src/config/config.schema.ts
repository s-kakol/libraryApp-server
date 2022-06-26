import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3001).required(),
  MONGODB_URI: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE: Joi.string().default('3600s').required(),
});
