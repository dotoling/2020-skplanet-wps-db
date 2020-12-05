const aa = require('express-async-await');
const express = require('express');

const router = aa(express.Router());

const {
  curPos, checkInHistory
} = require('./user');

router.post('/', curPos);
router.get('/history',checkInHistory);

module.exports = router;
