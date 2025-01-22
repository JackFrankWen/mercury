/* eslint-disable */
const sqlite3 = require('sqlite3');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
/* eslint-enable */

// 连接到SQLite数据库

const db = new sqlite3.Database(path.join(__dirname, '../../data/database.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database connected and created if not exists');
    }
});

// 创建表
function createTable() {
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
        let successCount = 0;
        let errorCount = 0;
        
        fs.createReadStream(filepath)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', () => {
                console.log(`读取到 ${results.length} 条数据`);
                
                const stmt = db.prepare(`
                    INSERT INTO match_rules (
                        rule, category, consumer, abc_type, 
                        cost_type, tag, creation_time, modification_time
                    ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `);

                results.forEach((row) => {
                    try {
                        stmt.run([
                            row.rule,
                            row.category,
                            row.consumer,
                            row.abc_type,
                            row.cost_type,
                            row.tag
                        ]);
                        successCount++;
                    } catch (err) {
                        console.error('导入行数据失败:', err);
                        errorCount++;
                    }
                });

                stmt.finalize();
                console.log(`成功导入 ${successCount} 条数据`);
                if (errorCount > 0) {
                    console.log(`失败 ${errorCount} 条数据`);
                }
                resolve({
                    total: results.length,
                    success: successCount,
                    error: errorCount
                });
            })
            .on('error', reject);
    });
}

// 主函数
async function main() {
    try {
        // 每次导入后数据被清空的原因是:
        // 1. createTable() 函数可能在创建表时使用了 "DROP TABLE IF EXISTS" 语句
        // 2. 这会导致每次运行时先删除已存在的表，再创建新表
        // 3. 建议修改 createTable() 函数，只在表不存在时才创建
        
        const dataDir = path.join(__dirname, '../../data/202410/match_rules.csv');
        if (!fs.existsSync(dataDir)) {
            throw new Error(`文件不存在: ${dataDir}`);
        }
        
        // 检查表是否存在,不存在才创建
        const tableExists = await new Promise((resolve, reject) => {
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='match_rules'", (err, row) => {
                if (err) reject(err);
                resolve(!!row);
            });
        });
        
        if (!tableExists) {
            await createTable();
        }
        
        await importCSV(dataDir);
        
        // 查询导入后的数据
        const rows = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM match_rules", (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        console.log('导入后的数据:', rows);
        console.log('数据导入成功！');
    } catch (error) {
        console.error('导入失败:', error);
    } finally {
        db.close();
    }
}

main();
