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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    queryUserPark: 'select * from parkinfo left join user on parkinfo.subscriber=user.id where userid=? order by status desc',
    insertPark: 'insert into parkInfo(userid,parkcity,parkstreet,parkdetails,starttime,endtime,price,imageurl,status) values(?,?,?,?,?,?,?,?,?)',
    deleteInfo:'delete from parkInfo where num=?',
    editInfo:'update parkInfo set parkcity=?,parkstreet=?,parkdetails=?,starttime=?,endtime=?,price=?,imageurl=?,status=? where num=?',
    rejectOrder:"update parkInfo set status=0,subscriber=null where num=?",
    agreeOrder:'update parkInfo set status=2 where num=?',
=======
    queryUserPark: 'select * from parkInfo where userid=?',
    insertPark: 'insert into parkInfo(userid,parkcity,parkstreet,parkdetails,starttime,endtime,price,imageurl,status) values(?,?,?,?,?,?,?,?,?)'
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
=======
    queryUserPark: 'select * from parkInfo where userid=?',
    insertPark: 'insert into parkInfo(userid,parkcity,parkstreet,parkdetails,starttime,endtime,price,imageurl,status) values(?,?,?,?,?,?,?,?,?)'
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
=======
    queryUserPark: 'select * from parkInfo where userid=?',
    insertPark: 'insert into parkInfo(userid,parkcity,parkstreet,parkdetails,starttime,endtime,price,imageurl,status) values(?,?,?,?,?,?,?,?,?)'
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
  },
}

module.exports = sqlMap;