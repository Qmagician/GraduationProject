var express = require('express')
var router = express.Router();
var api = require('./api')
// 登录
router.get('/pps/login', function(req, res, next) {
  api.login(req, res, next);
})
// 注册
router.get('/pps/register', function(req, res, next) {
  api.register(req, res, next);
})

router.get('/pps/getPpsAll', function(req, res, next) {
  api.getPpsAll(req, res, next);
  //res.send('Hello World!');
})

module.exports = router;