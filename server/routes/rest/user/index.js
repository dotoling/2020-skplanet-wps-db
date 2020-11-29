const aa = require('express-async-await');
const express = require('express');

const router = aa(express.Router());

const {
  curPos
} = require('./user');

router.post('/', curPos);

module.exports = router;
