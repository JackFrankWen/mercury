// 删除 表格transactions 所有数据
const sqlite3 = require("sqlite3");
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "../data/database.db"));

db.run("DELETE FROM transactions");

db.close();

console.log("所有交易数据已删除");
