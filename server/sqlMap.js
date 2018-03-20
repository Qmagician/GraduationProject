var sqlMap = {
  pps: {
    insert:"INSERT INTO user(username,password,phone,isadmin) VALUES(?,?,?,0)",
    update:'update user set phone=? where username=?',
    delete: 'delete from user where username=?',
    queryById: 'select * from user where id=?',
    queryByUserName: 'select * from user where username=?',
    queryByPassword: 'select * from user where password=?',
    queryAll: 'select * from user'
  },
}

module.exports = sqlMap;