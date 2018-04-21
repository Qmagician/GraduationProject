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
// 获取车位信息并返回给前端
router.get('/pps/getImagesList', function(req, res, next) {
	api.getImagesList(req, res, next);
})
// 获取当前用户车位信息
router.get('/pps/getUserPark', function(req, res, next) {
  api.getUserPark(req, res, next);
})
// 搜索车位信息
router.get('/pps/searchUserPark', function(req, res, next) {
  api.searchUserPark(req, res, next);
})
// 删除
router.get('/pps/deleteParkInfo', function(req, res, next) {
  api.deleteParkInfo(req, res, next);
})
// 编辑
router.get('/pps/editParkInfo', function(req, res, next) {
  api.editParkInfo(req, res, next);
})
// 拒绝
router.get('/pps/rejectOrder', function(req, res, next) {
  api.rejectOrder(req, res, next);
})
// 同意
router.get('/pps/agreeOrder', function(req, res, next) {
  api.agreeOrder(req, res, next);
})
// 上传车位信息
router.get('/pps/saveParkInfo', function(req, res, next) {
	api.saveParkInfo(req, res, next);
})
router.get('/pps/getPpsAll', function(req, res, next) {
  api.getPpsAll(req, res, next);
  //res.send('Hello World!');
})

module.exports = router;