/* eslint-disable */
const sqlite3 = require('sqlite3');
const path = require('path');
/* eslint-enable */

// 连接到SQLite数据库
const db = new sqlite3.Database(path.join(__dirname, '../../../data/database.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database connected and created if not exists');
    }
});

// 创建规则表
function createRuleTable() {
    /*
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rule TEXT, // 规则
    category TEXT,
    consumer TEXT,
    abc_type TEXT,
    cost_type TEXT,
    */ 
    const sql = `
        CREATE TABLE IF NOT EXISTS match_rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rule TEXT,
            category TEXT,
            consumer TEXT,
            abc_type TEXT,
            cost_type TEXT,
            tag TEXT,
            creation_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            modification_time DATETIME DEFAULT CURRENT_TIMESTAMP
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
            tag TEXT,
            abc_type TEXT,
            cost_type TEXT,
            trans_time DATETIME,
            creation_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            modification_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    return executeSQL(sql);
}

// 执行SQL
function executeSQL(sql) {
    return new Promise((resolve, reject) => {
        db.run(sql, (err) => {
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
    createTransactionTable,
    checkTableExists
};
