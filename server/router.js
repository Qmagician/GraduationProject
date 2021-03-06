var express = require('express')
var router = express.Router();
var api = require('./api');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./images/'+req.body.userid);
  },
  filename:function(req,file,cb){
    let fileFormat = (file.originalname).split('.');
    let docx = "." + fileFormat[fileFormat.length-1];
    // let type = ['.gif','.png','.jpg'];
    // for (let i = 0; i < 3; i++){
    //   if (docx == type[i]){
    //     continue;
    //   }
    //   let oldFile = 'images\\'+req.body.userid+'\\'+req.body.num+type[i];
    //   fs.exists(oldFile, function(exists) {
    //     if (exists){
    //     fs.unlinkSync(oldFile);
    //     }
    //   });
    // }
    cb(null,req.body.num + docx);
    //cb(null,file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length-1]);
  }
})
const upload = multer({
  storage:storage,
  limits:{
    fileSize:1024*1024*2
  }
});
const storage1 = multer.diskStorage({
  destination:function(req,file,cb){
     cb(null,'./images/'+req.body.id);
  },
  filename:function(req,file,cb){
    let fileFormat = (file.originalname).split('.');
    let docx = "." + fileFormat[fileFormat.length-1];
    cb(null,"HeadImg" + docx);
  }
})
const upload1 = multer({
  storage:storage1,
  limits:{
    fileSize:1024*1024*2
  }
});
// 登录
router.get('/pps/login', function(req, res, next) {
  api.login(req, res, next);
})
// 注册
router.get('/pps/register', function(req, res, next) {
  api.register(req, res, next);
})
// 获取今天到期租用车位数量
router.get('/pps/getExpireNum', function(req, res, next) {
  api.getExpireNum(req, res, next);
})
// 获取将要到期租用车位数量
router.get('/pps/getRentNum', function(req, res, next) {
  api.getRentNum(req, res, next);
})
// 获取过期车位数量
router.get('/pps/getReleaseNum', function(req, res, next) {
  api.getReleaseNum(req, res, next);
})
// 获取图片并返回给前端
router.get('/pps/getImage', function(req, res, next) {
  api.getImage(req, res, next);
})
// 获取车位信息并返回给前端
router.get('/pps/getImagesList', function(req, res, next) {
	api.getImagesList(req, res, next);
})
// 获取用户（个人或预约）车位信息
router.get('/pps/getUserPark', function(req, res, next) {
  api.getUserPark(req, res, next);
})
// 搜索车位信息
router.get('/pps/searchUserPark', function(req, res, next) {
  api.searchUserPark(req, res, next);
})
// 预约车位
router.get('/pps/reservePark', function(req, res, next) {
  api.reservePark(req, res, next);
})
// 增加交易记录
router.get('/pps/addTradeRecord', function(req, res, next) {
  api.addTradeRecord(req, res, next);
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
// 上传图片
router.post('/pps/uploadImage',upload.single('image'), function(req, res, next) {
  fs.exists(req.file.path, function(exists) {
    if (exists){
      res.json({
        status:'SUCCESS',
        imageUrl: req.file.path,
      });
    }else{
      res.json({
        status:'FAIL',
        message: '照片上传失败！',
      });
    }
  });
})
// 上传用户头像
router.post('/pps/uploadHeadImage',upload1.single('headImage'), function(req, res, next) {
  fs.exists(req.file.path, function(exists) {
    if (exists){
      res.json({
        status:'SUCCESS',
        imageUrl: req.file.path,
      });
    }else{
      res.json({
        status:'FAIL',
        message: '照片上传失败！',
      });
    }
  });
})
// 获取待确认数量
router.get('/pps/getToBeReserve', function(req, res, next) {
  api.getToBeReserve(req, res, next);
})
// 更新用户信息
router.get('/pps/updateUserInfo', function(req, res, next) {
  api.updateUserInfo(req, res, next);
})
// 上传车位信息
router.get('/pps/addParkInfo', function(req, res, next) {
	api.addParkInfo(req, res, next);
})
router.get('/pps/getPpsAll', function(req, res, next) {
  api.getPpsAll(req, res, next);
  //res.send('Hello World!');
})

module.exports = router;