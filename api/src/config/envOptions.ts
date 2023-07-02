import { ConfigModuleOptions } from '@nestjs/config';
import * as joi from 'joi';

export const envOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,
  cache: true,
  validationSchema: joi.object({
    DATABASE_URL: joi.string().required(),
    env: joi.string().required(),
    PORT: joi.number().port().required(),
    SMTP_HOST: joi.string().hostname().required(),
    SMTP_PORT: joi.number().port().required(),
    SMTP_USERNAME: joi.string().required(),
    SMTP_PASSWORD: joi.string().required(),
    FIREBASE_SERVER_KEY: joi.string().required(),
    SMTP_FROM: joi.string().default('Admin'),
    JWT_SECRET: joi.string().required(),
  }),
};
