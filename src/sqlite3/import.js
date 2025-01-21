/* eslint-disable */
const sqlite3 = require('sqlite3');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
/* eslint-enable */

// 连接到SQLite数据库

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database connected and created if not exists');
    }
});

// 创建表
function createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS rules (
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

// 导入CSV数据
function importCSV(filepath) {
    return new Promise((resolve, reject) => {
        const results = [];
        
        fs.createReadStream(filepath)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', () => {
                const stmt = db.prepare(`
                    INSERT INTO rules (
                        rule, category, consumer, abc_type, 
                        cost_type, tag, creation_time, modification_time
                    ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `);

                results.forEach((row) => {
                    stmt.run([
                        row.rule,
                        row.category,
                        row.consumer,
                        row.abc_type,
                        row.cost_type,
                        row.tag
                    ]);
                });

                stmt.finalize();
                resolve();
            })
            .on('error', reject);
    });
}

// 主函数
async function main() {
    try {
        const dataDir = path.join(__dirname, '../../data/202410/match_rules.csv');
        if (!fs.existsSync(dataDir)) {
            throw new Error(`文件不存在: ${dataDir}`);
        }
        await createTable();
        await importCSV(dataDir);
        console.log('数据导入成功！');
    } catch (error) {
        console.error('导入失败:', error);
    } finally {
        db.close();
    }
}

main();
