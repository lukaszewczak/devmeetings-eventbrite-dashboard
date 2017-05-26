'use strict';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({silent: true});
}

const server = require('./server.js');

module.exports = Object.assign({}, server);
