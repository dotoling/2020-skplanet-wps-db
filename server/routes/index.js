var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/admin', require('./rest/admin'));
router.use('/user', require('./rest/user'));

module.exports = router;
