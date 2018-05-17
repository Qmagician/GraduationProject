var sqlMap = {
  pps: {
    insert:"insert into user(id,username,password,phone,isadmin) values(?,?,?,?,0)",
    update:'update user set phone=? where username=?',
    delete: 'delete from user where username=?',
    queryById: 'select * from user where id=?',
    queryByUserName: 'select * from user where username=?',
    queryByPassword: 'select * from user where password=?',
    queryAll: 'select * from user',
    queryRentNum:'select count(*) as num from parkinfo where subscriber=? and (endtime>=? and endtime <=?) and status=2',
    queryReleaseNum:'select count(*) as num from parkinfo where userid=? and endtime <?',
    queryAllPark: 'select * from parkInfo left join user on parkinfo.userid=user.id where userid!=? and endtime>? and status=0',
    queryUserPark: 'select * from parkinfo left join user on parkinfo.subscriber=user.id where userid=? order by status desc',
    reservePark: 'update parkInfo set status=1,subscriber=? where num=?',
    insertPark: 'insert into parkInfo(num,userid,parkcity,parkstreet,parkdetails,carseatnum,starttime,endtime,price,totalcost,imageurl,status) values(?,?,?,?,?,?,?,?,?,?,?,?)',
    updatePark: 'update parkInfo set parkcity=?,parkstreet=?,parkdetails=?,carseatnum=?,starttime=?,endtime=?,price=?,imageurl=?,status=? where num=?',
    deleteInfo:'delete from parkInfo where num=?',
    rejectOrder:"update parkInfo set status=0,subscriber=null where num=?",
    agreeOrder:'update parkInfo set status=2 where num=?',
    queryReserve:"select count(*) as num from parkinfo where userid=? and status=1",
  },
}

module.exports = sqlMap;