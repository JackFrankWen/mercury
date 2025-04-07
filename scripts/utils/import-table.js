/* eslint-disable */
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

// 获取数据库路径
function getDbPath() {
  // 在开发环境中使用项目根目录
  const dbDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Check environment from either command line or stored preference
  const isDev = process.argv.includes('--dev');

  // You can add a way to access the stored environment here
  // For example, if you could require and use electron-store:
  // const Store = require('electron-store');
  // const store = new Store();
  // const storedEnv = store.get('environment', 'production');
  // const isTestEnv = isDev || storedEnv === 'test';

  const dbName = isDev ? 'database-test.db' : 'database.db';
  console.log(`Using database: ${dbName} (Dev mode: ${isDev})`);

  return path.join(dbDir, dbName);
}

// 连接到SQLite数据库
const db = new sqlite3.Database(getDbPath(), err => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected and created if not exists');
  }
});
// 创建规则表 自动
function createRuleAutoTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS "match_rules_auto" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payee TEXT,
        category TEXT,
        description TEXT, 
        account_type TEXT,
        payment_type TEXT,
        consumer TEXT,
        tag TEXT,
        creation_time DATETIME DEFAULT (datetime('now', '+8 hours')),
        modification_time DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;
  return executeSQL(sql);
}
// 创建规则表 手动添加
function createRuleTable() {
  /*
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rule TEXT, // 规则
    category TEXT,
    consumer TEXT,
    */
  const sql = `
        CREATE TABLE IF NOT EXISTS match_rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rule TEXT,
            category TEXT,
            consumer TEXT,
            tag TEXT,
            creation_time DATETIME DEFAULT (datetime('now', '+8 hours')),
            modification_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
  return executeSQL(sql);
}
// 创建高级规则表
function createAdvancedRuleTable() {
  /*
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rule TEXT, // 规则
    category TEXT,
    consumer TEXT,
    tag TEXT,
    active INTEGER,// 是否启用
    priority INTEGER,// 优先级
    creation_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    modification_time DATETIME DEFAULT CURRENT_TIMESTAMP
    */
  const sql = `
        CREATE TABLE IF NOT EXISTS "advanced_rules" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            rule TEXT,
            category TEXT,
            consumer TEXT,
            tag TEXT,
            active INTEGER,
            priority INTEGER,
            creation_time DATETIME DEFAULT (datetime('now', '+8 hours')),
            modification_time DATETIME DEFAULT (datetime('now', '+8 hours'))
        )
    `;
  return executeSQL(sql);
}
// 创建交易表
function createTransactionTable() {
  const sql = `
        CREATE TABLE IF NOT EXISTS "transactions" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount DECIMAL(10,2),
            payee TEXT,
            category TEXT DEFAULT '[100000,100003]',
            description TEXT, 
            account_type TEXT,
            payment_type TEXT,
            consumer TEXT,
            flow_type TEXT,
            account_name TEXT,
            tag TEXT,
            trans_time DATETIME,
            creation_time DATETIME DEFAULT (datetime('now', '+8 hours')),
            modification_time DATETIME DEFAULT (datetime('now', '+8 hours'))
        )
    `;
  return executeSQL(sql);
}

// 执行SQL
function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// 检查表是否存在
async function checkTableExists(tableName) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
      [tableName],
      (err, row) => {
        if (err) reject(err);
        resolve(!!row);
      }
    );
  });
}

module.exports = {
  db,
  createRuleTable,
  createAdvancedRuleTable,
  createTransactionTable,
  createRuleAutoTable,
  checkTableExists,
};
