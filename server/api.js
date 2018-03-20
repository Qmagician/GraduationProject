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
      msg: '操作失败'
    });
  } else {
    res.json(data);
  }
};

module.exports = {
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
      })
    });
  },
  register(req, res, next){
    let params = req.query;
    let username = params.username;
    let password = params.password;
    let phone = params.phone;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.insert,[username,password,phone],(err, result) => {
        console.log(err);
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
      })
    });
  },
  getPpsAll(req, res, next) {
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.queryAll,(err, result) => {
        jsonWrite(res, result);
        connection.release();
      })
    })
  },
  getTagAll(req, res, next) {
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.tag.queryAll, (err, result) => {
        jsonWrite(res, result);
        connection.release();
      })
    })
  },
}