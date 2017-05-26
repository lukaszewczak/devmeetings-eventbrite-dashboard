'use strict';
const joi = require('joi');

const envVarSChema = joi.object({
    PORT: joi.number().required()
}).unknown().required();

const {error, value: envVars} = joi.validate(process.env, envVarSChema);
if (error) {
    throw new Error(`Config validation error: ${envVars}`);
}

const config = {
    server: {
        port: envVars.PORT
    }
};

module.exports = config;
