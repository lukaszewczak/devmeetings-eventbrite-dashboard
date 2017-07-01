'use strict';

const router = require('express').Router();
const passport = require('passport');
const {auth} = require('../../config');

router.get('/google', passport.authenticate('google', {scope: ['email']}));

router.get('/google/callback', (req, res) => {
  const middleware = authenticate(req, res);
  middleware(req, res);
});

module.exports = router;

function authenticate (req, res) {
  return passport.authenticate('google', (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(401);
    }

    if (!user) {
      console.log('Invalid user');
      return res.sendStatus(401);
    }

    const userEmail = user.emails[0].value;
    const allowedEmails = auth.ACCESS_EMAILS.split('|');

    if (!allowedEmails.includes(userEmail)) {
      console.log(`Invalid user: ${userEmail}`);
      return res.sendStatus(401);
    }

    req.login(user, (err) => {
      if (err) {
        console.log(`Error during req.login: ${err}`);
        return res.sendStatus(500);
      }
      res.redirect('/');
    });

  })
}
