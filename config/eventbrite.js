'use strict';
const joi = require('joi');

const envVarSChema = joi.object({
    TOKEN: joi.string().regex(/^[A-Z0-9]{20}$/).required()
}).unknown().required();

const {error, value: envVars} = joi.validate(process.env, envVarSChema);
if (error) {
    throw new Error(`Config validation error: ${envVars}`);
}

const config = {
    eventbrite: {
        token: envVars.TOKEN
    }
};

module.exports = config;
