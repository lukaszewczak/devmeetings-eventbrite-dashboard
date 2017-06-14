'use strict';

const router = require('express').Router();

router.use('/events', require('./events/index'));

module.exports = router;
