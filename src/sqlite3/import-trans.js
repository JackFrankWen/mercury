/* eslint-disable */
const sqlite3 = require('sqlite3');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
/* eslint-enable */
// Connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, '../../data/database.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database connected and created if not exists');
    }
});

// Create transaction table
function createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS "transactions" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount DECIMAL(10,2),
            payee TEXT,
            category TEXT,
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

// Import CSV data
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
                console.log(`Read ${results.length} records`);
                
                const stmt = db.prepare(`
                    INSERT INTO "transactions" (
                        amount,
                        category,
                        description,
                        account_type,
                        payment_type, 
                        consumer,
                        flow_type,
                        tag,
                        abc_type,
                        cost_type,
                        trans_time
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                results.forEach((row) => {
                    try {
                        stmt.run([
                            row.amount,
                            row.category,
                            row.description,
                            row.account_type,
                            row.payment_type,
                            row.consumer,
                            row.flow_type, 
                            row.tag,
                            row.abc_type,
                            row.cost_type,
                            row.trans_time
                        ]);
                        successCount++;
                    } catch (err) {
                        console.error('Error inserting row:', err);
                        errorCount++;
                    }
                });

                stmt.finalize();
                console.log(`Import completed. Success: ${successCount}, Errors: ${errorCount}`);
                resolve();
            });
    });
}

// Execute
async function main() {
    try {
        const dataDir = path.join(__dirname, '../../data/202410/transaction.csv');
        if (!fs.existsSync(dataDir)) {
            throw new Error(`文件不存在: ${dataDir}`);
        }
        
        // 检查表是否存在,不存在才创建
        const tableExists = await new Promise((resolve, reject) => {
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='transactions'", (err, row) => {
                if (err) reject(err);
                resolve(!!row);
            });
        });
        
        if (!tableExists) {
            await createTable();
        }
        
        await importCSV(dataDir);

        console.log('Import process completed successfully');
    } catch (err) {
        console.error('Error during import process:', err);
        process.exit(1);
    } finally {
        db.close();
    }
}

main();
