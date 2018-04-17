var sqlMap = {
  pps: {
    insert:"insert into user(username,password,phone,isadmin) values(?,?,?,0)",
    update:'update user set phone=? where username=?',
    delete: 'delete from user where username=?',
    queryById: 'select * from user where id=?',
    queryByUserName: 'select * from user where username=?',
    queryByPassword: 'select * from user where password=?',
    queryAll: 'select * from user',
    queryAllPark: 'select * from parkInfo where userid!=? and status=0',
    queryUserPark: 'select * from parkInfo where userid=?',
    insertPark: 'insert into parkInfo(userid,parkcity,parkstreet,parkdetails,starttime,endtime,price,imageurl,status) values(?,?,?,?,?,?,?,?,?)'
  },
}

module.exports = sqlMap;