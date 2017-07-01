'use strict';
const joi = require('joi');

const envVarSChema = joi.object({
  OAUTH2_CLIENT_ID: joi.string().regex(/^[a-z-.A-Z0-9]{72}$/).required(),
  OAUTH2_CLIENT_SECRET: joi.string().regex(/^[a-z-A-Z0-9]{24}$/).required(),
  OAUTH2_CALLBACK: joi.string().regex(/^(http|https).*\/auth\/google\/callback$/).required().required(),
  ACCESS_EMAILS: joi.string().required()
}).unknown().required();

const {error, value: envVars} = joi.validate(process.env, envVarSChema);
if (error) {
    throw new Error(`Config validation error: ${error}`);
}

const config = {
    auth: {
      OAUTH2_CLIENT_ID: envVars.OAUTH2_CLIENT_ID,
      OAUTH2_CLIENT_SECRET: envVars.OAUTH2_CLIENT_SECRET,
      OAUTH2_CALLBACK: envVars.OAUTH2_CALLBACK,
      ACCESS_EMAILS: envVars.ACCESS_EMAILS
    }
};

module.exports = config;
