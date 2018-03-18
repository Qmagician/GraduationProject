var express = require('express')
var router = express.Router();
var api = require('./api')

router.get('/pps/login', function(req, res, next) {
  api.login(req, res, next);
})

router.get('/pps/getPpsAll', function(req, res, next) {
  api.getPpsAll(req, res, next);
  //res.send('Hello World!');
})

module.exports = router;