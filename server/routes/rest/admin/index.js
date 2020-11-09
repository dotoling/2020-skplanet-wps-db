const aa = require('express-async-await');
const express = require('express');

const router = aa(express.Router());

const {
  addPos,
} = require('./admin');

router.post('/', addPos);

module.exports = router;
