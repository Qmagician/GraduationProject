var sqlMap = {
  blog: {
    insert:"INSERT INTO test(id,name) VALUES(100,'xxx')",
    update:'update test set name=? where id=?',
    delete: 'delete from test where id=?',
    queryById: 'select * from test where id=?',
    queryAll: 'select * from test'
  },
}

module.exports = sqlMap;