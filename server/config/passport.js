'use strict';

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {auth} = require('./auth');

module.exports = (passport) => {

  passport.use(new GoogleStrategy({
    clientID: auth.OAUTH2_CLIENT_ID,
    clientSecret: auth.OAUTH2_CLIENT_SECRET,
    callbackURL: auth.OAUTH2_CALLBACK
  }, (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
  }));

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });

};
