var mysql = require('mysql');
var mysqlConf = require('./db');
var sqlMap = require('./sqlMap');

// 连接数据库
var pool = mysql.createPool({
  host: mysqlConf.mysql.host,
  user: mysqlConf.mysql.user,
  password: mysqlConf.mysql.password,
  database: mysqlConf.mysql.database,
  port: mysqlConf.mysql.port,
  multipleStatements:true    // 多语句查询
})

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, data) {
  if(typeof data === 'undefined') {
    res.json({
      code:'1',
<<<<<<< HEAD
<<<<<<< HEAD
      message: '操作失败'
=======
      msg: '操作失败'
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
=======
      msg: '操作失败'
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
    });
  } else {
    res.json(data);
  }
};

module.exports = {
  // 登录
  login(req, res, next){
    let params = req.query;
    let username = params.username;
    let password = params.password;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.queryByUserName,[username],(err, result) => {
        if (result.length === 0){
          res.json({
            status: 'FAIL',
            message: '该用户不存在'
          });
        }else {
          if (result[0].password !== password){
            res.json({
              status: 'FAIL',
              message: '密码错误'
            });
          }else{
            delete result[0].password;
            res.json(result);
          }
        }
<<<<<<< HEAD
<<<<<<< HEAD
        connection.release();
=======
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
=======
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
      })
    });
  },
  // 注册
  register(req, res, next){
    let params = req.query;
    let username = params.username;
    let password = params.password;
    let phone = params.phone;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.insert,[username,password,phone],(err, result) => {
        if (err){
          let msg = '服务器错误,请稍后再试!';
          if (err.errno == '1062'){
            msg = '该用户已经存在！'
          }
          res.json({
            status: 'FAIL',
            message: msg
          });
        }else{
          res.json({
            status: 'SUCCESS',
            message: '注册成功,尝试登陆!'
          });
        }
<<<<<<< HEAD
<<<<<<< HEAD
        connection.release();
=======
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
=======
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
      })
    });
  },
  // 获取所有用户
  getPpsAll(req, res, next) {
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.queryAll,(err, result) => {
        jsonWrite(res, result);
        connection.release();
      })
    })
  },
  // 获取预约车位列表
  getImagesList(req, res, next) {
    let userid = req.query.userid;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.queryAllPark,[userid],(err, result) => {
        jsonWrite(res, result);
        connection.release();
      })
    })
  },
  // 获取当前用户车位信息
  getUserPark(req, res, next) {
    let userid = req.query.userid;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.queryUserPark,[userid],(err, result) => {
        jsonWrite(res, result);
        connection.release();
      })
    })
  },
  // 搜索车位信息
  searchUserPark(req, res, next) {
    let parkcity = req.query.parkcity;
    let userid = req.query.userid;
<<<<<<< HEAD
<<<<<<< HEAD
    let sql = "select * from parkInfo left join user on parkinfo.subscriber=user.id where parkcity like '%"+parkcity+"%' and userid="+userid;
=======
    let sql = "select * from parkInfo where parkcity like '%"+parkcity+"%' and userid="+userid;
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
=======
    let sql = "select * from parkInfo where parkcity like '%"+parkcity+"%' and userid="+userid;
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
    pool.getConnection((err, connection) => {
      connection.query(sql,(err, result) => {
        jsonWrite(res, result);
        connection.release();
      })
    })
  },
<<<<<<< HEAD
<<<<<<< HEAD
  // 删除当前用户车位信息
  deleteParkInfo(req, res, next) {
    let num = req.query.num;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.deleteInfo,[num],(err, result) => {
        if (err){
          res.json({
            status: 'FAIL',
            message: '服务器错误,请稍后再试!'
          });
        }else{
          res.json({
            status: 'SUCCESS',
            message: '删除成功!'
          });
        }
        connection.release();
      })
    })
  },
  // 编辑当前用户车位信息
  editParkInfo(req, res, next) {
    
  },
  // 拒绝预约
  rejectOrder(req, res, next) {
    let num = req.query.num;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.rejectOrder,[num],(err, result) => {
        if (err){
          res.json({
            status: 'FAIL',
            message: '服务器错误,请稍后再试!'
          });
        }else{
          res.json({
            status: 'SUCCESS',
            message: '成功拒绝对方预约车位!'
          });
        }
        connection.release();
      })
    })
  },
  // 同意预约
  agreeOrder(req, res, next) {
    let num = req.query.num;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.agreeOrder,[num],(err, result) => {
        if (err){
          res.json({
            status: 'FAIL',
            message: '服务器错误,请稍后再试!'
          });
        }else{
          res.json({
            status: 'SUCCESS',
            message: '对方已成功预约该车位!'
          });
        }
        connection.release();
      })
    })
  },
=======
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
=======
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
  // 新增车位信息
  saveParkInfo(req, res, next){
    let params = req.query;
    let userid = params.userid;
    let parkcity = params.areaString;
    let parkstreet = params.streetString;
    let parkdetails = params.detailAddr;
    let starttime = params.startTime;
    let endtime = params.endTime;
    let price = params.price;
    let imageurl = params.imageUrl;
    let status = params.status;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.insertPark,[userid,parkcity,parkstreet,parkdetails,starttime,endtime,price,imageurl,status],(err, result) => {
        if (err){
          let msg = '服务器错误,请稍后再试!';
          if (err.errno == '1292'){
            msg = '请正确填写时间信息'
          }
          res.json({
            status: 'FAIL',
            message: msg
          });
        }else{
          res.json({
            status: 'SUCCESS',
            message: '添加成功!'
          });
        }
<<<<<<< HEAD
<<<<<<< HEAD
        connection.release();
=======
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
=======
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
      })
    });
  },
}