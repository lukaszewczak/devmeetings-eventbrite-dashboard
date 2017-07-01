'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const config = require('./server/config');
const routes = require('./server/routes');

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const sess = {
  secret: config.server.cookieSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {}
};

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
if (isProduction) {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}
app.use(session(sess));

config.passport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get(/^.*(js|map)$/,express.static(path.join(__dirname, 'dist')));

app.use(routes);

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'login.html'));
});

app.get('/', routes.isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);
    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });
  });
}

app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
      error: err
    }
  });
});

app.listen(config.server.port, () => console.log(`Server started on port: ${config.server.port}`));

module.exports = app;
