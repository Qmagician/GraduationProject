var sqlMap = {
  pps: {
    insert:"INSERT INTO user(id,name) VALUES(100,'xxx')",
    update:'update user set name=? where id=?',
    delete: 'delete from user where id=?',
    queryById: 'select * from user where id=?',
    queryByUserName: 'select * from user where username=?',
    queryByPassword: 'select * from user where password=?',
    queryAll: 'select * from user'
  },
}

module.exports = sqlMap;