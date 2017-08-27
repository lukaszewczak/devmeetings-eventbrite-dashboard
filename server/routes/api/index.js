'use strict';

const router = require('express').Router();

router.get('/events/:status', require('./events').get);

module.exports = router;
