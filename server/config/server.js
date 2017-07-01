'use strict';
const joi = require('joi');

const envVarSChema = joi.object({
  PORT: joi.number().required(),
  COOKIE_SECRET: joi.string().required()
}).unknown().required();

const {error, value: envVars} = joi.validate(process.env, envVarSChema);
if (error) {
  throw new Error(`Config validation error: ${error}`);
}

const config = {
  server: {
    port: envVars.PORT,
    cookieSecret: envVars.COOKIE_SECRET
  }
};

module.exports = config;
