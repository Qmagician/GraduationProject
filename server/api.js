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
      message: '操作失败'
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
        connection.release();
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
        connection.release();
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
    let module = req.query.module;
    let userid = req.query.userid;
    let sql = '';
    if (module == 'MINE'){
      sql = "select * from parkinfo left join user on parkinfo.subscriber=user.id where userid='"+ userid +"' order by status desc";
    }else{
      sql = "select * from parkinfo left join user on parkinfo.userid=user.id where subscriber='"+ userid +"' order by status desc"
    }
    pool.getConnection((err, connection) => {
      connection.query(sql,(err, result) => {
        jsonWrite(res, result);
        connection.release();
      })
    })
  },
  // 搜索车位信息
  searchUserPark(req, res, next) {
    let parkcity = req.query.parkcity;
    let userid = req.query.userid;
    let section = req.query.section;
    let sql = '';
    if (section == 'MINE'){
      sql = "select * from parkInfo left join user on parkinfo.subscriber=user.id where (parkcity like '%"
      +parkcity+"%' or parkstreet like '%"+parkcity+"%') and userid="+userid+" order by status desc";
    }else if (section == 'FIND'){
      sql = "select * from parkInfo left join user on parkinfo.subscriber=user.id where (parkcity like '%"
      +parkcity+"%' or parkstreet like '%"+parkcity+"%') and userid!="+userid+" and status=0";
    }else {
      sql = "select * from parkInfo left join user on parkinfo.userid=user.id where (parkcity like '%"
      +parkcity+"%' or parkstreet like '%"+parkcity+"%') and subscriber="+userid+" order by status desc";
    }

    pool.getConnection((err, connection) => {
      connection.query(sql,(err, result) => {
        jsonWrite(res, result);
        connection.release();
      })
    })
  },
  // 预约车位
  reservePark(req, res, next) {
    let num = req.query.num;
    let userid = req.query.userid;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.reservePark,[userid,num],(err, result) => {
        if (err){
          res.json({
            status: 'FAIL',
            message: '服务器错误,请稍后再试!'
          });
        }else{
          res.json({
            status: 'SUCCESS',
            message: '申请成功，等待对方确认!'
          });
        }
        connection.release();
      })
    }) 
  },
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
    let params = req.query;
    let num = params.num;
    let parkcity = params.areaString;
    let parkstreet = params.streetString;
    let parkdetails = params.detailAddr;
    let starttime = params.startTime;
    let endtime = params.endTime;
    let price = params.price;
    let imageurl = params.imageUrl;
    let status = params.status;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.updatePark,[parkcity,parkstreet,parkdetails,starttime,endtime,price,imageurl,status,num],(err, result) => {
        if (err){
          res.json({
            status: 'FAIL',
            message: '服务器错误,请稍后再试!'
          });
        }else{
          res.json({
            status: 'SUCCESS',
            message: '编辑成功!'
          });
        }
        connection.release();
      })
    });
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
  // 图片在页面显示
  uploadImage(req, res, next) {
    console.log(req);
    res.json({});
  },
  // 新增车位信息
  addParkInfo(req, res, next){
    let params = req.query;
    // let file = JSON.parse(req.query.fileData);
    // let img = file.url;
    // console.log(file.url);
     console.log(params);
    let userid = params.userid;
    let parkcity = params.areaString;
    let parkstreet = params.streetString;
    let parkdetails = params.detailAddr;
    let starttime = params.startTime;
    let endtime = params.endTime;
    let price = params.price;
    let totalcost = params.totalcost;
    let imageurl = params.imageUrl;
    let status = params.status;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.insertPark,[userid,parkcity,parkstreet,parkdetails,starttime,endtime,price,totalcost,imageurl,status],(err, result) => {
        if (err){
          res.json({
            status: 'FAIL',
            message: '服务器错误,请稍后再试!'
          });
        }else{
          res.json({
            status: 'SUCCESS',
            message: '添加成功!'
          });
        }
        connection.release();
      })
    });
  },
}