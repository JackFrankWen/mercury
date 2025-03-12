/* eslint-disable */
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { db, createAdvancedRuleTable, checkTableExists } = require('./import-table');
const { log } = require('console');
/* eslint-enable */

// 导入CSV数据
function importCSV(filepath) {
    return new Promise((resolve, reject) => {
        const results = [];
        let successCount = 0;
        let errorCount = 0;
        
        fs.createReadStream(filepath)
            .pipe(csv())
            .on('data', (data) => {
                results.push({
                    ...data,
                    // rule: JSON.stringify([[
                    //     {
                    //         condition: 'description',
                    //         formula: 'like',
                    //         value: data.rule
                    //     }
                    // ], [
                    //     {
                    //         condition: 'payee',
                    //         formula: 'like',
                    //         value: data.rule
                    //     }
                    // ]]),
                });
            })
            .on('end', () => {
                console.log(`读取到 ${results.length} 条高级规则数据`);
                
                const stmt = db.prepare(`
                    INSERT INTO advanced_rules (
                        rule, category, consumer, tag, priority, 
                        creation_time, modification_time
                    ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `);

                results.forEach((row) => {
                    try {
                        stmt.run([
                            row.rule,
                            row.category,
                            row.consumer,
                            row.tag,
                            row.priority || 1
                        ]);
                        successCount++;
                    } catch (err) {
                        console.error('导入行数据失败:', err);
                        errorCount++;
                    }
                });

                stmt.finalize();
                console.log(`成功导入 ${successCount} 条高级规则数据`);
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
        const dataDir = path.join(__dirname, '../exports/20250312-1523/advanced_rules.csv');
        if (!fs.existsSync(dataDir)) {
            throw new Error(`文件不存在: ${dataDir}`);
        }
        
        const tableExists = await checkTableExists('advanced_rules');
        if (!tableExists) {
            await createAdvancedRuleTable();
        }
        
        await importCSV(dataDir);
        
      
        console.log('高级规则数据导入成功！');
    } catch (error) {
        console.error('导入失败:', error);
    } finally {
        db.close();
    }
}

main();
