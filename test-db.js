// 删除 表格transactions 所有数据
const sqlite3 = require('sqlite3');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, './data/database.db'));

db.all("SELECT * FROM transactions where payee = '诺米商业有限公司'", (err, rows) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(rows); // 输出所有匹配记录
});

db.close();
