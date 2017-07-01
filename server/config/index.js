'use strict';

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({silent: true});
}

const server = require('./server.js');
const eventbrite = require('./eventbrite.js');
const auth = require('./auth.js');
const passport = require('./passport');

module.exports = Object.assign({}, server, eventbrite, auth, {passport: passport});
