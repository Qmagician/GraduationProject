var mysql = require('mysql');
var mysqlConf = require('./db');
var sqlMap = require('./sqlMap');
var multer = require('multer');
const fs = require('fs');
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
    let id = params.id;
    let username = params.username;
    let password = params.password;
    let phone = params.phone;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.insert,[id,username,password,phone],(err, result) => {
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
          // 在用户注册成功时，新建一个用户文件夹存放用户资源，如图片
          fs.mkdir("./images/"+id,function(err){
            if (err) {
                return console.error(err);
            }
            console.log("目录创建成功。");
          });
          res.json({
            status: 'SUCCESS',
            message: '注册成功,尝试登陆!'
          });
        }
        connection.release();
      })
    });
  },
  // 获取将要到期租用车位数量
  getRentNum(req, res, next){
    let userId = req.query.userId;
    let nowDate = req.query.nowDate;
    let expireDate = req.query.expireDate;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.queryRentNum,[userId,nowDate,expireDate],(err, result) => {
        jsonWrite(res, result);
        connection.release();
      })
    })
  },
  // 获取过期车位数量
  getReleaseNum(req, res, next){
    let userId = req.query.userId;
    let nowDate = req.query.nowDate;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.queryReleaseNum,[userId,nowDate],(err, result) => {
        jsonWrite(res, result);
        connection.release();
      })
    })
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
    let nowTime = req.query.nowTime;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.queryAllPark,[userid,nowTime],(err, result) => {
        jsonWrite(res, result);
        connection.release();
      })
    })
  },
  // 获取车位图片并返回给前端
  getImage(req, res, next) {
    res.set( 'content-type', 'image/jpeg/png' );//设置返回类型
    var stream = fs.createReadStream( req.query.imageUrl );
    var responseData = [];//存储文件流
    if (stream) {//判断状态
        stream.on( 'data', function( chunk ) {
          responseData.push( chunk );
        });
        stream.on( 'end', function() {
          var finalData = Buffer.concat( responseData );
          res.write( finalData );
          res.end();
        });
    }
    // let url = req.query.imageUrl;
    // res.sendFile( __dirname + "/" + url );
    // let content =  fs.readFileSync(url,"binary");
    // res.write(content,"binary");
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
    let startTime = req.query.startTime;
    let endTime = req.query.endTime;
    let userid = req.query.userid;
    let section = req.query.section;
    let sql = '';
    if (section == 'MINE'){
      sql = "select * from parkInfo left join user on parkinfo.subscriber=user.id where (parkcity like '%"
      +parkcity+"%' or parkstreet like '%"+parkcity+"%') and userid='"+userid+"' order by status desc";
    }else if (section == 'FIND'){
      if(startTime != '' && endTime != ''){
        sql = "select * from parkInfo left join user on parkinfo.subscriber=user.id where (parkcity like '%"
      +parkcity+"%' or parkstreet like '%"+parkcity+"%') and (starttime >='"+startTime+"' and endtime <= '"+endTime+"') and userid!='"+userid+"' and status=0";
      }else{
        sql = "select * from parkInfo left join user on parkinfo.subscriber=user.id where (parkcity like '%"
      +parkcity+"%' or parkstreet like '%"+parkcity+"%') and userid!='"+userid+"' and status=0";
      }
      
    }else {
      sql = "select * from parkInfo left join user on parkinfo.userid=user.id where (parkcity like '%"
      +parkcity+"%' or parkstreet like '%"+parkcity+"%') and subscriber='"+userid+"' order by status desc";
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
    let imageurl = req.query.imageurl;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.deleteInfo,[num],(err, result) => {
        if (err){
          res.json({
            status: 'FAIL',
            message: '服务器错误,请稍后再试!'
          });
        }else{
          if (imageurl){
            fs.unlinkSync(imageurl);
          }
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
    let carseatnum = params.carseatnum;
    let starttime = params.startTime;
    let endtime = params.endTime;
    let price = params.price;
    let imageurl = params.imageUrl;
    let status = params.status;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.updatePark,[parkcity,parkstreet,parkdetails,carseatnum,starttime,endtime,price,imageurl,status,num],(err, result) => {
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
            message: '成功拒绝对方租用该车位!'
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
            message: '对方已成功租用该车位!'
          });
        }
        connection.release();
      })
    })
  },
  // 获取待确认数量
  getToBeReserve(req, res, next) {
    let userId = req.query.userId;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.queryReserve,[userId],(err, result) => {
        jsonWrite(res, result);
        connection.release();
      })
    })
  },
  // 更新用户信息
  updateUserInfo(req, res, next) {
    let type = req.query.updateType;
    let value = req.query.updateValue;
    let userId = req.query.userId;
    let sql = '';
    if (type == 'IMAGE'){
      sql = "update user set headimg='"+value+"' where id='"+userId+"'";
    }else{
      sql = "update user set banlance="+value+" where id='"+userId+"'";
    }
    pool.getConnection((err, connection) => {
      connection.query(sql,(err, result) => {
        if (err){
          res.json({
            status: 'FAIL',
            message: '服务器错误,请稍后再试!'
          });
        }else{
          res.json({
            status: 'SUCCESS',
            message: '更新成功!'
          });
        }
        connection.release();
      })
    })
  },
  // 新增车位信息
  addParkInfo(req, res, next){
    let params = req.query;
    let num = params.num;
    let userid = params.userid;
    let parkcity = params.areaString;
    let parkstreet = params.streetString;
    let parkdetails = params.detailAddr;
    let carseatnum = params.carseatnum;
    let starttime = params.startTime;
    let endtime = params.endTime;
    let price = params.price;
    let totalcost = params.totalcost;
    let imageurl = params.imageUrl;
    let status = params.status;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.pps.insertPark,[num,userid,parkcity,parkstreet,parkdetails,carseatnum,starttime,endtime,price,totalcost,imageurl,status],(err, result) => {
        if (err){
          fs.unlinkSync(imageurl);
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