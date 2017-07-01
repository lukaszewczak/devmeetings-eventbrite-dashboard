var router = require('express').Router();

router.use('/api', (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.sendStatus(404);
}, require('./api'));
router.use('/auth', require('./auth'));

module.exports = router;
module.exports.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login')
};
